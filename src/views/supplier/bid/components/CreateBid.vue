<template>
  <v-dialog
    v-model="dialogAddSync"
    fullscreen
    persistent
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
              :server-items-length="biddingDocumentServerSideOptions.totalItems"
              :footer-props="{
                'items-per-page-options':
                  biddingDocumentServerSideOptions.itemsPerPageItems
              }"
              :actions-append="biddingDocumentOptions.page"
              disable-sort
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
                :hint="currencyFormatter(bidLocal.bidPrice)"
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
                    :options.sync="inboundOptions"
                    :server-items-length="inboundServerSideOptions.totalItems"
                    :footer-props="{
                      'items-per-page-options':
                        inboundServerSideOptions.itemsPerPageItems
                    }"
                    :actions-append="inboundOptions.page"
                    disable-sort
                    class="elevation-1 my-1"
                  >
                    <template v-slot:item.pickUpTime="{ item }">
                      {{ formatDatetime(item.pickupTime) }}
                    </template>
                    <!-- Show containers expened -->
                    <template v-slot:expanded-item="{ headers, item }">
                      <td :colspan="headers.length" class="px-0">
                        <v-data-table
                          v-model="containers"
                          :headers="containerHeaders"
                          :items="item.billOfLading.containers"
                          item-key="id"
                          :loading="loading"
                          :options.sync="options"
                          :server-items-length="serverSideOptions.totalItems"
                          :footer-props="{
                            'items-per-page-options':
                              serverSideOptions.itemsPerPageItems
                          }"
                          :actions-append="options.page"
                          disable-sort
                          dark
                          dense
                        >
                          <template v-slot:item.actions="{ item }">
                            <v-checkbox
                              v-model="containers"
                              :value="item"
                              @change="changeContainerServerSideOptions(item)"
                              :disabled="
                                containers.length == unit &&
                                  containers.indexOf(item) == -1
                              "
                              style="margin:0px;padding:0px"
                              hide-details
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
                    :headers="containerSelectedHeaders"
                    :items="containers"
                    item-key="id"
                    :loading="loading"
                    :options.sync="containerOptions"
                    :server-items-length="containerServerSideOptions.totalItems"
                    :footer-props="{
                      'items-per-page-options':
                        containerServerSideOptions.itemsPerPageItems
                    }"
                    :actions-append="containerOptions.page"
                  >
                    <template v-slot:item.actions="{ item }">
                      <v-checkbox
                        v-model="containers"
                        :value="item"
                        @change="containerServerSideOptions.totalItems -= 1"
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
import { isEmptyObject, addTimeToDate, getErrorMessage } from "@/utils/tool";
import { getBiddingNotificationsByUser } from "@/api/notification";
import { IBiddingNotification } from "@/entity/bidding-notification";
import { IOutbound } from "@/entity/outbound";
import { getContainersByInbound } from "@/api/container";
import snackbar from "@/store/modules/snackbar";
import { DataOptions } from "vuetify";
@Component({
  mixins: [FormValidate, Utils]
})
export default class CreateBid extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("biddingDocument", { type: Object })
  biddingDocumentSync?: IBiddingDocument;
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
    bidDate: this.dateInit,
    bidValidityPeriod: this.dateInit.slice(0, 10),
    status: "CREATED"
  };
  loading = true;
  options = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  biddingDocumentOptions = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  biddingDocumentServerSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  inboundOptions = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  inboundServerSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  containerOptions = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  containerServerSideOptions = {
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
  containerSelectedHeaders = [
    {
      text: "Container No.",
      align: "start",
      sortable: false,
      value: "containerNumber"
    },
    { text: "Tài xế", value: "driver" },
    {
      text: "Rơ mọt",
      value: "trailer.licensePlate"
    },
    {
      text: "Đầu kéo",
      value: "tractor.licensePlate"
    },
    { text: "Chọn Cont", value: "actions" }
  ];
  // Bid
  log() {
    console.log(1);
  }
  async createBid() {
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
      const _bid = await createBid(
        this.biddingDocumentSelected.id,
        this.bidLocal
      )
        .then(res => {
          const response: IBid = res.data;
          console.log("response", response);
          snackbar.setSnackbar({
            text: "Thêm mới thành công Hồ sơ dự thầu: " + response.id,
            color: "success"
          });
          return response;
        })
        .catch(err => {
          console.log(err);
          snackbar.setSnackbar({
            text: getErrorMessage(err),
            color: "error"
          });
          return null;
        });
      if (_bid) {
        if (typeof this.bidsSync != "undefined") {
          this.bidsSync.unshift(_bid);
        }
        if (typeof this.totalItemsSync != "undefined") {
          this.totalItemsSync += 1;
        }
        this.dialogAddSync = false;
      }
      snackbar.setDisplay(true);
    }
  }
  async changeContainerServerSideOptions(item: IContainer) {
    if (this.containers.length > 0) {
      let check = false;
      await this.containers.forEach((x: IContainer) => {
        console.log(x);
        console.log(item);
        if (x === item) {
          console.log(1);
          check = true;
        }
      });
      if (check === false) {
        this.containerServerSideOptions.totalItems -= 1;
      } else {
        this.containerServerSideOptions.totalItems += 1;
      }
    } else {
      this.containerServerSideOptions.totalItems -= 1;
    }
  }
  async checkExistCont(item: IContainer) {
    if (this.containers.length > 0) {
      await this.containers.forEach((x: IContainer) => {
        if (x === item) {
          return true;
        }
      });
    }
    return false;
  }
  async getInbounds() {
    if (this.biddingDocumentSelected && this.biddingDocumentSelected.outbound) {
      const _outbound = this.biddingDocumentSelected.outbound as IOutbound;
      this.unit = _outbound.booking.unit;
      const _outboundId = _outbound.id as number;
      const _inbounds = await getInboundsByOutboundAndForwarder(_outboundId, {
        page: 0,
        limit: 100
      })
        .then(res => {
          const response: PaginationResponse<IInbound> = res.data;
          return response;
        })
        .catch(err => console.log(err));
      this.loading = false;
      if (_inbounds) {
        this.inbounds = _inbounds.data;
        this.inboundServerSideOptions.totalItems = _inbounds.totalElements;
      }
    }
  }
  async created() {
    if (this.biddingDocumentSync && !isEmptyObject(this.biddingDocumentSync)) {
      this.biddingDocuments.push(this.biddingDocumentSync);
      this.biddingDocumentSelected = this.biddingDocumentSync;
      this.biddingDocumentServerSideOptions.totalItems = 1;
      this.loading = false;
    } else {
      const _biddingNotificationsByUsers = await getBiddingNotificationsByUser({
        page: 0,
        limit: 100,
        status: "ADDED"
      })
        .then(res => {
          const response: PaginationResponse<IBiddingNotification> = res.data;
          console.log("watch", response);
          return response;
        })
        .catch(err => console.log(err));
      this.loading = false;
      if (_biddingNotificationsByUsers) {
        this.biddingDocuments = _biddingNotificationsByUsers.data.reduce(
          function(pV: Array<IBiddingDocument>, cV: IBiddingNotification) {
            pV.push(cV.relatedResource);
            return pV;
          },
          []
        );
        this.biddingDocumentServerSideOptions.totalItems =
          _biddingNotificationsByUsers.totalElements;
      }
    }
  }
  async getContainers(item: IInbound) {
    if (item.id) {
      this.loading = true;
      const _containers = await getContainersByInbound(item.id, {
        page: 0,
        limit: 100
      })
        .then(res => {
          const response = res.data;
          return response;
        })
        .catch(err => {
          console.log(err);
        });
      this.loading = false;
      if (_containers) {
        item.billOfLading.containers = _containers.data.filter(
          (x: IContainer) => x.status == "CREATED"
        );
        this.serverSideOptions.totalItems = _containers.totalElements;
      }
    }
  }
  async clicked(value: IInbound) {
    console.log("value", value);
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded.splice(0, this.expanded.length);
      } else {
        this.expanded.splice(0, this.expanded.length);
        await this.getContainers(value);
        this.expanded.push(value);
      }
    } else {
      const index = this.expanded.findIndex(x => x.id === value.id);
      if (index === -1) {
        await this.getContainers(value);
        this.expanded.push(value);
      } else {
        this.expanded.splice(index, 1);
      }
    }
    console.log("expanded", this.expanded);
    console.log("containers", this.containers);
  }
}
</script>
