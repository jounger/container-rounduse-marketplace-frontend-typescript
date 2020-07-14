<template>
  <v-dialog v-model="dialogDetailSync" persistent max-width="600px">
    <v-card class="order-1 flex-grow-1 mx-auto my-1">
      <v-row justify="center">
        <MarkFeedback
          v-if="dialogMark"
          :dialogMark.sync="dialogMark"
          :feedback="feedback"
          :feedbacks.sync="feedbacks"
          :message.sync="messageSync"
          :snackbar.sync="snackbarSync"
        />
      </v-row>
      <v-row justify="center">
        <CreateFeedback
          v-if="dialogFeedback"
          :feedback="feedback"
          :feedbacks.sync="feedbacks"
          :dialogAdd.sync="dialogFeedback"
          :message.sync="messageSync"
          :snackbar.sync="snackbarSync"
          :update="update"
        />
      </v-row>
      <v-row justify="center">
        <DeleteFeedback
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :feedback="feedback"
          :feedbacks.sync="feedbacks"
          :message.sync="messageSync"
          :snackbar.sync="snackbarSync"
        />
      </v-row>
      <v-row justify="center">
        <ChangeStatusReport
          v-if="dialogStatus"
          :dialogStatus.sync="dialogStatus"
          :report="report"
          :reports.sync="reportsSync"
          :message.sync="messageSync"
          :snackbar.sync="snackbarSync"
        />
      </v-row>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Chi tiết Report</span>
          <v-btn
            icon
            dark
            @click="dialogDetailSync = false"
            style="margin-left:368px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-list dense>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>person</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Người gửi</v-list-item-title>
                  <v-list-item-subtitle>{{
                    report.sender
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-list dense>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>business_center</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>HSMT</v-list-item-title>
                  <v-list-item-subtitle @click="viewDetailBiddingDocument()">{{
                    report.report
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-col>
          <v-spacer></v-spacer>
          <v-btn
            style="margin-top: 30px!important;"
            class="ma-1"
            tile
            outlined
            color="success"
            @click.stop="openStatusDialog()"
            small
            v-if="$auth.user().roles[0] == 'ROLE_MODERATOR'"
          >
            <v-icon left>mdi-pencil</v-icon> Đặt trạng thái
          </v-btn>
        </v-row>
      </v-card-text>

      <v-divider class="mx-1"></v-divider>

      <v-card-title>{{ report.title }}</v-card-title>
      <v-layout col>
        <v-layout row>
          <v-flex xs12>
            <v-textarea
              outlined
              name="detail"
              label="Chi tiết"
              :value="report.detail"
              hint="Nội dung Report"
              readonly
            ></v-textarea>
          </v-flex>
        </v-layout>
      </v-layout>
      <v-list dense>
        <v-list-item v-for="item in feedbacks" :key="item.title">
          <v-list-item-icon>
            <v-icon>military_tech</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title style="font-weight:bold;">{{
              item.sender
            }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-content
            ><v-list-item-title>{{
              item.message
            }}</v-list-item-title></v-list-item-content
          >
          <v-menu
            :close-on-click="true"
            v-if="report.status == 'PENDING' || report.status == 'UPDATED'"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="pink" icon outlined v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-if="item.sender != $auth.user().username">
                <v-list-item-icon>
                  <v-icon small>add</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Chấm điểm</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="openCreateDialog(item)"
                v-if="item.sender != $auth.user().username"
              >
                <v-list-item-icon>
                  <v-icon small>create</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Phản hồi</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="openUpdateDialog(item)"
                v-if="item.sender == $auth.user().username"
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
                v-if="item.sender == $auth.user().username"
              >
                <v-list-item-icon>
                  <v-icon small>delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xóa</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item>
      </v-list>
      <v-btn
        v-if="
          feedbacks.length == 0 &&
            (report.status == 'PENDING' || report.status == 'UPDATED')
        "
        @click="openCreateDialog()"
        style="coler: green"
        >Phản hồi</v-btn
      >
      <!-- TODO: table bids -->
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import Utils from "@/mixin/utils";
import { IReport } from "@/entity/report";
import { IFeedback } from "@/entity/feedback";
import CreateFeedback from "../../../operator/supplier-report/components/CreateFeedback.vue";
import DeleteFeedback from "../../../operator/supplier-report/components/DeleteFeedback.vue";
import { getFeedbacksByReport } from "@/api/feedback";
import { PaginationResponse } from "@/api/payload";
import MarkFeedback from "./MarkFeedback.vue";
import ChangeStatusReport from "./ChangeStatusReport.vue";

@Component({
  mixins: [Utils],
  components: {
    CreateFeedback,
    DeleteFeedback,
    MarkFeedback,
    ChangeStatusReport
  }
})
export default class ReportDetail extends Vue {
  @PropSync("dialogDetail", { type: Boolean }) dialogDetailSync!: boolean;
  @Prop(Object) report!: IReport;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("reports", { type: Array }) reportsSync!: Array<IReport>;

  feedbacks: Array<IFeedback> = [];
  dialogFeedback = false;
  dialogDel = false;
  dialogMark = false;
  dialogStatus = false;
  feedback = {} as IFeedback;
  update = false;
  openFeedback = false;
  created() {
    console.log(this.reportsSync);
    if (this.report.id) {
      getFeedbacksByReport(this.report.id, {
        page: 0,
        limit: 100
      })
        .then(res => {
          const response: PaginationResponse<IFeedback> = res.data;
          this.feedbacks = response.data;
        })
        .catch(err => {
          console.log(err);
        })
        .finally();
    }
  }
  openCreateDialog() {
    this.update = false;
    this.feedback = {} as IFeedback;
    this.dialogFeedback = true;
  }

  openUpdateDialog(item: IFeedback) {
    this.update = true;
    this.feedback = item;
    this.dialogFeedback = true;
  }

  openDeleteDialog(item: IFeedback) {
    this.feedback = item;
    this.dialogDel = true;
  }
  openMarkDialog(item: IFeedback) {
    this.feedback = item;
    this.dialogMark = true;
  }
  openStatusDialog() {
    this.dialogStatus = true;
  }
  viewDetailBiddingDocument() {
    this.$router.push({ path: `/bidding-document/${this.report.report}` });
  }
}
</script>
