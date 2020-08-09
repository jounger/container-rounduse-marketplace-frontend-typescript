<template>
  <v-content>
    <v-card class="ma-5">
      <v-data-table
        :headers="headers"
        :items="biddingDocuments"
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
        <template v-slot:item.status="{ item }">
          <v-chip style="background-color:blueviolet" dark>{{
            item.outbound.status
          }}</v-chip>
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
          {{ item.outbound.booking.unit + " x " + item.outbound.containerType }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            class="ma-1"
            tile
            outlined
            color="info"
            @click="gotoDetail(item)"
            small
          >
            <v-icon left dense>details</v-icon> Chi tiết
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { ICombined } from "@/entity/combined";
import { IBiddingDocument } from "@/entity/bidding-document";
import Utils from "@/mixin/utils";
import { getBiddingDocumentsByExistCombined } from "@/api/bidding-document";
import { DataOptions } from "vuetify";

@Component({
  mixins: [Utils]
})
export default class Combined extends Vue {
  biddingDocuments: Array<IBiddingDocument> = [];
  loading = true;
  options = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
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
    { text: "Hãng tàu", value: "outbound.shippingLine" },
    { text: "Số cont", value: "unit" },
    { text: "Khối lượng hàng", value: "grossWeight" },
    { text: "Thời gian đóng hàng", value: "packingTime" },
    { text: "Thời gian tàu chạy", value: "cutOffTime" },
    { text: "Cảng đóng hàng", value: "outbound.booking.portOfLoading" },
    { text: "Trạng thái", value: "status" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  gotoDetail(item: ICombined) {
    const id = item.id;
    if (this.$auth.user().roles[0] == "ROLE_MERCHANT") {
      this.$router.push({ path: `/combined/${id}` });
    } else if (this.$auth.user().roles[0] == "ROLE_FORWARDER") {
      this.$router.push({ path: `/combined-forwarder/${id}` });
    }
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _biddingDocuments = await getBiddingDocumentsByExistCombined({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      });
      if (_biddingDocuments.data) {
        this.biddingDocuments = _biddingDocuments.data.data;
        this.serverSideOptions.totalItems =
          _biddingDocuments.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
