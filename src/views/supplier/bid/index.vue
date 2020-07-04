<template>
  <v-content>
    <v-card class="ma-5">
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <CreateBid
        v-if="dialogAdd"
        :bid.sync="bid"
        :biddingDocument.sync="biddingDocument"
        :bids.sync="bids"
        :dialogAdd.sync="dialogAdd"
        :message.sync="message"
        :snackbar.sync="snackbar"
      />
      <!-- <UpdateBid
        v-if="dialogEdit"
        :bid.sync="bid"
        :dialogEdit.sync="dialogEdit"
        :message.sync="message"
        :snackbar.sync="snackbar"
      /> -->
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
        :server-items-length="options.totalItems"
        :footer-props="{ 'items-per-page-options': options.itemsPerPageItems }"
        :actions-append="options.page"
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
        <template v-slot:item.bidOpeningText="{ item }">
          {{ formatDatetime(item.bidOpening) }}
        </template>
        <template v-slot:item.bidClosingText="{ item }">
          {{ formatDatetime(item.bidClosing) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            class="ma-1"
            tile
            outlined
            color="success"
            @click="openAddDialog(item)"
            small
          >
            <v-icon left>mdi-pencil</v-icon> Thêm HSDT
          </v-btn>
        </template>
        <!-- Show Bids expened -->
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length" class="px-0">
            <v-data-table
              :headers="bidHeaders"
              :items="bids"
              :hide-default-footer="true"
              dense
              dark
            >
              <template v-slot:item.bidDateText="{ item }">
                {{ formatDatetime(item.bidDate) }}
              </template>
              <template v-slot:item.bidValidityPeriodText="{ item }">
                {{ formatDatetime(item.bidValidityPeriod) }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="openEditDialog(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="openDeleteDialog(item)">
                  mdi-delete
                </v-icon>
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
import Snackbar from "@/components/Snackbar.vue";
import { PaginationResponse } from "@/api/payload";
import { getBidByBiddingDocumentAndForwarder } from "@/api/bid";
import Utils from "@/mixin/utils";

@Component({
  mixins: [Utils],
  components: {
    CreateBid,
    // UpdateBid,
    Snackbar
  }
})
export default class Bid extends Vue {
  biddingDocuments: Array<IBiddingDocument> = [];
  biddingDocument = {} as IBiddingDocument;
  bids: Array<IBid> = [];
  bid = {} as IBid;
  expanded: Array<IBiddingDocument> = [];
  singleExpand = true;
  dialogAdd = false;
  dialogEdit = false;
  dialogDel = false;
  search = "";
  message = "";
  snackbar = false;
  loading = true;
  dateInit = new Date().toISOString().substr(0, 10);
  options = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
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
    { text: "Mã booking", value: "outbound.booking.bookingNumber" },
    { text: "Giá gói thầu", value: "bidPackagePrice" },
    { text: "Mở thầu", value: "bidOpeningText" },
    { text: "Đóng thầu", value: "bidClosingText" },
    { text: "Nhiều thầu win", value: "isMultipleAward" },
    { text: "Actions", value: "actions", sortable: false }
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
      text: "Cont qty",
      value: "containers.length",
      class: "elevation-1 primary"
    },
    { text: "Giá thầu", value: "bidPrice", class: "elevation-1 primary" },
    { text: "Ngày thầu", value: "bidDateText", class: "elevation-1 primary" },
    {
      text: "Hiệu lực",
      value: "bidValidityPeriodText",
      class: "elevation-1 primary"
    },
    {
      text: "Actions",
      value: "actions",
      sortable: false,
      class: "elevation-1 primary"
    }
  ];
  getBids(item: IBiddingDocument) {
    if (item.id) {
      getBidByBiddingDocumentAndForwarder(item.id)
        .then(res => {
          const response = res.data;
          if (this.bids.length == 0) {
            this.bids.push(response);
          } else {
            this.bids.splice(0, 1, response);
          }
        })
        .catch(err => {
          console.log(err);
        })
        .finally();
    }
    return this.bids;
  }
  clicked(value: IBiddingDocument) {
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded.splice(0, this.expanded.length);
      } else {
        this.expanded.splice(0, this.expanded.length);
        this.getBids(value);
        this.expanded.push(value);
      }
    } else {
      const index = this.expanded.findIndex(x => x.id === value.id);
      if (index === -1) {
        this.getBids(value);
        this.expanded.push(value);
      } else {
        this.expanded.splice(index, 1);
      }
    }
  }

  openAddDialog(item: IBiddingDocument) {
    this.biddingDocument = item;
    this.dialogAdd = true;
  }
  openCreateDialog() {
    this.biddingDocument = {} as IBiddingDocument;
    this.dialogAdd = true;
  }

  openEditDialog(item: IBid) {
    this.bid = item;
    this.dialogEdit = true;
  }

  openDeleteDialog(item: IBid) {
    this.bid = item;
    this.dialogDel = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    console.log(this.$auth.user());
    if (val !== oldVal) {
      getBiddingDocuments({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IBiddingDocument> = res.data;
          console.log("watch", response.data);
          this.biddingDocuments = response.data;
          this.options.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
}
</script>
<style type="text/css">
.line {
  margin-top: 10px;
  width: 520px;
  border-bottom: 1px solid black;
  position: absolute;
}
</style>
