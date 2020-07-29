<template>
  <v-content>
    <v-card class="ma-5">
      <v-row justify="center">
        <CreateFeedback
          v-if="dialogAdd"
          :feedback="feedback"
          :report="report"
          :feedbacks.sync="feedbacks"
          :dialogAdd.sync="dialogAdd"
          :update="update"
        />
      </v-row>
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
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
        disable-sort
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
            <v-icon left>business_center</v-icon> Xem HSMT
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
            <v-icon left>add</v-icon> Feedback
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
import { IFeedback } from "@/entity/feedback";
import CreateFeedback from "./components/CreateFeedback.vue";
import { getReports } from "@/api/report";
import { DataOptions } from "vuetify";
import { IBiddingDocument } from "@/entity/bidding-document";

@Component({
  components: {
    CreateFeedback
  }
})
export default class Report extends Vue {
  reports: Array<IReport> = [];
  report = {} as IReport;

  dialogAdd = false;
  feedbacks: Array<IFeedback> = [];
  feedback = {} as IFeedback;
  loading = true;
  update = false;
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
  viewDetailReport(item: IReport) {
    if (item && item.report && typeof item.report != "number") {
      const bidDocument = item.report as IBiddingDocument;
      this.$router.push({ path: `/report-bidding-document/${bidDocument.id}` });
    }
  }
  clicked(value: IReport) {
    const id = value.id;
    this.$router.push({ path: `/report/${id}` });
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _reports = await getReports({
        page: val.page - 1,
        limit: val.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IReport> = res.data;
          console.log("watch", response);
          return response;
        })
        .catch(err => {
          console.log(err);
          return null;
        });
      if (_reports) {
        this.reports = _reports.data;
        this.serverSideOptions.totalItems = _reports.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
