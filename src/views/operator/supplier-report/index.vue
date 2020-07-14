<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <ReportDetail
          v-if="dialogDetail"
          :dialogDetail.sync="dialogDetail"
          :report="report"
          :reports.sync="reports"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <CreateFeedback
          v-if="dialogAdd"
          :feedback="feedback"
          :report="report"
          :feedbacks.sync="feedbacks"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :snackbar.sync="snackbar"
          :update="update"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-card-title>
        Danh sách Report
        <v-spacer></v-spacer>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="reports"
        @click:row="clicked"
        item-key="id"
        :loading="loading"
        :options.sync="options"
        :server-items-length="options.totalItems"
        :footer-props="{ 'items-per-page-options': options.itemsPerPageItems }"
        :actions-append="options.page"
        class="elevation-1"
      >
        <template v-slot:item.reportId="{ item }">
          <v-btn
            class="ma-1"
            tile
            outlined
            color="success"
            @click.stop="viewDetailReport(item)"
            small
          >
            <v-icon left>mdi-pencil</v-icon> Xem HSMT
          </v-btn>
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn
            class="ma-1"
            tile
            outlined
            color="success"
            @click.stop="openCreateDialog(item)"
            small
          >
            <v-icon left>mdi-pencil</v-icon> Feedback
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IReport } from "@/entity/report";
// import { getReportsByStatus } from "@/api/report";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";
import { ReportData } from "./data";
import { IFeedback } from "@/entity/feedback";
import CreateFeedback from "./components/CreateFeedback.vue";
import ReportDetail from "../../supplier/report/components/ReportDetail.vue";
import { getReports } from "@/api/report";

@Component({
  components: {
    CreateFeedback,
    ReportDetail,
    Snackbar
  }
})
export default class Report extends Vue {
  reports: Array<IReport> = [];
  report = {} as IReport;

  dialogAdd = false;
  dialogDetail = false;
  feedbacks: Array<IFeedback> = [];
  feedback = {} as IFeedback;
  loading = true;
  update = false;
  message = "";
  snackbar = false;
  options = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  headers = [
    {
      text: "Mã Report",
      value: "id"
    },
    { text: "Người gửi", value: "sender" },
    { text: "HSMT", value: "reportId" },
    { text: "Tiêu đề", value: "title" },
    { text: "Nội dung", value: "detail" },
    { text: "Trạng thái", value: "status" },
    {
      text: "Hành động",
      value: "action",
      sortable: false,
      align: "center"
    }
  ];

  openCreateDialog(item: IReport) {
    this.report = item;
    this.update = false;
    this.feedback = {} as IFeedback;
    this.dialogAdd = true;
  }
  created() {
    this.reports = ReportData;
    this.options.totalItems = this.reports.length;
    this.loading = false;
  }
  viewDetailReport(item: IReport) {
    this.$router.push({ path: `/bidding-document/${item.report}` });
  }
  clicked(value: IReport) {
    this.report = value;
    this.dialogDetail = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    if (val !== oldVal) {
      getReports({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IReport> = res.data;
          console.log("watch", this.options);
          this.reports = response.data;
          this.options.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
}
</script>
<style type="text/css">
.line {
  margin-top: 10px;
  width: 520px;
  border-bottom: 1px solid black;
  position: absolute;
}
</style>
