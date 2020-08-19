<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="biddingDocuments"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        show-expand
        @click:row="clicked"
        item-key="id"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
        no-data-text="Danh sách hàng đã ghép rỗng."
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Danh sách hàng đã ghép</v-toolbar-title>
          </v-toolbar>
        </template>
        <template v-slot:item.packingTime="{ item }">
          {{ formatDatetime(item.outbound.packingTime) }}
        </template>
        <template v-slot:item.cutOffTime="{ item }">
          {{ formatDatetime(item.outbound.booking.cutOffTime) }}
        </template>
        <template v-slot:item.grossWeight="{ item }">
          {{ item.outbound.grossWeight }} {{ item.outbound.unitOfMeasurement }}
        </template>
        <template v-slot:item.fcl="{ item }">
          {{ item.outbound.booking.isFcl ? "Có" : "Không" }}
        </template>
        <template v-slot:item.unit="{ item }">
          {{
            item.outbound.booking.unit +
              " x " +
              item.outbound.containerType.name
          }}
        </template>
        <!-- EDITING -->
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length" class="px-0">
            <v-data-table
              :headers="combinedHeaders"
              :items="combineds"
              :loading="loading"
              :options.sync="combinedOptions"
              :server-items-length="combinedServerSideOptions.totalItems"
              :footer-props="{
                'items-per-page-options':
                  combinedServerSideOptions.itemsPerPageItems
              }"
              :actions-append="combinedOptions.page"
              hide-default-footer
              disable-sort
              dense
              dark
            >
              <template v-slot:item.contract.required="{ item }">
                {{ item.contract.required ? "Có" : "Không" }}
              </template>
              <template v-slot:item.bid.bidPrice="{ item }">
                {{ currencyFormatter(item.bid.bidPrice) }}
              </template>
              <template v-slot:item.isCanceled="{ item }">
                <v-chip
                  :style="
                    item.isCanceled
                      ? 'background-color:red'
                      : 'background-color:green'
                  "
                  dark
                  x-small
                  >{{ item.isCanceled ? "Đã hủy" : "Đã ghép" }}</v-chip
                >
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  class="ma-1"
                  tile
                  outlined
                  color="info"
                  x-small
                  :to="`/combined/${item.id}`"
                >
                  <v-icon left dense>details</v-icon> Chi tiết
                </v-btn>
              </template>
            </v-data-table>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { ICombined } from "@/entity/combined";
import { IBiddingDocument } from "@/entity/bidding-document";
import Utils from "@/mixin/utils";
import { getBiddingDocumentsByExistCombined } from "@/api/bidding-document";
import { DataOptions } from "vuetify";
import { getCombinedsByBiddingDocument } from "@/api/combined";

@Component({
  mixins: [Utils]
})
export default class Combined extends Vue {
  biddingDocuments: Array<IBiddingDocument> = [];
  biddingDocument = null as IBiddingDocument | null;
  combineds: Array<ICombined> = [];
  loading = true;
  expanded: Array<IBiddingDocument> = [];
  singleExpand = true;
  options = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  combinedOptions = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  combinedServerSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  headers = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    { text: "Hãng tàu", value: "outbound.shippingLine.companyName" },
    { text: "Số cont", value: "unit" },
    { text: "Khối lượng hàng", value: "grossWeight" },
    { text: "Thời gian đóng hàng", value: "packingTime" },
    { text: "Nơi đóng hàng", value: "outbound.packingStation" },
    { text: "Thời gian Cut-off", value: "cutOffTime" },
    { text: "Cảng trả hàng", value: "outbound.booking.portOfLoading.fullname" }
  ];
  combinedHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id",
      class: "elevation-1 primary"
    },
    {
      text: "Nhà thầu",
      value: "bid.bidder.companyName",
      class: "elevation-1 primary"
    },
    {
      text: "Ngày trúng thầu",
      value: "bid.dateOfDecision",
      class: "elevation-1 primary"
    },
    {
      text: "Giá trúng thầu",
      value: "bid.bidPrice",
      class: "elevation-1 primary"
    },
    {
      text: "Y/c hợp đồng",
      value: "contract.required",
      class: "elevation-1 primary"
    },
    { text: "Trạng thái", value: "isCanceled", class: "elevation-1 primary" },
    {
      text: "Hành động",
      value: "actions",
      class: "elevation-1 primary"
    }
  ];

  async clicked(value: IBiddingDocument) {
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded.splice(0, this.expanded.length);
        this.biddingDocument = null;
      } else {
        if (this.expanded.length > 0) this.expanded = [];
        this.expanded.push(value);
        this.biddingDocument = value;
        await this.loadMoreCombineds({
          ...this.combinedOptions,
          page: 1
        });
      }
    }
  }

  async loadMoreCombineds(val: DataOptions) {
    if (this.biddingDocument) {
      const _res = await getCombinedsByBiddingDocument(
        this.biddingDocument.id as number,
        {
          page: val.page - 1,
          limit: val.itemsPerPage
        }
      );
      if (_res.data) {
        const _combineds = _res.data.data;
        this.combineds = _combineds;
        this.combinedServerSideOptions.totalItems = _res.data.totalElements;
      }
    }
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getBiddingDocumentsByExistCombined({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _biddingDocuments = _res.data.data;
        this.biddingDocuments = _biddingDocuments;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }

  @Watch("combinedOptions", { deep: true })
  async onCombinedOptionsChange(val: DataOptions, oldVal: DataOptions) {
    if (typeof val != "undefined" && val.page != oldVal.page) {
      this.loading = true;
      await this.loadMoreCombineds(val);
      this.loading = false;
    }
  }
}
</script>
