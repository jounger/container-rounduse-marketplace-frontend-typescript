<template>
  <v-content>
    <v-card class="ma-5">
      <v-row justify="center">
        <DeleteReport
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :report="report"
          :reports.sync="reports"
          :totalItems.sync="serverSideOptions.totalItems"
        />
      </v-row>
      <v-row justify="center">
        <CreateReport
          v-if="dialogAdd"
          :reports.sync="reports"
          :dialogAdd.sync="dialogAdd"
          :totalItems.sync="serverSideOptions.totalItems"
        />
      </v-row>
      <v-row justify="center">
        <UpdateReport
          v-if="dialogEdit"
          :report="report"
          :reports.sync="reports"
          :dialogEdit.sync="dialogEdit"
        />
      </v-row>
      <v-card-title>
        Danh sách Report
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn color="primary" dark class="mb-2" @click="dialogAdd = true"
          >Thêm mới</v-btn
        >
      </v-card-title>
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
        <template v-slot:item.status="{ item }">
          <v-chip
            :style="
              item.status == 'PENDING'
                ? 'background-color:orange'
                : item.status == 'RESOLVED'
                ? 'background-color:blueviolet'
                : item.status == 'REJECTED'
                ? 'background-color:red'
                : item.status == 'UPDATED'
                ? 'background-color:cornflowerblue'
                : 'background-color:green'
            "
            dark
            >{{ item.status }}</v-chip
          >
        </template>
        <template v-slot:item.actions="{ item }">
          <v-menu :close-on-click="true">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" icon outlined v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="openDetailDialog(item)">
                <v-list-item-icon>
                  <v-icon small>details</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xem chi tiết</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="openUpdateDialog(item)">
                <v-list-item-icon>
                  <v-icon small>edit</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Chỉnh sửa</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="openDeleteDialog(item)">
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
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IReport } from "@/entity/report";
import CreateReport from "./components/CreateReport.vue";
import DeleteReport from "./components/DeleteReport.vue";
import UpdateReport from "./components/UpdateReport.vue";
import { getReportsByUser } from "@/api/report";
import { DataOptions } from "vuetify";

@Component({
  components: {
    CreateReport,
    DeleteReport,
    UpdateReport
  }
})
export default class Report extends Vue {
  reports: Array<IReport> = [];
  report = null as IReport | null;

  dialogAdd = false;
  dialogDel = false;
  dialogEdit = false;
  dialogMark = false;
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
    { text: "Người gửi", value: "sender" },
    { text: "HSMT", value: "reportId" },
    { text: "Tiêu đề", value: "title" },
    { text: "Nội dung", value: "detail" },
    { text: "Trạng thái", value: "status" },
    {
      text: "Hành động",
      value: "actions",
      sortable: false,
      align: "center"
    }
  ];

  openUpdateDialog(item: IReport) {
    this.report = item;
    this.dialogEdit = true;
  }
  openDeleteDialog(item: IReport) {
    this.report = item;
    this.dialogDel = true;
  }
  viewDetailReport(item: IReport) {
    this.$router.push({ path: `/report-bidding-document/${item.id}` });
  }
  openDetailDialog(item: IReport) {
    const id = item.id;
    this.$router.push({ path: `/report/${id}` });
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getReportsByUser({
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
