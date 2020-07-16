<template>
  <v-content>
    <v-container
      class="d-flex justify-space-around align-start mb-6 mx-1"
      style="max-width: 1510px!important"
    >
      <v-card class="order-0 flex-grow-0 mx-auto mr-5 my-12" width="320">
        <v-card-title><v-icon large>mdi-magnify</v-icon>Tìm kiếm</v-card-title>
        <v-divider inset></v-divider>
        <v-card-text>
          <v-layout col
            ><v-layout row
              ><v-flex xs10>
                <v-text-field
                  v-model="shippingLineSearch"
                  prepend-icon="money"
                  type="text"
                  label="Hãng tàu"
                ></v-text-field> </v-flex></v-layout
          ></v-layout>
          <v-layout col
            ><v-layout row
              ><v-flex xs10>
                <v-select
                  v-model="containerTypeSearch"
                  prepend-icon="strikethrough_s"
                  :items="containerTypesToString"
                  label="Loại cont"
                ></v-select> </v-flex></v-layout
          ></v-layout>
          <v-layout col
            ><v-layout row
              ><v-flex xs10>
                <v-text-field
                  v-model="bookingNumberSearch"
                  prepend-icon="money"
                  type="text"
                  label="Mã booking"
                ></v-text-field> </v-flex></v-layout
          ></v-layout>
          <v-layout col
            ><v-layout row
              ><v-flex xs10>
                <v-select
                  v-model="statusSearch"
                  prepend-icon="strikethrough_s"
                  :items="status"
                  label="Trạng thái"
                ></v-select> </v-flex></v-layout
          ></v-layout>
          <v-row justify="center" v-if="!moreOptions">
            <a @click="moreOptions = true">Nâng cao</a>
          </v-row>
          <v-divider inset></v-divider>
          <div v-if="moreOptions">
            <v-layout col
              ><v-layout row>
                <v-icon>money</v-icon
                ><span
                  style="font-size: 17px;
    margin-left: 10px;
    font-weight: bold;"
                  >Giá gói thầu</span
                >
              </v-layout></v-layout
            >
            <v-layout col
              ><v-layout row
                ><v-flex xs8>
                  <v-text-field
                    v-model="minBidPackagePrice"
                    type="number"
                    label="Từ"
                  ></v-text-field> </v-flex
              ></v-layout>
              <v-layout row
                ><v-flex xs8>
                  <v-text-field
                    v-model="maxBidPackagePrice"
                    type="number"
                    label="Đến"
                  ></v-text-field> </v-flex></v-layout
            ></v-layout>
            <v-divider inset></v-divider>
            <v-layout col
              ><v-layout row>
                <v-icon>date_range</v-icon
                ><span
                  style="font-size: 17px;
    margin-left: 10px;
    font-weight: bold;"
                  >Thời gian thầu</span
                >
              </v-layout></v-layout
            >
            <v-layout col
              ><v-layout row
                ><v-flex xs8>
                  <v-menu
                    ref="bidOpeningPicker"
                    v-model="bidOpeningPicker"
                    :close-on-content-click="false"
                    :return-value.sync="bidOpeningSearch"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="bidOpeningSearch"
                        label="Từ ngày"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="bidOpeningSearch"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="bidOpeningPicker = false"
                        >Cancel</v-btn
                      >
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.bidOpeningPicker.save(bidOpeningSearch)"
                        >OK</v-btn
                      >
                    </v-date-picker>
                  </v-menu>
                </v-flex></v-layout
              >
              <v-layout row
                ><v-flex xs8>
                  <v-menu
                    ref="bidClosingPicker"
                    v-model="bidClosingPicker"
                    :close-on-content-click="false"
                    :return-value.sync="bidClosingSearch"
                    transition="scale-transition"
                    offset-y
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="bidClosingSearch"
                        label="Đến ngày"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="bidClosingSearch"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        text
                        color="primary"
                        @click="bidClosingPicker = false"
                        >Cancel</v-btn
                      >
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.bidClosingPicker.save(bidClosingSearch)"
                        >OK</v-btn
                      >
                    </v-date-picker>
                  </v-menu>
                </v-flex></v-layout
              ></v-layout
            >
            <v-divider inset></v-divider>
            <v-layout col
              ><v-layout row>
                <v-checkbox v-model="isMultipleAwardSearch">
                  <template v-slot:label>
                    <div style="margin-left: 5px;">
                      Nhiều thầu win
                    </div>
                  </template>
                </v-checkbox>
              </v-layout></v-layout
            >
            <v-row justify="center">
              <a @click="moreOptions = false">Giảm bớt</a>
            </v-row>
            <v-divider inset></v-divider>
          </div>
          <v-layout col>
            <v-row justify="center">
              <v-btn class="primary" @click="searchBiddingDocument()"
                >Tìm kiếm</v-btn
              >
            </v-row>
          </v-layout>
        </v-card-text>
      </v-card>
      <v-card class="order-1 flex-grow-1 mx-auto my-12">
        <Snackbar :text="message" :snackbar.sync="snackbar" />
        <v-row justify="center">
          <DeleteBiddingDocument
            v-if="dialogDel"
            :dialogDel.sync="dialogDel"
            :biddingDocument="biddingDocument"
            :biddingDocuments.sync="biddingDocuments"
            :totalItems.sync="options.totalItems"
            :message.sync="message"
            :snackbar.sync="snackbar"
          />
        </v-row>
        <v-row justify="center">
          <CancelBiddingDocument
            v-if="dialogCancel"
            :dialogCancel.sync="dialogCancel"
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
          :totalItems.sync="options.totalItems"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
        <UpdateBiddingDocument
          v-if="dialogEdit"
          :biddingDocument="biddingDocument"
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
          :footer-props="{
            'items-per-page-options': options.itemsPerPageItems
          }"
          :actions-append="options.page"
          @click:row="clicked"
          class="elevation-1"
        >
          <!--  -->
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Danh sách đấu thầu</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                dark
                class="mb-2"
                @click="dialogAdd = true"
              >
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
                <v-list-item
                  @click.stop="openEditDialog(item)"
                  v-if="item.status == 'BIDDING'"
                >
                  <v-list-item-icon>
                    <v-icon small>edit</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Chỉnh sửa</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  @click.stop="openEditDialog(item)"
                  v-if="item.status == 'CANCELED'"
                >
                  <v-list-item-icon>
                    <v-icon small>edit</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Mở lại thầu</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click.stop="openDetailDialog(item)">
                  <v-list-item-icon>
                    <v-icon small>details</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Xem trạng thái HSMT</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  @click.stop="openCancelDialog(item)"
                  v-if="item.status == 'BIDDING'"
                >
                  <v-list-item-icon>
                    <v-icon small>cancel_presentation</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Hủy thầu</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  @click.stop="openDeleteDialog(item)"
                  v-if="item.status != 'COMBINED'"
                >
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
          <template v-slot:item.bidOpeningText="{ item }">
            {{ formatDatetime(item.bidOpening) }}
          </template>
          <template v-slot:item.bidClosingText="{ item }">
            {{ formatDatetime(item.bidClosing) }}
          </template>
          <template v-slot:item.bidPackagePrice="{ item }">
            {{ currencyFormatter(item.bidPackagePrice) }}
          </template>
        </v-data-table>
      </v-card>
    </v-container>
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
import Utils from "@/mixin/utils";
import { getContainerTypes } from "@/api/container-type";
import { IContainerType } from "@/entity/container-type";

