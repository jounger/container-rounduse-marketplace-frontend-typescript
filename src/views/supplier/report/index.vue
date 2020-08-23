<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="reports"
        item-key="id"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
        no-data-text="Danh sách Report rỗng."
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Danh sách Report</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
          </v-toolbar>
        </template>
        <template v-slot:item.reportId="{ item }">
          <v-btn
            class="ma-1"
            tile
            outlined
            color="info"
            @click.stop="openBiddingDocumentDetail(item)"
            small
          >
            <v-icon left>remove_red_eye</v-icon> Xem HSMT
          </v-btn>
        </template>
        <template v-slot:item.sendDate="{ item }">
          {{ formatDatetime(item.sendDate) }}
        </template>
        <template v-slot:item.status="{ item }">
          <ChipStatus :status="item.status" />
        </template>
        <template v-slot:item.actions="{ item }">
          <v-menu :close-on-click="true">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" icon outlined v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item :to="`/report/${item.id}`">
                <v-list-item-icon>
                  <v-icon small>remove_red_eye</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xem chi tiết</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="openUpdateDialog(item)"
                v-if="$auth.check('ROLE_FORWARDER')"
              >
                <v-list-item-icon>
                  <v-icon small>edit</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Chỉnh sửa</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="openDeleteDialog(item)"
                v-if="$auth.check('ROLE_FORWARDER')"
              >
                <v-list-item-icon>
                  <v-icon small>delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xóa bỏ</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
    <v-row justify="center">
      <DeleteReport
        v-if="dialogDel"
        :dialogDel.sync="dialogDel"
        :report="report"
        :reports.sync="reports"
        :totalItems.sync="serverSideOptions.totalItems"
      />
      <ReportBiddingDocument
        v-if="dialogBiddingDocumentDetail"
        :biddingDocument="biddingDocument"
        :dialogDetail.sync="dialogBiddingDocumentDetail"
      />
      <CreateReport
        v-if="dialogAdd"
        :reports.sync="reports"
        :dialogAdd.sync="dialogAdd"
        :totalItems.sync="serverSideOptions.totalItems"
      />
      <UpdateReport
        v-if="dialogEdit"
        :report="report"
        :reports.sync="reports"
        :dialogEdit.sync="dialogEdit"
      />
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IReport } from "@/entity/report";
import CreateReport from "./components/CreateReport.vue";
import DeleteReport from "./components/DeleteReport.vue";
import UpdateReport from "./components/UpdateReport.vue";
import { getReports } from "@/api/report";
import { DataOptions } from "vuetify";
import ReportBiddingDocument from "../bidding-document/components/ReportBiddingDocument.vue";
import { IBiddingDocument } from "@/entity/bidding-document";
import Utils from "@/mixin/utils";
import ChipStatus from "@/components/ChipStatus.vue";

@Component({
  mixins: [Utils],
  components: {
    CreateReport,
    DeleteReport,
    UpdateReport,
    ReportBiddingDocument,
    ChipStatus
  }
})
export default class Report extends Vue {
  reports: Array<IReport> = [];
  report = null as IReport | null;
  biddingDocument = null as IBiddingDocument | null;

  dialogAdd = false;
  dialogDel = false;
  dialogEdit = false;
  dialogMark = false;
  dialogBiddingDocumentDetail = false;
  loading = true;
  options = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
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
    { text: "Tiêu đề", value: "title" },
    { text: "Ngày gửi", value: "sendDate" },
    { text: "Người gửi", value: "sender.companyName" },
    { text: "SĐT liên hệ", value: "sender.phone" },
    { text: "Nguồn liên quan", value: "reportId" },
    { text: "Trạng thái", value: "status" },
    { text: "Hành động", value: "actions" }
  ];

  openUpdateDialog(item: IReport) {
    this.report = item;
    this.dialogEdit = true;
  }

  openDeleteDialog(item: IReport) {
    this.report = item;
    this.dialogDel = true;
  }

  openBiddingDocumentDetail(item: IReport) {
    this.biddingDocument = item.report as IBiddingDocument;
    this.dialogBiddingDocumentDetail = true;
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getReports({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _reports = _res.data.data;
        this.reports = _reports;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
