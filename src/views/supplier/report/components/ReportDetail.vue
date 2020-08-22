<template>
  <v-container fluid>
    <div>
      <v-card class="mx-auto" width="800" v-if="report">
        <v-row>
          <v-col cols="12" md="11">
            <v-list-item two-line>
              <v-list-item-avatar color="tertiary">
                <v-img
                  v-if="report.sender.profileImagePath"
                  :src="report.sender.profileImagePath"
                ></v-img>
                <span v-else class="white--text headline">{{
                  report.sender.username
                    ? report.sender.username.substring(0, 1).toUpperCase()
                    : ""
                }}</span>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  ><span style="font-weight:bold;">{{
                    report.sender.fullname
                  }}</span></v-list-item-title
                >
                <v-list-item-subtitle>{{
                  convertTime(report.sendDate)
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" md="1">
            <v-menu :close-on-click="true">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" icon outlined v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense offset-y>
                <v-list-item @click="openBiddingDocumentDetail">
                  <v-list-item-icon>
                    <v-icon small>remove_red_eye</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Xem chi tiết HSMT</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  @click="openConfirmDialog('REJECTED')"
                  v-if="
                    $auth.check('ROLE_MODERATOR') &&
                      ['PENDING'].includes(report.status)
                  "
                >
                  <v-list-item-icon>
                    <v-icon small>cancel</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Từ chối</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  @click="openConfirmDialog('CLOSED')"
                  v-if="
                    $auth.check('ROLE_MODERATOR') &&
                      ['RESOLVED'].includes(report.status)
                  "
                >
                  <v-list-item-icon>
                    <v-icon small>close</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Đóng Report</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  @click="openConfirmDialog('RESOLVED')"
                  v-if="
                    $auth.check('ROLE_FORWARDER') &&
                      ['PENDING', 'UPDATED'].includes(report.status)
                  "
                >
                  <v-list-item-icon>
                    <v-icon small>delete</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Đóng Report</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-col>
        </v-row>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title style="font-weight:bold;"
              >{{ report.title }}
            </v-list-item-title>
            <v-list-item-subtitle>{{ report.detail }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider></v-divider>
        <v-row>
          <v-col cols="12" md="4">
            <h5 class="ml-5">Phản hồi:</h5>
          </v-col>
          <v-col cols="12" md="8">
            <div
              class="text-center"
              v-if="options.page < serverSideOptions.totalPages"
            >
              <v-btn
                class="ma-2"
                :loading="loading"
                :disabled="loading"
                @click.stop="seeMore()"
                outlined
                color="tertiary"
                small
                >Xem thêm...</v-btn
              >
            </div>
          </v-col>
        </v-row>
        <v-list dense>
          <v-list-item
            three-line
            :feedback="item"
            v-for="item in feedbacks"
            :key="item.id"
          >
            <v-list-item-avatar color="tertiary">
              <v-img
                v-if="item.sender.profileImagePath"
                :src="item.sender.profileImagePath"
              ></v-img>
              <span v-else class="white--text headline">{{
                item.sender.username
                  ? item.sender.username.substring(0, 1).toUpperCase()
                  : ""
              }}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{
                item.sender.fullname || "N/A"
              }}</v-list-item-title>
              <v-list-item-subtitle>{{
                convertTime(item.sendDate)
              }}</v-list-item-subtitle>
              <v-list-item-subtitle>{{ item.message }} </v-list-item-subtitle>
              <v-rating
                v-model="item.satisfactionPoints"
                color="yellow darken-3"
                background-color="grey darken-1"
                empty-icon="$ratingFull"
                hover
                x-small
                :readonly="
                  !$auth.check('ROLE_FORWARDER') ||
                    ($auth.check('ROLE_FORWARDER') &&
                      item.satisfactionPoints > 0)
                "
                @input="openMarkDialog(item)"
              ></v-rating>
            </v-list-item-content>
            <v-spacer></v-spacer>
            <v-menu
              :close-on-click="true"
              v-if="
                $auth.check('ROLE_MODERATOR') && item.satisfactionPoints == 0
              "
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" icon dense v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense :offset-y="true">
                <v-list-item
                  @click="openDeleteDialog(item)"
                  v-if="item.sender.username == $auth.user().username"
                >
                  <v-list-item-icon>
                    <v-icon small>delete</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Xóa bỏ</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list></v-menu
            >
          </v-list-item>
        </v-list>
        <v-row
          v-if="
            report.status != 'REJECTED' &&
              report.status != 'CLOSED' &&
              $auth.check('ROLE_MODERATOR')
          "
          align="center"
        >
          <v-col cols="12" md="1">
            <v-list-item three-line>
              <v-list-item-avatar color="tertiary">
                <v-img
                  v-if="$auth.user().profileImagePath"
                  :src="$auth.user().profileImagePath"
                ></v-img>
                <span v-else class="white--text headline">{{
                  $auth.user().username
                    ? $auth
                        .user()
                        .username.substring(0, 1)
                        .toUpperCase()
                    : ""
                }}</span>
              </v-list-item-avatar>
            </v-list-item></v-col
          >
          <v-col cols="12" md="10" class="mt-5">
            <v-form v-model="valid" validation>
              <v-textarea
                v-model="feedbackLocal.message"
                :autofocus="false"
                outlined
                rounded
                auto-grow
                clearable
                row-height="24"
                rows="1"
                :placeholder="`Phản hồi tới ${feedbackLocal.recipient}`"
                @keydown.enter.exact.prevent
                @keyup.enter.exact="createFeedback"
                @keydown.enter.shift.exact="feedbackLocal.message"
                dense
                :counter="255"
                :rules="[minLength('feedback', 2), maxLength('feedback', 255)]"
              ></v-textarea>
            </v-form> </v-col></v-row
      ></v-card>
    </div>
    <v-row justify="center">
      <ChangeStatusReport
        v-if="dialogConfirm"
        :dialogConfirm.sync="dialogConfirm"
        :report.sync="report"
        :status="status"
      />
      <ReportBiddingDocument
        v-if="dialogBiddingDocumentDetail"
        :biddingDocument="biddingDocument"
        :dialogDetail.sync="dialogBiddingDocumentDetail"
      />
      <RatingFeedback
        v-if="dialogFeedbackRating"
        :dialogRating.sync="dialogFeedbackRating"
        :feedback.sync="feedback"
        :feedbacks.sync="feedbacks"
      />
      <DeleteFeedback
        v-if="dialogFeedbackDel"
        :dialogDel.sync="dialogFeedbackDel"
        :feedback="feedback"
        :feedbacks.sync="feedbacks"
      /> </v-row
  ></v-container>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Utils from "@/mixin/utils";
import { IReport } from "@/entity/report";
import { IFeedback } from "@/entity/feedback";
import ChangeStatusReport from "./ChangeStatusReport.vue";
import { getReport } from "@/api/report";
import ReportBiddingDocument from "../../bidding-document/components/ReportBiddingDocument.vue";
import {
  getFeedbacksByReport,
  createFeedbackToModerator,
  createFeedback
} from "@/api/feedback";
import { IBiddingDocument } from "@/entity/bidding-document";
import { IUser } from "@/entity/user";
import DeleteFeedback from "./DeleteFeedback.vue";
import RatingFeedback from "./RatingFeedback.vue";
import { DataOptions } from "vuetify";
import FormValidate from "@/mixin/form-validate";

@Component({
  mixins: [FormValidate, Utils],
  components: {
    ChangeStatusReport,
    ReportBiddingDocument,
    DeleteFeedback,
    RatingFeedback
  }
})
export default class ReportDetail extends Vue {
  feedbacks: Array<IFeedback> = [];
  feedback = null as IFeedback | null;
  report = null as IReport | null;
  biddingDocument = null as IBiddingDocument | null;
  valid = true;
  options = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    totalPages: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  loading = false;
  dialogFeedbackDel = false;
  dialogFeedbackRating = false;
  dialogConfirm = false;
  dialogBiddingDocumentDetail = false;
  status = "";
  openFeedback = false;
  feedbackLocal = {
    sender: this.$auth.user().username,
    recipient: "",
    message: "",
    satisfactionPoints: 0
  } as IFeedback;

  openDeleteDialog(item: IFeedback) {
    this.feedback = item;
    this.dialogFeedbackDel = true;
  }

  openMarkDialog(item: IFeedback) {
    this.feedback = item;
    this.dialogFeedbackRating = true;
  }

  openBiddingDocumentDetail() {
    if (this.report) {
      this.biddingDocument = this.report.report as IBiddingDocument;
      this.dialogBiddingDocumentDetail = true;
    }
  }

  async createFeedback() {
    if (this.feedbackLocal && this.report) {
      const user = this.report.sender as IUser;
      const _res = this.$auth.check("ROLE_MODERATOR")
        ? await createFeedback(this.report.id as number, this.feedbackLocal)
        : await createFeedbackToModerator(
            this.report.id as number,
            user.username,
            this.feedbackLocal
          );
      if (_res.data) {
        const _feedback = _res.data.data;
        this.feedbacks.push(_feedback);
        this.feedbackLocal.message = "";
      }
    }
  }

  seeMore() {
    if (this.options.page < this.serverSideOptions.totalPages)
      this.options.page++;
  }

  @Watch("options", { immediate: true, deep: true })
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getFeedbacksByReport(this.getRouterId, {
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _feedbacks = _res.data.data as IFeedback[];
        this.feedbacks = [..._feedbacks, ...this.feedbacks];
        this.serverSideOptions.totalPages = _res.data.totalPages;
      }
      this.loading = false;
    }
  }

  get getRouterId() {
    const reportId = this.$route.params.id;
    if (reportId) return parseInt(reportId);
    else return -1;
  }

  async mounted() {
    const _res = await getReport(this.getRouterId);
    if (_res.data) {
      const _report = _res.data;
      this.report = _report;
      this.feedbackLocal.recipient = _report.sender.username;
    }
  }

  openConfirmDialog(status: string) {
    this.status = status;
    this.dialogConfirm = true;
  }
}
</script>
