<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <DeleteFeedback
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :feedback="feedback"
          :feedbacks.sync="feedbacks"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <CreateFeedback
          v-if="dialogAdd"
          :feedback="feedback"
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
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        show-expand
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
        <template v-slot:item.action="{}">
          <v-btn
            class="ma-1"
            tile
            outlined
            color="success"
            @click.stop="openCreateDialog()"
            small
          >
            <v-icon left>mdi-pencil</v-icon> Feedback
          </v-btn>
        </template>
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length" class="px-0">
            <v-data-table
              :headers="feedbackHeaders"
              :items="feedbacks"
              :hide-default-footer="true"
              dark
              dense
            >
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="openUpdateDialog(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="openDeleteDialog(item)">
                  delete
                </v-icon>
              </template>
            </v-data-table>
          </td>
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
import DeleteFeedback from "./components/DeleteFeedback.vue";

@Component({
  components: {
    CreateFeedback,
    DeleteFeedback,
    Snackbar
  }
})
export default class Report extends Vue {
  reports: Array<IReport> = [];
  report = {} as IReport;

  dialogAdd = false;
  dialogDel = false;
  singleExpand = true;
  feedbacks: Array<IFeedback> = [];
  feedback = {} as IFeedback;
  expanded: Array<IReport> = [];
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
  feedbackHeaders = [
    {
      text: "Mã Feedback",
      value: "id",
      class: "elevation-1 primary"
    },
    { text: "Người gửi", value: "sender", class: "elevation-1 primary" },
    { text: "Nội dung", value: "message", class: "elevation-1 primary" },
    {
      text: "Chấm điểm",
      value: "satisfactionPoints",
      class: "elevation-1 primary"
    },
    {
      text: "Hành động",
      class: "elevation-1 primary",
      value: "actions",
      sortable: false,
      align: "center"
    }
  ];

  openCreateDialog() {
    this.update = false;
    this.feedback = {} as IFeedback;
    this.dialogAdd = true;
  }

  openUpdateDialog(item: IFeedback) {
    this.update = true;
    this.feedback = item;
    this.dialogAdd = true;
  }

  openDeleteDialog(item: IFeedback) {
    this.feedback = item;
    this.dialogDel = true;
  }
  created() {
    this.reports = ReportData;
    this.options.totalItems = this.reports.length;
    this.loading = false;
  }
  viewDetailReport(item: IReport) {
    this.$router.push({ path: `/bidding-document/${item.report.id}` });
  }
  clicked(value: IReport) {
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded.splice(0, this.expanded.length);
      } else {
        this.expanded.splice(0, this.expanded.length);
        this.expanded.push(value);
      }
    } else {
      const index = this.expanded.findIndex(x => x.id === value.id);
      if (index === -1) {
        this.expanded.push(value);
      } else {
        this.expanded.splice(index, 1);
      }
    }
  }

  // @Watch("options", { deep: true })
  // onOptionsChange(val: object, oldVal: object) {
  //   if (val !== oldVal) {
  //     getReportsByStatus({
  //       page: this.options.page - 1,
  //       limit: this.options.itemsPerPage,
  //       status: "PENDING"
  //     })
  //       .then(res => {
  //         const response: PaginationResponse<IReport> = res.data;
  //         console.log("watch", this.options);
  //         this.reports = response.data.filter(
  //           x =>
  //             (x.roles[0] == "ROLE_FORWARDER" ||
  //               x.roles[0] == "ROLE_MERCHANT") &&
  //             x.status == "PENDING"
  //         );
  //         this.options.totalItems = response.totalElements;
  //       })
  //       .catch(err => console.log(err))
  //       .finally(() => (this.loading = false));
  //   }
  // }
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