@Component({
  mixins: [Utils],
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
  dialogCancel = false;
  dialogDel = false;
  moreOptions = false;
  bidOpeningPicker = false;
  bidClosingPicker = false;
  shippingLineSearch = "";
  containerTypeSearch = "";
  bookingNumberSearch = "";
  statusSearch = "";
  minBidPackagePrice = "";
  maxBidPackagePrice = "";
  isMultipleAwardSearch = false;
  bidOpeningSearch = "";
  bidClosingSearch = "";
  message = "";
  search = "";
  containerTypes: Array<IContainerType> = [];
  status: Array<string> = [];
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
    { text: "Trạng thái", value: "status" },
    { text: "Giá gói thầu", value: "bidPackagePrice" },
    { text: "Mở thầu", value: "bidOpeningText" },
    { text: "Đóng thầu", value: "bidClosingText" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  openEditDialog(item: IBiddingDocument) {
    this.biddingDocument = item;
    this.dialogEdit = true;
  }

  openCancelDialog(item: IBiddingDocument) {
    this.biddingDocument = item;
    this.dialogCancel = true;
  }

  openDeleteDialog(item: IBiddingDocument) {
    this.biddingDocument = item;
    this.dialogDel = true;
  }
  openDetailDialog(item: IBiddingDocument) {
    this.$router.push({ path: `/bidding-document/${item.id}` });
  }

  clicked(value: IBiddingDocument) {
    this.$router.push({ path: `/bidding-document/${value.id}` });
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
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

  searchBiddingDocument() {
    console.log(1);
  }
  created() {
    this.status = ["BIDDING", "COMBINED", "CANCELED"];
    getContainerTypes({
      page: this.options.page - 1,
      limit: this.options.itemsPerPage
    })
      .then(res => {
        const response: PaginationResponse<IContainerType> = res.data;
        this.containerTypes = response.data;
      })
      .catch(err => console.log(err))
      .finally();
  }
  get containerTypesToString() {
    return this.containerTypes.map(x => x.name);
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
