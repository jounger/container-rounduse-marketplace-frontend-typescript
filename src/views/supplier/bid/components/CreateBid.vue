<template>
  <v-dialog
    v-model="dialogAddSync"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogAddSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Thêm mới Bid</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialogAddSync = false">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-list three-line subheader>
        <v-stepper v-model="stepper" vertical>
          <v-stepper-step :complete="stepper > 1" step="1" :editable="editable">
            Chọn HSMT
            <small>Thông tin bắt buộc</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-data-table
              :headers="headers"
              :items="biddingDocuments"
              item-key="id"
              :loading="loading"
              :optionsBiddingDocument.sync="optionsBiddingDocument"
              :server-items-length="optionsBiddingDocument.totalItems"
              :footer-props="{
                'items-per-page-options':
                  optionsBiddingDocument.itemsPerPageItems
              }"
              :actions-append="optionsBiddingDocument.page"
              class="elevation-1 my-1"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>HSMT nhận được</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  class="ma-2"
                  tile
                  outlined
                  color="success"
                  @click="selectBiddingDocument(item)"
                >
                  <v-icon left>mdi-pencil</v-icon>
                  {{
                    biddingDocumentSelected &&
                    biddingDocumentSelected.id == item.id
                      ? "Bỏ"
                      : "Chọn"
                  }}
                </v-btn>
              </template>
            </v-data-table>
            <v-btn
              color="primary"
              @click="
                !isEmptyObject(biddingDocumentSelected)
                  ? (stepper = 2)
                  : (stepper = 1)
              "
              :disabled="isEmptyObject(biddingDocumentSelected)"
              >Tiếp tục</v-btn
            >
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable">
            Thông tin HSDT
            <small>Thông tin chung</small>
          </v-stepper-step>

          <v-stepper-content step="2">
            <v-form ref="bidForm" v-model="valid" lazy-validation>
              <v-text-field
                v-model="bidLocal.bidPrice"
                type="number"
                :rules="[
                  minNumber('bid price', biddingDocumentSync.bidFloorPrice + 1)
                ]"
                label="Giá gửi thầu"
              ></v-text-field>
              <v-menu
                ref="datePickerMenu"
                v-model="datePickerMenu"
                :close-on-content-click="false"
                :return-value.sync="bidLocal.bidDate"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="bidLocal.bidDate"
                    label="Thời gian gửi thầu"
                    prepend-icon="event"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="bidLocal.bidDate"
                  no-title
                  scrollable
                  readonly
                  disabled
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="datePickerMenu = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.datePickerMenu.save(bidLocal.bidDate)"
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>

              <v-menu
                ref="datePickerMenu2"
                v-model="datePickerMenu2"
                :close-on-content-click="false"
                :return-value.sync="bidLocal.bidValidityPeriod"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="bidLocal.bidValidityPeriod"
                    label="Hiệu lực HSDT"
                    prepend-icon="event"
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="bidLocal.bidValidityPeriod"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="datePickerMenu2 = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    text
                    color="primary"
                    @click="
                      $refs.datePickerMenu2.save(bidLocal.bidValidityPeriod)
                    "
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>
              <v-text-field
                label="Label Text"
                value="12:30:00"
                type="time"
                suffix="PST"
              ></v-text-field>
              <v-btn
                color="primary"
                @click="valid ? (stepper = 3) : (stepper = 2)"
                :disabled="!valid"
                >Tiếp tục</v-btn
              >
              <v-btn text @click="stepper = 1">Quay lại</v-btn>
            </v-form>
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 3" step="3" :editable="editable"
            >Chọn containers mong muốn</v-stepper-step
          >

          <!-- SELECT CONTAINER -->
          <v-stepper-content step="3">
            <v-tabs background-color="white" color="deep-purple accent-4" left>
              <v-tab>Danh sach Inbound</v-tab>
              <v-tab>Selected Containers</v-tab>

              <v-tab-item>
                <v-container fluid>
                  <v-data-table
                    :headers="inboundHeaders"
                    :items="inbounds"
                    :single-expand="true"
                    :expanded.sync="expanded"
                    show-expand
                    @click:row="clicked"
                    item-key="id"
                    :loading="loading"
                    :options.sync="options"
                    :server-items-length="options.totalItems"
                    :footer-props="{
                      'items-per-page-options': options.itemsPerPageItems
                    }"
                    :actions-append="options.page"
                    class="elevation-1 my-1"
                  >
                    <template v-slot:item.pickUpTime="{ item }">
                      {{ formatDatetime(item.pickupTime) }}
                    </template>
                    <template v-slot:item.status="{ item }">
                      {{
                        typeof item.billOfLading !== "undefined"
                          ? item.billOfLading.containers[0].status
                          : ""
                      }}
                    </template>
                    <!-- Show containers expened -->
                    <template v-slot:expanded-item="{ headers, item }">
                      <td :colspan="headers.length" class="px-0">
                        <v-data-table
                          :headers="containerHeaders"
                          :items="item.billOfLading.containers"
                          :hide-default-footer="true"
                          dark
                          dense
                        >
                          <template v-slot:item.actions="{ item }">
                            <v-btn
                              class="ma-1"
                              x-small
                              tile
                              outlined
                              color="success"
                              @click="selectContainer(item)"
                            >
                              <v-icon left>mdi-pencil</v-icon>
                              {{ checkDuplicateSelect(item) ? "Bỏ" : "Chọn" }}
                            </v-btn>
                          </template>
                        </v-data-table>
                      </td>
                    </template>
                  </v-data-table>
                </v-container>
              </v-tab-item>
              <v-tab-item>
                <v-container fluid>
                  <v-data-table
                    :headers="containerHeaders"
                    :items="containers"
                    item-key="id"
                    :footer-props="{
                      'items-per-page-options': options.itemsPerPageItems
                    }"
                    dense
                  >
                    <template v-slot:item.actions="{ item }">
                      <v-btn
                        class="ma-1"
                        x-small
                        tile
                        outlined
                        color="success"
                        @click="selectContainer(item)"
                      >
                        <v-icon left>mdi-pencil</v-icon>
                        {{ checkDuplicateSelect(item) ? "Bỏ" : "Chọn" }}
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-container>
              </v-tab-item>
            </v-tabs>
            <v-btn color="primary" @click="stepper = 4" :disabled="!valid"
              >Tiếp tục</v-btn
            >
            <v-btn text @click="stepper = 2">Quay lại</v-btn>
          </v-stepper-content>

          <v-stepper-step step="4">Hoàn thành</v-stepper-step>
          <v-stepper-content step="4">
            <v-form ref="finishForm" v-model="valid" lazy-validation>
              <v-checkbox
                v-model="checkbox"
                :rules="[required('agree term')]"
                label="Bạn đồng ý rằng tất cả các thông tin đưa lên đều là chính xác."
              ></v-checkbox>
              <v-btn color="primary" @click="createBid()" :disabled="!valid"
                >Hoàn tất</v-btn
              >
              <v-btn text @click="stepper = 3">Quay lại</v-btn>
            </v-form>
          </v-stepper-content>
        </v-stepper>
      </v-list>
      <!-- END CONTENT -->
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Watch } from "vue-property-decorator";
import { IBid } from "@/entity/bid";
import { IContainer } from "@/entity/container";
import FormValidate from "@/mixin/form-validate";
import { IInbound } from "@/entity/inbound";
import Utils from "@/mixin/utils";
import { getInboundsByOutbound } from "@/api/inbound";
import { PaginationResponse } from "@/api/payload";
import { createBid } from "@/api/bid";
import { IBiddingDocument } from "@/entity/bidding-document";
import { isEmptyObject } from "@/utils/tool";
import { getBiddingNotificationsByUser } from "@/api/notification";
import { IBiddingNotification } from "@/entity/bidding-notification";

