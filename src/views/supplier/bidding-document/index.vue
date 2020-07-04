<template>
  <v-content>
    <v-card>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-row justify="center">
        <DeleteBiddingDocument
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :biddingDocument="biddingDocument"
          :biddingDocuments.sync="biddingDocuments"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <CancelBiddingDocument
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :biddingDocument="biddingDocument"
          :biddingDocuments.sync="biddingDocuments"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <CreateBiddingDocument
        v-if="dialogAdd"
        :biddingDocuments.sync="biddingDocuments"
        :outbounds.sync="outbounds"
        :dialogAdd.sync="dialogAdd"
        :message.sync="message"
        :snackbar.sync="snackbar"
      />
      <UpdateBiddingDocument
        v-if="dialogEdit"
        :biddingDocument.sync="biddingDocument"
        :biddingDocuments.sync="biddingDocuments"
        :dialogEdit.sync="dialogEdit"
        :message.sync="message"
        :snackbar.sync="snackbar"
      />
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
        <!--  -->
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Danh sách đấu thầu</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" @click="dialogAdd = true">
              Thêm mới
            </v-btn>
          </v-toolbar>
        </template>
        <!--  -->
        <template v-slot:item.actions="{ item }">
          <v-menu :close-on-click="true">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="pink" icon outlined v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="openEditDialog(item)">
                <v-list-item-icon>
                  <v-icon small>edit</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Chỉnh sửa</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="openDetailDialog(item)">
                <v-list-item-icon>
                  <v-icon small>details</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xem trạng thái HSMT</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="openCancelDialog(item)">
                <v-list-item-icon>
                  <v-icon small>cancel_presentation</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Đóng băng HSMT</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="openDeleteDialog(item)">
                <v-list-item-icon>
                  <v-icon small>delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xóa</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IBiddingDocument } from "@/entity/bidding-document";
import CreateBiddingDocument from "./components/CreateBiddingDocument.vue";
import UpdateBiddingDocument from "./components/UpdateBiddingDocument.vue";
import Snackbar from "@/components/Snackbar.vue";
import { IOutbound } from "@/entity/outbound";
import { getBiddingDocuments } from "@/api/bidding-document";
import { PaginationResponse } from "@/api/payload";
import DeleteBiddingDocument from "./components/DeleteBiddingDocument.vue";
import CancelBiddingDocument from "./components/CancelBiddingDocument.vue";

@Component({
  components: {
    CreateBiddingDocument,
    UpdateBiddingDocument,
    DeleteBiddingDocument,
    CancelBiddingDocument,
    Snackbar
  }
})
export default class BiddingDocument extends Vue {
  biddingDocuments: Array<IBiddingDocument> = [];
  biddingDocument = {} as IBiddingDocument;
  outbounds: Array<IOutbound> = [];
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
    { text: "Trạng thái", value: "outbound.status" },
    { text: "Giá gói thầu", value: "bidPackagePrice" },
    { text: "Mở thầu", value: "bidOpening" },
    { text: "Đóng thầu", value: "bidClosing" },
    { text: "Nhiều thầu win", value: "isMultipleAward" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  openEditDialog(item: IBiddingDocument) {
    this.biddingDocument = item;
    this.dialogEdit = true;
  }

  openDeleteDialog(item: IBiddingDocument) {
    this.biddingDocument = item;
    this.dialogDel = true;
  }
  openDetailDialog(item: IBiddingDocument) {
    this.$router.push({ path: `/bidding-document/${item.id}` });
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
          console.log("watch", response);
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
