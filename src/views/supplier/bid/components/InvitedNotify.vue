<template>
  <v-content>
    <v-card class="ma-5">
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <CreateBid
        v-if="dialogAdd"
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
            <v-toolbar-title>HSMT nhận được</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" @click="dialogAdd = true">
              Thêm mới
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            class="ma-1"
            tile
            outlined
            color="success"
            @click.stop="openAddDialog(item)"
            small
          >
            <v-icon left>mdi-pencil</v-icon> Đồng ý
          </v-btn>
          <v-btn
            class="ma-1"
            tile
            outlined
            color="error"
            @click.stop="openDeleteDialog(item)"
            small
          >
            <v-icon left>mdi-pencil</v-icon> Từ chối
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IBiddingDocument } from "@/entity/bidding-document";
import CreateBid from "./CreateBid.vue";
import Snackbar from "@/components/Snackbar.vue";
import { PaginationResponse } from "@/api/payload";
import { IBiddingNotification } from "@/entity/bidding-notification";
import { getBiddingNotificationsByUser } from "@/api/notification";
import { IBid } from "@/entity/bid";

@Component({
  components: {
    CreateBid,
    Snackbar
  }
})
export default class InvitedNotify extends Vue {
  biddingNotifications: Array<IBiddingNotification> = [];
  biddingNotification = {} as IBiddingNotification;

  biddingDocuments: Array<IBiddingDocument> = [];
  biddingDocument = {} as IBiddingDocument;
  bids: Array<IBid> = [];
  dialogAdd = false;
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
    { text: "Mở thầu", value: "bidOpening" },
    { text: "Đóng thầu", value: "bidClosing" },
    { text: "Nhiều thầu win", value: "isMultipleAward" },
    { text: "Actions", value: "actions", sortable: false }
  ];

  bidHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    { text: "Cont qty", value: "containers.length" },
    { text: "Giá thầu", value: "bidPrice" },
    { text: "Ngày thầu", value: "bidDate" },
    { text: "Hiệu lực", value: "bidValidityPeriod" },
    { text: "Actions", value: "actions", sortable: false }
  ];

  openAddDialog(item: IBiddingDocument) {
    this.biddingDocument = item;
    this.dialogAdd = true;
  }

  openDeleteDialog(item: IBiddingDocument) {
    this.biddingDocument = item;
    this.dialogDel = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    console.log(this.$auth.user());
    if (val !== oldVal) {
      getBiddingNotificationsByUser({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage,
        status: "ADDED"
      })
        .then(res => {
          const response: PaginationResponse<IBiddingNotification> = res.data;
          console.log("watch", response);
          this.biddingDocuments = response.data.reduce(function(
            pV: Array<IBiddingDocument>,
            cV: IBiddingNotification
          ) {
            pV.push(cV.relatedResource);
            return pV;
          },
          []);
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