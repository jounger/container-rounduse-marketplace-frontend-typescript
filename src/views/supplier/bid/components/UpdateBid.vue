<template>
  <v-dialog
    v-model="dialogEditSync"
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <ListContainer
        v-if="dialogContainer"
        :dialogContainer.sync="dialogContainer"
        :biddingDocumentSelected="biddingDocumentSelected"
        :bid.sync="bidSync"
        :action="action"
        :container="container"
        :containersSelected.sync="containersSelected"
        :totalItems.sync="containerServerSideOptions.totalItems"
        :listContainersSelected.sync="containers"
      />
      <ConfirmContainer
        v-if="dialogConfirm"
        :dialogConfirm.sync="dialogConfirm"
        :container="container"
        :bid.sync="bidSync"
        :containersSelected.sync="containersSelected"
        :totalItems.sync="containerServerSideOptions.totalItems"
        :listContainersSelected.sync="containers"
      />
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogEditSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Chỉnh sửa Bid</v-toolbar-title>
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
              no-data-text="Danh sách HSMT đã chọn rỗng."
              disable-sort
              class="elevation-1 my-1"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>HSMT nhận được</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
              </template>
              <template v-slot:item.bidOpening="{ item }">
                {{ formatDatetime(item.bidOpening) }}
              </template>
              <template v-slot:item.bidClosing="{ item }">
                {{ formatDatetime(item.bidClosing) }}
              </template>
            </v-data-table>
            <v-btn color="primary" @click="stepper = 2">Tiếp tục</v-btn>
          </v-stepper-content>
          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable">
            Thông tin HSDT
            <small>Thông tin chung</small>
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-form ref="bidForm" v-model="valid" lazy-validation>
              <v-text-field
                v-model="bidLocal.bidPrice"
                :hint="currencyFormatter(bidLocal.bidPrice)"
                prepend-icon="monetization_on"
                v-if="biddingDocumentSelected"
                type="number"
                :rules="[
                  minNumber('bid price', biddingDocumentSelected.bidFloorPrice),
                  maxNumber(
                    'bid price',
                    biddingDocumentSelected.bidPackagePrice
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
              <v-btn color="primary" @click="updateBid()" :disabled="!valid"
                >Lưu và Tiếp tục</v-btn
              >
              <v-btn text @click="stepper = 1">Quay lại</v-btn>
            </v-form>
          </v-stepper-content>
          <v-stepper-step :complete="stepper > 3" step="3" :editable="editable"
            >Danh sách Container<small
              >Danh sách Container đã chọn</small
            ></v-stepper-step
          >
          <!-- SELECT CONTAINER -->
          <v-stepper-content step="3">
            <v-container fluid>
              <v-data-table
                :headers="containerSelectedHeaders"
                :items="containersSelected"
                item-key="id"
                :loading="loading"
                :options.sync="containerOptions"
                no-data-text="Danh sách Container đã chọn rỗng."
                :server-items-length="containerServerSideOptions.totalItems"
                :footer-props="{
                  'items-per-page-options':
                    containerServerSideOptions.itemsPerPageItems
                }"
                :actions-append="containerOptions.page"
                disable-sort
                class="elevation-1 my-1"
              >
                <template v-slot:top>
                  <v-toolbar flat color="white">
                    <v-toolbar-title
                      >Danh sách Container đã chọn</v-toolbar-title
                    >
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-btn
                      v-if="
                        biddingDocumentSelected &&
                          biddingDocumentSelected.isMultipleAward &&
                          containerServerSideOptions.totalItems < unit
                      "
                      color="primary"
                      dark
                      class="mb-2"
                      @click="openCreateContainerBid()"
                    >
                      Thêm Container
                    </v-btn>
                  </v-toolbar>
                </template>
                <template v-slot:item.actions="{ item }">
                  <v-menu :close-on-click="true">
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        color="pink"
                        icon
                        outlined
                        v-bind="attrs"
                        v-on="on"
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="openChangeDialog(item)">
                        <v-list-item-icon>
                          <v-icon small>edit</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>Đổi Container</v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-list-item
                        @click="openDeleteDialog(item)"
                        v-if="
                          biddingDocumentSelected.isMultipleAward &&
                            containers.length > 0
                        "
                      >
                        <v-list-item-icon>
                          <v-icon small>delete</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title
                            >Bỏ chọn Container</v-list-item-title
                          >
                        </v-list-item-content>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-data-table>
            </v-container>
            <v-btn
              v-if="
                biddingDocumentSelected &&
                  biddingDocumentSelected.isMultipleAward
              "
              color="primary"
              @click="dialogEditSync = false"
              :disabled="containers.length == 0"
              >Hoàn tất</v-btn
            >
            <v-btn
              v-if="
                biddingDocumentSelected &&
                  !biddingDocumentSelected.isMultipleAward
              "
              color="primary"
              @click="dialogEditSync = false"
              :disabled="containers.length < unit"
              >Hoàn tất</v-btn
            >
            <v-btn text @click="stepper = 2">Quay lại</v-btn>
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
import Utils from "@/mixin/utils";
import { IBiddingDocument } from "@/entity/bidding-document";
import { isEmptyObject, addTimeToDate } from "@/utils/tool";

