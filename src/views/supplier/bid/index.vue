<template>
  <v-content>
    <v-card class="ma-5">
      <CreateBid
        v-if="dialogAdd"
        :bid.sync="bid"
        :biddingDocument.sync="biddingDocument"
        :bids.sync="bids"
        :dialogAdd.sync="dialogAdd"
        :totalItems.sync="serverSideOptions.totalItems"
      />
      <UpdateBid
        v-if="dialogEdit"
        :bid.sync="bid"
        :bids.sync="bids"
        :biddingDocument.sync="biddingDocument"
        :dialogEdit.sync="dialogEdit"
      />
      <v-row justify="center">
        <CancelBid
          v-if="dialogCancel"
          :dialogCancel.sync="dialogCancel"
          :bid="bid"
          :bids.sync="bids"
        />
      </v-row>
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
        no-data-text="Danh sách HSMT đã tham gia rỗng."
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Danh sách Hồ sơ dự thầu</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              dark
              class="mb-2"
              @click="openCreateDialog()"
            >
              Thêm mới
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item.bidOpening="{ item }">
          {{ formatDatetime(item.bidOpening) }}
        </template>
        <template v-slot:item.bidClosing="{ item }">
          {{ formatDatetime(item.bidClosing) }}
        </template>

        <template v-slot:item.bidPackagePrice="{ item }">
          {{ currencyFormatter(item.bidPackagePrice) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            class="ma-1"
            tile
            outlined
            color="info"
            @click.stop="openBiddingDocumentDetail(item)"
            small
          >
            <v-icon left dense>details</v-icon> Chi tiết
          </v-btn>
        </template>
        <!-- Show Bids expened -->
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length" class="px-0">
            <v-data-table
              :headers="bidHeaders"
              :items="bids"
              :hide-default-footer="true"
              no-data-text="Danh sách Hồ sơ dự thầu rỗng."
              disable-sort
              dense
              dark
            >
              <template v-slot:item.bidDate="{ item }">
                {{ formatDatetime(item.bidDate) }}
              </template>
              <template v-slot:item.bidValidityPeriod="{ item }">
                {{ formatDatetime(item.bidValidityPeriod) }}
              </template>
              <template v-slot:item.status="{ item }">
                <v-chip
                  :style="
                    item.status == 'ACCEPTED'
                      ? 'background-color:green'
                      : item.status == 'REJECTED'
                      ? 'background-color:red'
                      : item.status == 'EXPIRED'
                      ? 'background-color:cadetblue'
                      : 'background-color:darkgoldenrod'
                  "
                  dark
                  x-small
                  >{{ item.status }}</v-chip
                >
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="openEditDialog(item)"
                  v-if="item.status == 'PENDING'"
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                  small
                  @click="openCancelDialog(item)"
                  v-if="item.status == 'PENDING'"
                >
                  close
                </v-icon>
              </template>
              <template v-slot:item.bidPrice="{ item }">
                {{ currencyFormatter(item.bidPrice) }}
              </template>
            </v-data-table>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IBid } from "@/entity/bid";
import { IBiddingDocument } from "@/entity/bidding-document";
import CreateBid from "./components/CreateBid.vue";
import { getBiddingDocuments } from "@/api/bidding-document";
import Utils from "@/mixin/utils";
import UpdateBid from "./components/UpdateBid.vue";
import CancelBid from "./components/CancelBid.vue";
import { DataOptions } from "vuetify";
import { getBidsByBiddingDocument } from "@/api/bid";

@Component({
  mixins: [Utils],
  components: {
    CreateBid,
    UpdateBid,
    CancelBid
  }
})
export default class Bid extends Vue {
  biddingDocuments: Array<IBiddingDocument> = [];
  biddingDocument = null as IBiddingDocument | null;
  bids: Array<IBid> = [];
  bid = null as IBid | null;
  expanded: Array<IBiddingDocument> = [];
  singleExpand = true;
  dialogAdd = false;
  dialogEdit = false;
  dialogCancel = false;
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
    { text: "Loại cont", value: "outbound.containerType" },
    { text: "Giá gói thầu", value: "bidPackagePrice" },
    { text: "Mở thầu", value: "bidOpening" },
    { text: "Đóng thầu", value: "bidClosing" },
    { text: "Nhiều thầu win", value: "isMultipleAward" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  bidHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id",
      class: "elevation-1 primary"
    },
    {
      text: "Số lượng Cont",
      value: "containers.length",
      class: "elevation-1 primary"
    },
    { text: "Giá thầu", value: "bidPrice", class: "elevation-1 primary" },
    { text: "Ngày thầu", value: "bidDate", class: "elevation-1 primary" },
    {
      text: "Hiệu lực",
      value: "bidValidityPeriod",
      class: "elevation-1 primary"
    },
    { text: "Trạng thái", value: "status", class: "elevation-1 primary" },
    {
      text: "Hành động",
      value: "actions",
      sortable: false,
      class: "elevation-1 primary"
    }
  ];

  openBiddingDocumentDetail(value: IBiddingDocument) {
    this.$router.push({
      path: `/bidding-document/${value.id}`
    });
  }

  async getBids(item: IBiddingDocument) {
    this.loading = true;
    const _res = await getBidsByBiddingDocument(item.id as number, {
      page: 0,
      limit: 10
    });
    if (_res.data) {
      const _bids = _res.data.data;
      if (this.bids.length == 0) {
        this.bids.push(_bids[0]);
      } else {
        this.bids.splice(0, 1, _bids[0]);
      }
    }
    this.loading = false;
    return this.bids;
  }

  async clicked(value: IBiddingDocument) {
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded.splice(0, this.expanded.length);
        this.biddingDocument = {} as IBiddingDocument;
      } else {
        this.expanded.splice(0, this.expanded.length);
        await this.getBids(value);
        this.expanded.push(value);
        this.biddingDocument = value;
      }
    }
  }

  openCreateDialog() {
    this.biddingDocument = {} as IBiddingDocument;
    this.dialogAdd = true;
  }

  openEditDialog(item: IBid) {
    if (new Date().getTime() - new Date(item.bidValidityPeriod).getTime() > 0) {
      this.bid = item;
      this.dialogEdit = true;
    }
  }

  openCancelDialog(item: IBid) {
    if (new Date().getTime() - new Date(item.bidValidityPeriod).getTime() > 0) {
      this.bid = item;
      this.dialogCancel = true;
    }
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getBiddingDocuments({
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
}
</script>
