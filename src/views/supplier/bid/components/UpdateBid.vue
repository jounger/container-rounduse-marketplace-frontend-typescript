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
        :outbound="biddingDocument.outbound"
        :bid.sync="bid"
        :action="action"
        :container="container"
        :containers.sync="containers"
        :totalItems.sync="containerServerSideOptions.totalItems"
      />
      <ConfirmContainer
        v-if="dialogConfirm"
        :dialogConfirm.sync="dialogConfirm"
        :bid.sync="bid"
        :container="container"
        :containers.sync="containers"
        :totalItems.sync="containerServerSideOptions.totalItems"
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
        <v-stepper v-model="stepper" vertical class="elevation-0">
          <v-stepper-step :complete="stepper > 1" step="1" :editable="editable">
            Chọn HSMT
            <small>Thông tin bắt buộc</small>
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-data-table
              :headers="biddingDocumentHeaders"
              :items="biddingDocuments"
              item-key="id"
              no-data-text="Danh sách HSMT đã chọn rỗng."
              disable-sort
              class="elevation-0 mb-1"
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
              <template v-slot:item.bidPackagePrice="{ item }">
                {{ currencyFormatter(item.bidPackagePrice) }}
              </template>
              <template v-slot:item.bidFloorPrice="{ item }">
                {{ currencyFormatter(item.bidFloorPrice) }}
              </template>
            </v-data-table>
            <v-btn color="primary" @click="stepper = 2">Tiếp tục</v-btn>
          </v-stepper-content>
          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable">
            Thông tin HSDT
            <small>Thông tin chung</small>
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-form
              ref="bidForm"
              v-model="valid"
              lazy-validation
              v-if="bidLocal"
            >
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="bidLocal.bidPrice"
                    :hint="currencyFormatter(bidLocal.bidPrice)"
                    prepend-icon="monetization_on"
                    v-if="biddingDocument"
                    type="number"
                    :rules="[
                      minNumber('Giá gửi thầu', biddingDocument.bidFloorPrice),
                      maxNumber('Giá gửi thầu', biddingDocument.bidPackagePrice)
                    ]"
                    label="Giá gửi thầu"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <DatetimePicker
                    :datetime="bidLocal.validityPeriod"
                    :return-value.sync="bidLocal.validityPeriod"
                    dateicon="update"
                    datelabel="Ngày hiệu lực"
                    timelabel="Giờ hiệu lực"
                  /> </v-col
              ></v-row>
            </v-form>
            <v-btn color="primary" @click="updateBid()" :disabled="!valid"
              >Lưu và Tiếp tục</v-btn
            >
            <v-btn text @click="stepper = 1">Quay lại</v-btn>
          </v-stepper-content>
          <v-stepper-step :complete="stepper > 3" step="3" :editable="editable"
            >Danh sách Container<small
              >Danh sách Container đã chọn</small
            ></v-stepper-step
          >
          <!-- SELECT CONTAINER -->
          <v-stepper-content step="3">
            <v-data-table
              :headers="containerSelectedHeaders"
              :items="containers"
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
              class="elevation-0 mb-1"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Danh sách Container đã chọn</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="
                      biddingDocument &&
                        biddingDocument.isMultipleAward &&
                        containerServerSideOptions.totalItems <
                          biddingDocument.outbound.booking.unit
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
                      color="primary"
                      icon
                      outlined
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
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
                        biddingDocument.isMultipleAward && containers.length > 0
                      "
                    >
                      <v-list-item-icon>
                        <v-icon small>delete</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Bỏ chọn Container</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-data-table>
            <v-btn
              v-if="biddingDocument && biddingDocument.isMultipleAward"
              color="primary"
              @click="dialogEditSync = false"
              :disabled="containers.length == 0"
              >Hoàn tất</v-btn
            >
            <v-btn
              v-if="biddingDocument && biddingDocument.isMultipleAward == false"
              color="primary"
              @click="dialogEditSync = false"
              :disabled="
                containers.length < biddingDocument.outbound.booking.unit
              "
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
import { Component, Vue, PropSync, Watch, Prop } from "vue-property-decorator";
import { IBid } from "@/entity/bid";
import { IContainer } from "@/entity/container";
import FormValidate from "@/mixin/form-validate";
import Utils from "@/mixin/utils";
import { IBiddingDocument } from "@/entity/bidding-document";
import { addTimeToDate } from "@/utils/tool";

import { DataOptions } from "vuetify";
import ListContainer from "./ListContainer.vue";
import { editBid } from "@/api/bid";
import ConfirmContainer from "./ConfirmContainer.vue";
import { getContainersByBid } from "@/api/container";
import DatetimePicker from "@/components/DatetimePicker.vue";

@Component({
  mixins: [FormValidate, Utils],
  components: {
    ListContainer,
    ConfirmContainer,
    DatetimePicker
  }
})
export default class UpdateBid extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @Prop() biddingDocument!: IBiddingDocument;
  @Prop() bid!: IBid;

  biddingDocuments: Array<IBiddingDocument> = [];
  container = null as IContainer | null;
  action = "";
  dialogConfirm = false;
  dateInit = addTimeToDate(new Date().toString());
  bidLocal = null as IBid | null;
  dialogContainer = false;
  loading = true;
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
  stepper = 1;
  valid = true;
  // Inbound
  containers: Array<IContainer> = [];
  biddingDocumentHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    { text: "Bên mời thầu", value: "offeree.companyName" },
    { text: "Hãng tàu", value: "outbound.shippingLine.companyName" },
    { text: "Loại cont", value: "outbound.containerType.name" },
    { text: "Giá gói thầu", value: "bidPackagePrice" },
    { text: "Giá sàn", value: "bidFloorPrice" },
    { text: "Mở thầu", value: "bidOpening" },
    { text: "Đóng thầu", value: "bidClosing" },
    { text: "Nhiều thầu thắng", value: "isMultipleAward" }
  ];
  containerSelectedHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    {
      text: "Container No.",
      value: "number"
    },
    { text: "Lái xe", value: "driver.fullname" },
    {
      text: "Rơ mọt",
      value: "trailer.licensePlate"
    },
    {
      text: "Đầu kéo",
      value: "tractor.licensePlate"
    },
    {
      text: "Trạng thái",
      value: "status"
    },
    { text: "Hành động", value: "actions" }
  ];

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

  @Watch("containerOptions", { immediate: true })
  async onContainerOptionsChange(val: DataOptions) {
    if (typeof val != "undefined" && this.bid) {
      this.loading = true;
      const _res = await getContainersByBid(this.bid.id as number, {
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _containers = _res.data.data;
        this.containers = _containers;
        this.containerServerSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }

  async updateBid() {
    if (this.bid && this.bidLocal) {
      const _res = await editBid(this.bid.id as number, {
        bidPrice: this.bidLocal.bidPrice
      });
      if (_res.data) {
        const _bid = _res.data.data;
        this.bid = _bid;
        this.stepper = 3;
      }
    }
  }

  mounted() {
    this.bidLocal = Object.assign({}, this.bid);
    this.biddingDocuments.push(this.biddingDocument);
  }
}
</script>