import { DataOptions } from "vuetify";
import ListContainer from "./ListContainer.vue";
import { editBid } from "@/api/bid";
import ConfirmContainer from "./ConfirmContainer.vue";
import { IOutbound } from "@/entity/outbound";

@Component({
  mixins: [FormValidate, Utils],
  components: {
    ListContainer,
    ConfirmContainer
  }
})
export default class Update extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @PropSync("biddingDocument", { type: Object })
  biddingDocumentSync!: IBiddingDocument;
  @PropSync("bids", { type: Array }) bidsSync!: Array<IBid>;
  @PropSync("bid", { type: Object }) bidSync!: IBid;

  biddingDocuments: Array<IBiddingDocument> = [];
  biddingDocumentSelected = null as IBiddingDocument | null;
  container = null as IContainer | null;
  action = "";
  dialogConfirm = false;
  dateInit = addTimeToDate(new Date().toString());
  bidLocal = {} as IBid;
  dialogContainer = false;
  loading = true;
  biddingDocumentOptions = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  biddingDocumentServerSideOptions = {
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
  editable = true;
  unit = 0;
  stepper = 1;
  valid = true;
  // Inbound
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
    { text: "Loại cont", value: "outbound.containerType" },
    { text: "Mã booking", value: "outbound.booking.number" },
    { text: "Giá gói thầu", value: "bidPackagePrice" },
    { text: "Mở thầu", value: "bidOpening" },
    { text: "Đóng thầu", value: "bidClosing" },
    { text: "Nhiều thầu win", value: "isMultipleAward" }
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
    { text: "Hành động", value: "actions" }
  ];
  // Bid
  openCreateContainerBid() {
    this.action = "ADD";
    this.dialogContainer = true;
  }
  openChangeDialog(item: IContainer) {
    this.container = item;
    this.action = "CHANGE";
    this.dialogContainer = true;
  }
  openDeleteDialog(item: IContainer) {
    this.container = item;
    this.dialogConfirm = true;
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
        const _outbound = this.biddingDocumentSelected.outbound as IOutbound;
        this.unit = _outbound.booking.unit;
        this.biddingDocumentServerSideOptions.totalItems = 1;
        this.loading = false;
      }
      this.loading = false;
    }
  }
  @Watch("containerOptions")
  async onContainerOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.containersSelected = [] as Array<IContainer>;
      this.loading = true;
      const start = (val.page - 1) * val.itemsPerPage;
      let end = start + val.itemsPerPage - 1;
      if (end > this.containers.length - 1) {
        end = this.containers.length - 1;
      }
      console.log(start);
      console.log(end);
      console.log(this.containers);
      for (let i = start; i <= end; i++) {
        this.containersSelected.push(this.containers[i]);
      }

      this.loading = false;
    }
  }
  created() {
    this.bidLocal = Object.assign({}, this.bidSync);
    this.containers = this.bidLocal.containers as Array<IContainer>;
    this.containerServerSideOptions.totalItems = this.bidLocal.containers.length;
  }
  async updateBid() {
    if (this.bidSync.id) {
      console.log(this.bidSync.bidder);
      console.log(this.$auth.user().username);
      const _bid = await editBid(this.bidSync.id, {
        bidPrice: this.bidLocal.bidPrice
      });
      if (_bid.data) {
        this.bidSync = _bid.data;
        this.stepper = 3;
      }
    }
  }
}
</script>
