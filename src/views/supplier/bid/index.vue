<template>
  <v-content>
    <v-card>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <CreateBid
        v-if="dialogAdd"
        :bid.sync="bid"
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
            <v-toolbar-title>Danh sách đấu thầu</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
          </v-toolbar>
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
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length" class="px-0">
            <v-data-table
              :headers="bidHeaders"
              :items="item.bids"
              :hide-default-footer="true"
              dark
              dense
            >
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
import { Component, PropSync, Watch, Vue } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import { IBid } from "@/entity/bid";
import { IBiddingDocument } from "@/entity/bidding-document";
import CreateBid from "./components/CreateBid.vue";
// import UpdateBid from "./components/UpdateBid.vue";
// import { getBidByForwarder } from "@/api/bid";
// import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";
import { BiddingDocumentData } from "./data";

@Component({
  components: {
    CreateBid,
    // UpdateBid,
    Snackbar
  }
})
export default class Bid extends Vue {
  @PropSync("layout") layoutSync!: object;

  biddingDocuments: Array<IBiddingDocument> = [];
  biddingDocument = {} as IBiddingDocument;
  bids: Array<IBid> = [];
  bid = {} as IBid;
  expanded = [];
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

  created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }

  openAddDialog(item: IBiddingDocument) {
    this.biddingDocument = item;
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
      console.log(BiddingDocumentData);
      this.biddingDocuments = BiddingDocumentData;
      this.loading = false;
      this.options.totalItems = 10;
      /*
      getBidByForwarder(this.$auth.user().id, {
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IBid> = res.data;
          console.log("watch", this.options);
          this.bids = response.data;
          this.options.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
        */
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
