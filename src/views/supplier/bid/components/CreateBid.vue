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
              no-data-text="Danh sách HSMT nhận được rỗng."
              disable-sort
              class="elevation-1 mb-1"
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
              <template v-slot:item.unit="{ item }">
                {{
                  item.outbound.booking.unit +
                    " x " +
                    item.outbound.containerType
                }}
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
            </v-data-table>
            <v-btn
              color="primary"
              @click="
                stepper = 2;
                getInbound();
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
                    'Giá gửi thầu',
                    biddingDocumentSelected.bidFloorPrice
                  ),
                  maxNumber(
                    'Giá gửi thầu',
                    biddingDocumentSelected.bidPackagePrice
                  )
                ]"
                label="Giá gửi thầu"
              ></v-text-field>
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
              <v-tab>Danh sách Inbound</v-tab>
              <v-tab
                >Danh sách Containers đã chọn ({{
                  containersSelected.length
                }})</v-tab
              >

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
                    no-data-text="Danh sách hàng nhập rỗng."
                    :actions-append="inboundOptions.page"
                    disable-sort
                    class="elevation-1"
                  >
                    <template v-slot:item.pickUpTime="{ item }">
                      {{ formatDatetime(item.pickupTime) }}
                    </template>
                    <!-- Show containers expened -->
                    <template v-slot:expanded-item="{ headers }">
                      <td :colspan="headers.length" class="px-0">
                        <v-data-table
                          :headers="containerHeaders"
                          :items="containers"
                          item-key="id"
                          :loading="loading"
                          :options.sync="containerOptions"
                          :server-items-length="
                            containerServerSideOptions.totalItems
                          "
                          :footer-props="{
                            'items-per-page-options':
                              containerServerSideOptions.itemsPerPageItems
                          }"
                          :actions-append="containerOptions.page"
                          disable-sort
                          no-data-text="Danh sách Container rỗng."
                          v-model="containersSelected"
                          show-select
                          dark
                          dense
                        >
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
                    :items="containersSelected"
                    item-key="id"
                    hide-default-footer
                    no-data-text="Danh sách Container đã chọn rỗng."
                    disable-sort
                    v-model="containersSelected"
                    show-select
                  >
                  </v-data-table>
                </v-container>
              </v-tab-item>
            </v-tabs>
            <v-btn
              v-if="
                biddingDocumentSelected &&
                  biddingDocumentSelected.isMultipleAward
              "
              color="primary"
              @click="stepper = 4"
              :disabled="containersSelected.length == 0"
              >Tiếp tục</v-btn
            >
            <v-btn
              v-if="
                biddingDocumentSelected &&
                  biddingDocumentSelected.isMultipleAward == false
              "
              color="primary"
              @click="stepper = 4"
              :disabled="containersSelected.length < unit"
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
import { Component, Vue, PropSync, Prop, Watch } from "vue-property-decorator";
import { IBid } from "@/entity/bid";
import { IContainer } from "@/entity/container";
import FormValidate from "@/mixin/form-validate";
import { IInbound } from "@/entity/inbound";
import Utils from "@/mixin/utils";
import { getInboundsByOutboundAndForwarder } from "@/api/inbound";
import { createBid } from "@/api/bid";
import { IBiddingDocument } from "@/entity/bidding-document";
import { isEmptyObject, addTimeToDate } from "@/utils/tool";
import { getBiddingNotificationsByUser } from "@/api/notification";
import { IBiddingNotification } from "@/entity/bidding-notification";
import { IOutbound } from "@/entity/outbound";
import { getContainersByInbound } from "@/api/container";
import { DataOptions } from "vuetify";
import { IBillOfLading } from "@/entity/bill-of-lading";
import { editBiddingNotifications } from "@/api/notification";

