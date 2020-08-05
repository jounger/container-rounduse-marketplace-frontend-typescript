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
              :server-items-length="serverSideOptions.totalItems"
              :footer-props="{
                'items-per-page-options': serverSideOptions.itemsPerPageItems
              }"
              :actions-append="options.page"
              disable-sort
              class="elevation-1 my-1"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Chọn HSMT</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                </v-toolbar>
              </template>
              <template v-slot:item.bidOpening="{ item }">
                {{ formatDatetime(item.bidOpening) }}
              </template>
              <template v-slot:item.bidClosing="{ item }">
                {{ formatDatetime(item.bidClosing) }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-switch
                  v-model="biddingDocumentSelected"
                  :value="item"
                ></v-switch>
              </template>
            </v-data-table>
            <v-btn
              color="primary"
              @click="stepper = 2"
              :disabled="!biddingDocumentSelected"
              >Tiếp tục</v-btn
            >
          </v-stepper-content>
          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable">
            Thông tin Report
            <small>Thông tin chung</small>
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-form ref="bidForm" v-model="valid" validation>
              <!-- <v-text-field
                v-model="reportLocal.sender"
                prepend-icon="person"
                name="sender"
                type="text"
                readonly
                label="Người gửi"
              ></v-text-field> -->
              <v-text-field
                label="Tiêu đề"
                name="title"
                prepend-icon="menu"
                v-model="reportLocal.title"
                type="text"
                :counter="20"
                :rules="[minLength('title', 5), maxLength('title', 100)]"
              ></v-text-field>
              <v-textarea
                outlined
                label="Nội dung"
                name="detail"
                prepend-icon="description"
                v-model="reportLocal.detail"
                type="text"
                :counter="200"
                :rules="[minLength('detail', 5), maxLength('detail', 200)]"
              ></v-textarea>
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
import { IBiddingDocument } from "@/entity/bidding-document";
import { isEmptyObject } from "@/utils/tool";
import { IReport } from "@/entity/report";
import { IBiddingNotification } from "@/entity/bidding-notification";
import { getBiddingNotificationsByUser } from "@/api/notification";
import { createReport } from "@/api/report";
import { DataOptions } from "vuetify";

@Component({
  mixins: [FormValidate, Utils]
})
export default class CreateReport extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("reports", { type: Array }) reportsSync?: Array<IReport>;
  @PropSync("totalItems", { type: Number }) totalItemsSync?: number;
  @PropSync("biddingDocument", { type: Object })
  biddingDocumentSync?: IBiddingDocument;

  biddingDocuments: Array<IBiddingDocument> = [];
  biddingDocumentSelected = null as IBiddingDocument | null;
  dateInit = new Date().toISOString().substr(0, 10);
  reportLocal = {
    sender: this.$auth.user().username,
    report: 0,
    title: "",
    detail: "",
    status: "PENDING"
  } as IReport;
  loading = true;
  options = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
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
    { text: "Mã booking", value: "outbound.booking.number" },
    { text: "Giá gói thầu", value: "bidPackagePrice" },
    { text: "Mở thầu", value: "bidOpening" },
    { text: "Đóng thầu", value: "bidClosing" },
    { text: "Nhiều thầu win", value: "isMultipleAward" },
    { text: "Actions", value: "actions", sortable: false }
  ];
  async createReport() {
    // TODO: API create bid
    if (this.biddingDocumentSelected && this.biddingDocumentSelected.id) {
      this.reportLocal.report = this.biddingDocumentSelected.id as number;
    }
    const _report = await createReport(this.reportLocal);
    if (_report.data) {
      if (typeof this.reportsSync != "undefined") {
        this.reportsSync.unshift(_report.data);
      }
      if (typeof this.totalItemsSync != "undefined") {
        this.totalItemsSync += 1;
      }
      this.dialogAddSync = false;
    }
  }
  async created() {
    if (this.biddingDocumentSync && !isEmptyObject(this.biddingDocumentSync)) {
      this.biddingDocuments.push(this.biddingDocumentSync);
      this.biddingDocumentSelected = this.biddingDocumentSync;
      this.serverSideOptions.totalItems = 1;
      this.loading = false;
    } else {
      const _res = await getBiddingNotificationsByUser({
        page: 0,
        limit: 100
      });
      if (_res.data) {
        const _biddingNotifications = _res.data.data as IBiddingNotification[];
        this.biddingDocuments = _biddingNotifications
          .filter(x => x.action == "ADDED")
          .reduce(function(
            pV: Array<IBiddingDocument>,
            cV: IBiddingNotification
          ) {
            pV.push(cV.relatedResource);
            return pV;
          },
          []);
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
