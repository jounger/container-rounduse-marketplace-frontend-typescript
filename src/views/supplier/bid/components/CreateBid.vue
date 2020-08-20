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
        <v-toolbar-title>Thêm mới HSDT</v-toolbar-title>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-list three-line subheader>
        <v-stepper v-model="stepper" vertical class="elevation-0">
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
              class="elevation-0 mb-1"
              v-model="biddingDocumentsSelected"
              single-select
              show-select
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Danh sách HSMT</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
              </template>
              <template v-slot:item.unit="{ item }">
                {{
                  item.outbound.booking.unit +
                    " x " +
                    item.outbound.containerType.name
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
              <template v-slot:item.bidFloorPrice="{ item }">
                {{ currencyFormatter(item.bidFloorPrice) }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-switch
                  v-model="biddingDocumentsSelected[0]"
                  :value="item"
                  light
                  dense
                ></v-switch>
              </template>
            </v-data-table>
            <v-btn
              color="primary"
              @click="stepper = 2"
              :disabled="!biddingDocumentsSelected[0]"
              >Tiếp tục</v-btn
            >
          </v-stepper-content>
          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable">
            Thông tin HSDT
            <small>Thông tin chung</small>
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-form ref="bidForm" v-model="valid" validation>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="bidLocal.bidPrice"
                    :hint="currencyFormatter(bidLocal.bidPrice)"
                    prepend-icon="monetization_on"
                    v-if="biddingDocumentsSelected[0]"
                    type="number"
                    :rules="[
                      minNumber(
                        'Giá gửi thầu',
                        biddingDocumentsSelected[0].bidFloorPrice
                      ),
                      maxNumber(
                        'Giá gửi thầu',
                        biddingDocumentsSelected[0].bidPackagePrice
                      )
                    ]"
                    label="Giá gửi thầu"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <DatetimePicker
                    :datetime="bidLocal.validityPeriod"
                    :return-value.sync="bidLocal.validityPeriod"
                    dateicon="update"
                    datelabel="Sau thời gian này, HSDT của bạn sẽ không còn giá trị"
                    timelabel="Giờ"
                  />
                </v-col>
              </v-row>
            </v-form>
            <v-btn
              color="primary"
              @click="continueLoadInbound"
              :disabled="!valid"
              >Tiếp tục</v-btn
            >
            <v-btn text @click="stepper = 1">Quay lại</v-btn>
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
                  class="elevation-0"
                >
                  <template v-slot:item.pickUpTime="{ item }">
                    {{ formatDatetime(item.pickupTime) }}
                  </template>
                  <!-- Show containers expened -->
                  <template v-slot:expanded-item="{ headers }">
                    <td
                      :colspan="headers.length"
                      class="px-0"
                      v-if="containers.length > 0"
                    >
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
                        dense
                      >
                        <template v-slot:header.data-table-select> </template>
                        <template v-slot:item.status="{ item }">
                          <ChipStatus :status="item.status" :sub="true" />
                        </template>
                      </v-data-table>
                    </td>
                  </template>
                </v-data-table>
              </v-tab-item>
              <v-tab-item>
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
                  <template v-slot:header.data-table-select> </template>
                  <template v-slot:item.status="{ item }">
                    <ChipStatus :status="item.status" />
                  </template>
                </v-data-table>
              </v-tab-item>
            </v-tabs>
            <v-btn
              v-if="
                biddingDocumentsSelected[0] &&
                  biddingDocumentsSelected[0].isMultipleAward
              "
              color="primary"
              @click="stepper = 4"
              :disabled="containersSelected.length == 0"
              >Tiếp tục</v-btn
            >
            <v-btn
              v-if="
                biddingDocumentsSelected[0] &&
                  biddingDocumentsSelected[0].isMultipleAward == false
              "
              color="primary"
              @click="stepper = 4"
              :disabled="
                containersSelected.length <
                  biddingDocumentsSelected[0].outbound.booking.unit
              "
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
import { addTimeToDate, addMinutesToDate } from "@/utils/tool";
import { getBiddingNotifications } from "@/api/notification";
import { IBiddingNotification } from "@/entity/bidding-notification";
import { IOutbound } from "@/entity/outbound";
import { getContainersByInbound } from "@/api/container";
import { DataOptions } from "vuetify";
import DatetimePicker from "@/components/DatetimePicker.vue";
import { getBiddingDocumentByInbound } from "@/api/bidding-document";
import ChipStatus from "@/components/ChipStatus.vue";

@Component({
  mixins: [FormValidate, Utils],
  components: {
    DatetimePicker,
    ChipStatus
  }
})
export default class CreateBid extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @PropSync("bids", { type: Array }) bidsSync!: Array<IBid>;
  @PropSync("biddingNotifications", { type: Array })
  biddingNotificationsSync!: Array<IBiddingNotification>;
  @Prop(Object) biddingNotification!: IBiddingNotification;
  @Prop() biddingDocument!: IBiddingDocument;
  @Prop() inbound!: IInbound;

  biddingDocuments: Array<IBiddingDocument> = [];
  biddingDocumentsSelected: Array<IBiddingDocument> = [];
  expanded: Array<IInbound> = [];
  singleExpand = true;
  dateInit = addTimeToDate(new Date().toString());
  bidLocal = {
    bidder: this.$auth.user().username,
    containers: [] as Array<number>,
    bidPrice: 0,
    bidDate: this.dateInit,
    validityPeriod: addMinutesToDate(this.dateInit, 1440),
    status: "PENDING"
  };
  inboundLocal = null as IInbound | null;
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
    { text: "Bên mời thầu", value: "offeree.companyName" },
    { text: "Hãng tàu", value: "outbound.shippingLine.companyName" },
    { text: "Số cont", value: "unit" },
    { text: "Giá gói thầu", value: "bidPackagePrice" },
    { text: "Giá sàn", value: "bidFloorPrice" },
    { text: "Mở thầu", value: "bidOpening" },
    { text: "Đóng thầu", value: "bidClosing" },
    { text: "Nhiều thầu thắng", value: "isMultipleAward" }
  ];
  inboundHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    { text: "Hãng tàu", value: "shippingLine.companyName" },
    { text: "Loại cont", value: "containerType.name" },
    { text: "Time lấy cont", value: "pickUpTime" },
    { text: "B/L No.", value: "billOfLading.number" },
    { text: "Cảng lấy cont", value: "billOfLading.portOfDelivery.fullname" },
    { text: "Số lượng cont đăng ký", value: "billOfLading.unit" }
  ];
  // Container form
  containerHeaders = [
    {
      text: "Container No.",
      align: "start",
      sortable: false,
      value: "number",
      class: "tertiary"
    },
    { text: "Lái xe", value: "driver.fullname", class: "tertiary" },
    { text: "SĐT liên hệ", value: "driver.phone", class: "tertiary" },
    {
      text: "Rơ mọt",
      value: "trailer.licensePlate",
      class: "tertiary"
    },
    {
      text: "Đầu kéo",
      value: "tractor.licensePlate",
      class: "tertiary"
    },
    { text: "Trạng thái", value: "status", class: "tertiary" }
  ];
  containerSelectedHeaders = [
    {
      text: "Container No.",
      align: "start",
      sortable: false,
      value: "number"
    },
    { text: "Lái xe", value: "driver.fullname" },
    { text: "SĐT liên hệ", value: "driver.phone" },
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

  async createBid() {
    if (this.biddingDocumentsSelected[0]) {
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
      // API CREATE BID
      const _res = await createBid(
        this.biddingDocumentsSelected[0].id as number,
        this.bidLocal
      );
      if (_res.data) {
        const _bid = _res.data.data;
        if (this.bidsSync) {
          this.bidsSync.unshift(_bid);
          this.totalItemsSync += 1;
        }
        if (this.biddingNotification && this.biddingNotificationsSync) {
          const index = this.biddingNotificationsSync.findIndex(
            x => x.id === this.biddingNotification.id
          );
          this.biddingNotificationsSync.splice(index, 1);
        }
        this.dialogAddSync = false;
      }
    }
  }

  async clicked(value: IInbound) {
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded = [];
      } else {
        if (this.expanded.length > 0) this.expanded = [];
        this.expanded.push(value);
        this.inboundLocal = value;
        await this.loadMoreContainers({
          ...this.containerOptions,
          page: 1
        });
      }
    }
  }

  @Watch("biddingDocumentOptions")
  async onBiddingDocumentOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      if (this.biddingDocument) {
        this.biddingDocuments = [];
        this.biddingDocuments.push(this.biddingDocument);
        this.biddingDocumentsSelected.push(this.biddingDocument);
        this.biddingDocumentServerSideOptions.totalItems = 1;
        this.loading = false;
      } else if (this.inbound) {
        //
        const _res = await getBiddingDocumentByInbound(
          this.inbound.id as number,
          {
            page: val.page - 1,
            limit: val.itemsPerPage
          }
        );
        if (_res.data) {
          const _biddingDocuments = _res.data.data;
          this.biddingDocuments = _biddingDocuments;
          this.biddingDocumentServerSideOptions.totalItems =
            _res.data.totalElements;
        }
      } else {
        const _res = await getBiddingNotifications({
          page: val.page - 1,
          limit: val.itemsPerPage,
          status: "BIDDING_INVITED"
        });
        if (_res.data) {
          const _biddingNotifications = _res.data
            .data as IBiddingNotification[];
          this.biddingDocuments = _biddingNotifications.reduce(function(
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

  async loadMoreContainers(val: DataOptions) {
    if (this.inboundLocal) {
      this.loading = true;
      const _res = await getContainersByInbound(
        this.inboundLocal.id as number,
        {
          page: val.page - 1,
          limit: val.itemsPerPage
        }
      );
      if (_res.data) {
        const _containers = _res.data.data;
        this.containers = _containers;
        this.containers = _containers.filter(
          (x: IContainer) => x.status == "CREATED"
        );
        this.containerServerSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }

  async loadMoreInbounds(val: DataOptions, outbound: IOutbound) {
    this.loading = true;
    const _res = await getInboundsByOutboundAndForwarder(
      outbound.id as number,
      {
        page: val.page - 1,
        limit: val.itemsPerPage
      }
    );
    if (_res.data) {
      const _inbounds = _res.data.data;
      this.inbounds = _inbounds;
      this.inboundServerSideOptions.totalItems = _res.data.totalElements;
    }
    this.loading = false;
  }

  async continueLoadInbound() {
    if (this.biddingDocumentsSelected[0]) {
      const _outbound = this.biddingDocumentsSelected[0].outbound as IOutbound;
      await this.loadMoreInbounds(
        {
          ...this.inboundOptions,
          page: 1
        },
        _outbound
      );
      this.stepper = 3;
    }
  }

  @Watch("inboundOptions")
  async onInboundOptionsChange(val: DataOptions) {
    if (typeof val != "undefined" && this.biddingDocumentsSelected[0]) {
      const _outbound = this.biddingDocumentsSelected[0].outbound as IOutbound;
      await this.loadMoreInbounds(val, _outbound);
    }
  }

  @Watch("containerOptions", { deep: true })
  async onContainerOptionsChange(val: DataOptions, oldVal: DataOptions) {
    if (typeof val != "undefined" && val.page != oldVal.page) {
      await this.loadMoreContainers(val);
    }
  }
}
</script>