@Component({
  mixins: [FormValidate, Utils]
})
export default class CreateBid extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("totalItems", { type: Number }) totalItemsSync?: number;
  @PropSync("totalItemsBidNo", { type: Number }) totalItemsBidNoSync?: number;
  @PropSync("bids", { type: Array }) bidsSync?: Array<IBid>;
  @PropSync("biddingDocument", { type: Object })
  biddingDocumentSync?: IBiddingDocument;
  @PropSync("biddingNotifications", { type: Array })
  biddingNotificationsSync?: Array<IBiddingNotification>;
  @Prop(Object) biddingNotification?: IBiddingNotification;

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
  inbound = {
    emptyTime: "",
    pickupTime: "",
    billOfLading: {
      number: "",
      unit: 0,
      containers: [] as Array<IContainer>,
      portOfDelivery: "",
      freeTime: ""
    } as IBillOfLading,
    returnStation: ""
  } as IInbound;
  loading = true;

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
  containersSelected: Array<IContainer> = [];
  headers = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    { text: "Hãng tàu", value: "outbound.shippingLine" },
    { text: "Số cont", value: "unit" },
    { text: "Giá gói thầu", value: "bidPackagePrice" },
    { text: "Mở thầu", value: "bidOpening" },
    { text: "Đóng thầu", value: "bidClosing" },
    { text: "Nhiều thầu win", value: "isMultipleAward" }
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
    { text: "B/L No.", value: "billOfLading.number" },
    { text: "Cảng lấy cont", value: "billOfLading.portOfDelivery" },
    { text: "Số lượng cont đăng ký", value: "billOfLading.unit" }
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
    { text: "Trạng thái", value: "status", class: "elevation-1 primary" }
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
    { text: "Trạng thái", value: "status" }
  ];
  // Bid
  getInbound() {
    this.inboundOptions = {
      page: 1,
      itemsPerPage: 5
    } as DataOptions;
  }
  async createBid() {
    // TODO: API create bid
    if (this.biddingDocumentSelected && this.biddingDocumentSelected.id) {
      this.bidLocal.containers = this.containersSelected.reduce(function(
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
      );
      if (_bid.data) {
        if (this.bidsSync) {
          this.bidsSync.unshift(_bid.data);
        }
        if (typeof this.totalItemsSync != "undefined") {
          this.totalItemsSync += 1;
        }
        if (
          this.biddingNotification &&
          typeof this.biddingNotification != "undefined" &&
          this.biddingNotification.id
        ) {
          const _biddingNotification = await editBiddingNotifications(
            this.biddingNotification.id,
            {
              isHide: true
            }
          );
          if (_biddingNotification.data) {
            if (this.biddingNotificationsSync) {
              const index = this.biddingNotificationsSync.findIndex(
                x => x.id === _biddingNotification.data.id
              );
              this.biddingNotificationsSync.splice(index, 1);
            }
            if (typeof this.totalItemsBidNoSync != "undefined")
              this.totalItemsBidNoSync -= 1;
          }
        }
        this.dialogAddSync = false;
      }
    }
  }

  async clicked(value: IInbound) {
    console.log("value", value);
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded.splice(0, this.expanded.length);
        this.inbound.billOfLading.containers = [] as Array<IContainer>;
      } else {
        if (this.expanded.length > 0) {
          this.expanded.splice(0, this.expanded.length);
          this.expanded.push(value);
          this.inbound = value;
          this.inbound.billOfLading.containers = [] as Array<IContainer>;
        } else {
          this.expanded.push(value);
          this.inbound = value;
        }
      }
    }
    this.containerOptions.page = 1;
    this.loadContainersByInbound(value.id as number, this.containerOptions);
  }

  @Watch("biddingDocumentOptions")
  async onBiddingDocumentOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      this.biddingDocuments = [] as Array<IBiddingDocument>;
      if (
        this.biddingDocumentSync &&
        !isEmptyObject(this.biddingDocumentSync)
      ) {
        this.biddingDocuments.push(this.biddingDocumentSync);
        this.biddingDocumentSelected = this.biddingDocumentSync;
        this.biddingDocumentServerSideOptions.totalItems = 1;
        this.loading = false;
      } else {
        const _res = await getBiddingNotificationsByUser({
          page: val.page - 1,
          limit: val.itemsPerPage
        });
        this.loading = false;
        if (_res.data) {
          const _biddingNotificationsByUsers = _res.data
            .data as IBiddingNotification[];
          this.biddingDocuments = _biddingNotificationsByUsers
            .filter(x => x.action == "ADDED")
            .reduce(function(
              pV: Array<IBiddingDocument>,
              cV: IBiddingNotification
            ) {
              pV.push(cV.relatedResource);
              return pV;
            },
            []);
          this.biddingDocumentServerSideOptions.totalItems =
            _res.data.totalElements;
        }
      }
      this.loading = false;
    }
  }
  @Watch("inboundOptions")
  async onInboundOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      console.log(1);
      this.loading = true;
      if (
        this.biddingDocumentSelected &&
        this.biddingDocumentSelected.outbound
      ) {
        const _outbound = this.biddingDocumentSelected.outbound as IOutbound;
        this.unit = _outbound.booking.unit;
        const _outboundId = _outbound.id as number;
        const _inbounds = await getInboundsByOutboundAndForwarder(_outboundId, {
          page: val.page - 1,
          limit: val.itemsPerPage
        });
        this.loading = false;
        if (_inbounds.data) {
          this.inbounds = _inbounds.data.data;
          this.inboundServerSideOptions.totalItems =
            _inbounds.data.totalElements;
        }
      }
    }
  }

  async loadContainersByInbound(inboundId: number, option: DataOptions) {
    const _containers = await getContainersByInbound(inboundId, {
      page: option.page - 1,
      limit: option.itemsPerPage
    });
    if (_containers.data) {
      this.containerServerSideOptions.totalItems =
        _containers.data.totalElements;
      this.containers = _containers.data.data.filter(
        (x: IContainer) => x.status == "CREATED"
      );
    }
  }

  @Watch("containerOptions")
  async onContainerOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      if (this.inbound)
        await this.loadContainersByInbound(this.inbound.id as number, val);
    }
    this.loading = false;
  }
}
</script>