@Component({
  mixins: [FormValidate, Utils]
})
export default class CreateBid extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("biddingDocument", { type: Object })
  biddingDocumentSync!: IBiddingDocument;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  biddingDocuments: Array<IBiddingDocument> = [];
  biddingDocumentSelected = {} as IBiddingDocument;
  expanded: Array<IInbound> = [];
  singleExpand = true;
  dateInit = new Date().toISOString().substr(0, 10);
  bidLocal = {
    bidder: this.$auth.user().username,
    containers: [] as Array<number>,
    bidPrice: 0,
    bidDate: this.dateInit,
    bidValidityPeriod: this.dateInit,
    status: "CREATED"
  };
  loading = true;
  optionsBiddingDocument = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  options = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  // Form validate
  checkbox = false;
  editable = false;
  stepper = 1;
  valid = true;
  // API list

  // bidLocal form
  datePickerMenu = false;
  datePickerMenu2 = false;
  readonlyInbound = false;
  // Inbound
  inbounds: Array<IInbound> = [];
  inbound = {} as IInbound;
  containers: Array<IContainer> = [];
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

  inboundHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    { text: "Hãng tàu", value: "shippingLine" },
    { text: "Loại cont", value: "containerType" },
    { text: "Trạng thái", value: "status" },
    { text: "Time lấy cont", value: "pickUpTime" },
    { text: "B/L No.", value: "billOfLading.billOfLadingNumber" },
    { text: "Cảng lấy cont", value: "billOfLading.portOfDelivery" },
    { text: "Số lượng cont", value: "billOfLading.containers.length" }
  ];
  // Container form
  containerHeaders = [
    {
      text: "Container No.",
      align: "start",
      sortable: false,
      value: "containerNumber"
    },
    { text: "Biển kiểm sát", value: "licensePlate" },
    { text: "Tài xế", value: "driver" },
    { text: "Rơ mọt", value: "trailer" },
    { text: "Đầu kéo", value: "tractor" },
    { text: "Hành động", value: "actions" }
  ];

  // Bid
  createBid() {
    // TODO: API create bid
    if (this.biddingDocumentSync.id) {
      // this.bidLocal.containers = this.bidLocal.containers.reduce(function(
      //   pv: Array<number>,
      //   cv: IContainer
      // ) {
      //   pv.push(cv.id);
      //   return pv;
      // },
      // []);
      this.bidLocal.containers = [] as Array<number>;
      console.log(this.containers);
      this.containers.forEach((element: IContainer) => {
        if (element.id) {
          this.bidLocal.containers.push(element.id);
        }
      });
      const bidRequest = Object.assign({}, this.bidLocal);
      createBid(this.biddingDocumentSync.id, bidRequest)
        .then(res => {
          console.log(res.data);
          const response: IBid = res.data;
          this.messageSync =
            "Thêm mới thành công Hồ sơ dự thầu: " + response.id;
          this.readonlyInbound = true;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  selectContainer(item: IContainer) {
    const isDuplicate = this.checkDuplicateSelect(item);
    if (!isDuplicate) {
      this.containers.push(item);
    } else {
      const index = this.containers.findIndex(x => x.id === item.id);
      this.containers.splice(index, 1);
    }
  }

  checkDuplicateSelect(item: IContainer) {
    return this.containers.filter(x => x.id == item.id).length > 0
      ? true
      : false;
  }
  created() {
    if (
      typeof this.biddingDocumentSync.outbound != "number" &&
      this.biddingDocumentSync.outbound.id
    ) {
      getInboundsByOutbound(this.biddingDocumentSync.outbound.id, {
        page: 0,
        limit: 100
      })
        .then(res => {
          const response: PaginationResponse<IInbound> = res.data;
          this.inbounds = response.data;
        })
        .catch(err => console.log(err))
        .finally();
    }
  }

  selectBiddingDocument(item: IBiddingDocument) {
    if (
      this.biddingDocumentSelected &&
      this.biddingDocumentSelected.id === item.id
    ) {
      // unselected item
      this.biddingDocumentSelected = {} as IBiddingDocument;
    } else {
      // select item
      if (item.id) {
        this.biddingDocumentSelected = item;
        console.log(this.biddingDocumentSelected);
      }
    }
  }

  @Watch("optionsBiddingDocument", { deep: true })
  // TODO: API get
  onOptionsBiddingDocumentChange(val: object, oldVal: object) {
    if (
      this.biddingDocumentSync != null &&
      !isEmptyObject(this.biddingDocumentSync)
    ) {
      this.biddingDocuments.push(this.biddingDocumentSync);
      this.selectBiddingDocument(this.biddingDocumentSync);
      this.optionsBiddingDocument.totalItems = 1;
      this.loading = false;
    } else {
      if (val !== oldVal) {
        getBiddingNotificationsByUser({
          page: 0,
          limit: 100,
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
            this.optionsBiddingDocument.totalItems = response.totalElements;
          })
          .catch(err => console.log(err))
          .finally(() => (this.loading = false));
      }
    }
  }

  clicked(value: IInbound) {
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded.splice(0, this.expanded.length);
      } else {
        this.expanded.splice(0, this.expanded.length);
        this.expanded.push(value);
      }
    } else {
      const index = this.expanded.findIndex(x => x.id === value.id);
      if (index === -1) {
        this.expanded.push(value);
      } else {
        this.expanded.splice(index, 1);
      }
    }
  }
}
</script>
