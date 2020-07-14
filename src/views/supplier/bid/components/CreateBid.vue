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
              :options.sync="biddingDocumentOptions"
              :server-items-length="biddingDocumentOptions.totalItems"
              :footer-props="{
                'items-per-page-options':
                  biddingDocumentOptions.itemsPerPageItems
              }"
              :actions-append="biddingDocumentOptions.page"
              class="elevation-1 my-1"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>HSMT nhận được</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-switch
                  v-model="biddingDocumentSelected"
                  :value="item"
                ></v-switch>
              </template>
              <template v-slot:item.bidOpening="{ item }">
                {{ formatDatetime(item.bidOpening) }}
              </template>
              <template v-slot:item.bidClosing="{ item }">
                {{ formatDatetime(item.bidClosing) }}
              </template>
            </v-data-table>
            <v-btn
              color="primary"
              @click="
                stepper = 2;
                getInbounds();
              "
              :disabled="!biddingDocumentSelected"
              >Tiếp tục</v-btn
            >
          </v-stepper-content>
          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable">
            Thông tin HSDT
            <small>Thông tin chung</small>
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-form ref="bidForm" v-model="valid" validation>
              <v-text-field
                v-model="bidLocal.bidPrice"
                prepend-icon="monetization_on"
                v-if="biddingDocumentSelected"
                type="number"
                :rules="[
                  minNumber(
                    'bid price',
                    biddingDocumentSelected.bidFloorPrice + 1
                  )
                ]"
                label="Giá gửi thầu"
              ></v-text-field>
              <!-- <v-text-field
                label="Label Text"
                value="12:30:00"
                type="time"
                suffix="PST"
              ></v-text-field> -->
              <v-btn color="primary" @click="stepper = 3" :disabled="!valid"
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
                            <v-checkbox
                              v-model="containers"
                              :value="item"
                              :disabled="
                                containers.length >= unit &&
                                  containers.indexOf(item) === -1
                              "
                            ></v-checkbox>
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
                      <v-checkbox
                        v-model="containers"
                        :value="item"
                      ></v-checkbox>
                    </template>
                  </v-data-table>
                </v-container>
              </v-tab-item>
            </v-tabs>
            <v-btn
              color="primary"
              @click="stepper = 4"
              :disabled="containers.length == 0"
              >Tiếp tục</v-btn
            >
            <v-btn text @click="stepper = 2">Quay lại</v-btn>
          </v-stepper-content>
          <v-stepper-step step="4">Hoàn thành</v-stepper-step>
          <v-stepper-content step="4">
            <v-form ref="finishForm">
              <v-checkbox
                v-model="checkbox"
                label="Bạn đồng ý rằng tất cả các thông tin đưa lên đều là chính xác."
              ></v-checkbox>
              <v-btn color="primary" @click="createBid()" :disabled="!checkbox"
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
import { Component, Vue, PropSync } from "vue-property-decorator";
import { IBid } from "@/entity/bid";
import { IContainer } from "@/entity/container";
import FormValidate from "@/mixin/form-validate";
import { IInbound } from "@/entity/inbound";
import Utils from "@/mixin/utils";
import { getInboundsByOutboundAndForwarder } from "@/api/inbound";
import { PaginationResponse } from "@/api/payload";
import { createBid } from "@/api/bid";
import { IBiddingDocument } from "@/entity/bidding-document";
import { isEmptyObject, addTimeToDate } from "@/utils/tool";
import { getBiddingNotificationsByUser } from "@/api/notification";
import { IBiddingNotification } from "@/entity/bidding-notification";
import { IOutbound } from "@/entity/outbound";
import { getContainersByInbound } from "@/api/container";
@Component({
  mixins: [FormValidate, Utils]
})
export default class CreateBid extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("biddingDocument", { type: Object })
  biddingDocumentSync?: IBiddingDocument;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("totalItems", { type: Number }) totalItemsSync?: number;
  @PropSync("bids", { type: Array }) bidsSync?: Array<IBid>;

  biddingDocuments: Array<IBiddingDocument> = [];
  biddingDocumentSelected = null as IBiddingDocument | null;
  expanded: Array<IInbound> = [];
  singleExpand = true;
  dateInit = addTimeToDate(new Date().toString());
  bidLocal = {
    bidder: this.$auth.user().username,
    containers: [] as Array<number>,
    bidPrice: 0,
    bidDate: this.dateInit.slice(0, 10) + "T" + this.dateInit.slice(11, 16),
    bidValidityPeriod: this.dateInit,
    status: "CREATED"
  };
  loading = true;
  options = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  biddingDocumentOptions = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  // Form validate
  checkbox = false;
  editable = false;
  unit = 0;
  stepper = 1;
  valid = true;
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
    { text: "Chọn HSMT", value: "actions", sortable: false }
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
      value: "containerNumber",
      class: "elevation-1 primary"
    },
    { text: "Tài xế", value: "driver", class: "elevation-1 primary" },
    {
      text: "Rơ mọt",
      value: "trailer.licensePlate",
      class: "elevation-1 primary"
    },
    {
      text: "Đầu kéo",
      value: "tractor.licensePlate",
      class: "elevation-1 primary"
    },
    { text: "Chọn Cont", value: "actions", class: "elevation-1 primary" }
  ];
  // Bid
  createBid() {
    // TODO: API create bid
    if (this.biddingDocumentSelected && this.biddingDocumentSelected.id) {
      this.bidLocal.containers = this.containers.reduce(function(
        pV: Array<number>,
        cV: IContainer
      ) {
        if (cV.id) {
          pV.push(cV.id);
        }
        return pV;
      },
      []);
      createBid(this.biddingDocumentSelected.id, this.bidLocal)
        .then(res => {
          const response: IBid = res.data;
          console.log("response", response);
          this.messageSync =
            "Thêm mới thành công Hồ sơ dự thầu: " + response.id;
          if (this.bidsSync) {
            this.bidsSync.unshift(response);
          }
          if (this.totalItemsSync) {
            this.totalItemsSync += 1;
          }
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  checkNumberContainer() {
    if (
      this.biddingDocumentSelected &&
      typeof this.biddingDocumentSelected.outbound != "number"
    ) {
      if (
        this.containers.length >=
        this.biddingDocumentSelected.outbound.booking.unit
      ) {
        return true;
      } else {
        return false;
      }
    }
    return false;
  }
  getInbounds() {
    if (this.biddingDocumentSelected && this.biddingDocumentSelected.outbound) {
      const _outbound = this.biddingDocumentSelected.outbound as IOutbound;
      this.unit = _outbound.booking.unit;
      const _outboundId = _outbound.id as number;
      getInboundsByOutboundAndForwarder(_outboundId, {
        page: 0,
        limit: 100
      })
        .then(res => {
          const response: PaginationResponse<IInbound> = res.data;
          this.inbounds = response.data;
          this.options.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally();
    }
  }
  created() {
    if (this.biddingDocumentSync && !isEmptyObject(this.biddingDocumentSync)) {
      this.biddingDocuments.push(this.biddingDocumentSync);
      this.biddingDocumentSelected = this.biddingDocumentSync;
      this.biddingDocumentOptions.totalItems = 1;
      this.loading = false;
    } else {
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
          this.biddingDocumentOptions.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
  getContainers(item: IInbound) {
    if (item.id) {
      getContainersByInbound(item.id, {
        page: 0,
        limit: 100
      })
        .then(res => {
          const response = res.data;
          this.inbound.billOfLading.containers = response.data.filter(
            (x: IContainer) => x.status == "CREATED"
          );
        })
        .catch(err => {
          console.log(err);
        })
        .finally();
    }
  }
  clicked(value: IInbound) {
    console.log(this.containers);
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded.splice(0, this.expanded.length);
        this.inbound = {} as IInbound;
      } else {
        this.expanded.splice(0, this.expanded.length);
        this.getContainers(value);
        this.expanded.push(value);
        this.inbound = value;
      }
    } else {
      const index = this.expanded.findIndex(x => x.id === value.id);
      if (index === -1) {
        this.getContainers(value);
        this.expanded.push(value);
        this.inbound = value;
      } else {
        this.expanded.splice(index, 1);
        this.inbound = {} as IInbound;
      }
    }
  }
}
</script>
