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
        <v-toolbar-title>Thêm mới Report</v-toolbar-title>
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
              :options.sync="options"
              :server-items-length="options.totalItems"
              :footer-props="{
                'items-per-page-options': options.itemsPerPageItems
              }"
              :actions-append="options.page"
              class="elevation-1 my-1"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Chọn HSMT</v-toolbar-title>
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
              @click="stepper = 2"
              :disabled="isEmptyObject(biddingDocumentSelected)"
              >Tiếp tục</v-btn
            >
          </v-stepper-content>
          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable">
            Thông tin Report
            <small>Thông tin chung</small>
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-form ref="bidForm" v-model="valid" validation>
              <v-text-field
                v-model="reportLocal.sender"
                prepend-icon="person"
                name="sender"
                type="text"
                readonly
                label="Người gửi"
              ></v-text-field>
              <v-text-field
                label="Tiêu đề"
                name="title"
                prepend-icon="menu"
                v-model="reportLocal.title"
                type="text"
                :rules="[minLength('title', 5), maxLength('title', 20)]"
              ></v-text-field>
              <v-text-field
                label="Nội dung"
                name="detail"
                prepend-icon="description"
                v-model="reportLocal.detail"
                type="text"
                :rules="[minLength('detail', 5), maxLength('detail', 20)]"
              ></v-text-field>
              <v-btn color="primary" @click="stepper = 3" :disabled="!valid"
                >Tiếp tục</v-btn
              >
              <v-btn text @click="stepper = 1">Quay lại</v-btn>
            </v-form>
          </v-stepper-content>
          <v-stepper-step step="3">Hoàn thành</v-stepper-step>
          <v-stepper-content step="3">
            <v-form ref="finishForm">
              <v-checkbox
                v-model="checkbox"
                label="Bạn đồng ý rằng tất cả các thông tin đưa lên đều là chính xác."
              ></v-checkbox>
              <v-btn
                color="primary"
                @click="createReport()"
                :disabled="!checkbox"
                >Hoàn tất</v-btn
              >
              <v-btn text @click="stepper = 2">Quay lại</v-btn>
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
import FormValidate from "@/mixin/form-validate";
import Utils from "@/mixin/utils";
import { PaginationResponse } from "@/api/payload";
import { IBiddingDocument } from "@/entity/bidding-document";
import { isEmptyObject } from "@/utils/tool";
import { BiddingDocumentData } from "../../bidding-document/data";
import { IReport } from "@/entity/report";
@Component({
  mixins: [FormValidate, Utils]
})
export default class CreateReport extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("biddingDocument", { type: Object })
  biddingDocumentSync!: IBiddingDocument;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("reports", { type: Array }) reportsSync!: Array<IReport>;

  biddingDocuments: Array<IBiddingDocument> = [];
  biddingDocumentSelected = {} as IBiddingDocument;
  dateInit = new Date().toISOString().substr(0, 10);
  reportLocal = {
    sender: this.$auth.user().username,
    report: {} as IBiddingDocument,
    title: "",
    detail: "",
    status: "PENDING"
  } as IReport;
  loading = true;
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
  createReport() {
    // TODO: API create bid
    if (this.biddingDocumentSelected.id) {
      this.reportLocal.report = this.biddingDocumentSelected;
    }
    this.reportLocal.id = 2;
    this.reportsSync.unshift(this.reportLocal);
    this.messageSync = "Thêm mới thành công Report " + this.reportLocal.id;
    this.snackbarSync = true;
  }
  created() {
    if (this.biddingDocumentSync && !isEmptyObject(this.biddingDocumentSync)) {
      this.biddingDocuments.push(this.biddingDocumentSync);
      this.selectBiddingDocument(this.biddingDocumentSync);
    } else {
      this.biddingDocuments = BiddingDocumentData;
    }
    this.options.totalItems = 10;
    this.loading = false;
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
}
</script>
