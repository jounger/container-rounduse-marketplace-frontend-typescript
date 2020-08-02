<template>
  <v-content>
    <v-row justify="center">
      <v-card class="mx-12 my-5" width="800" v-if="report">
        <v-row justify="center">
          <ChangeStatusReport
            v-if="dialogConfirm"
            :dialogConfirm.sync="dialogConfirm"
            :report.sync="report"
            :status="status"
          />
        </v-row>

        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-list-item>
              <v-list-item-avatar>
                <v-img src="@/assets/images/ava.jpg" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title
                  ><span style="font-weight:bold;">{{
                    forwarderFullname
                  }}</span></v-list-item-title
                >
                <v-list-item-subtitle>{{
                  convertTime(report.sendDate)
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title style="font-weight:bold;"
                >Tiêu đề
                <v-menu :close-on-click="true">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="pink"
                      icon
                      outlined
                      v-bind="attrs"
                      v-on="on"
                      class="ml-10"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="viewDetailBiddingDocument()">
                      <v-list-item-icon>
                        <v-icon small>edit</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Xem HSMT</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      @click="openConfirmDialog('REJECTED')"
                      v-if="
                        $auth.user().roles[0] == 'ROLE_MODERATOR' &&
                          (report.status == 'PENDING' ||
                            report.status == 'UPDATED')
                      "
                    >
                      <v-list-item-icon>
                        <v-icon small>close</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Từ chối</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      @click="openConfirmDialog('CLOSED')"
                      v-if="
                        $auth.user().roles[0] == 'ROLE_MODERATOR' &&
                          report.status == 'RESOLVED'
                      "
                    >
                      <v-list-item-icon>
                        <v-icon small>edit</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Đóng Report</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      @click="openConfirmDialog('RESOLVED')"
                      v-if="
                        $auth.user().roles[0] == 'ROLE_FORWARDER' &&
                          (report.status == 'PENDING' ||
                            report.status == 'UPDATED')
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
                </v-menu></v-list-item-title
              >
              <v-list-item-subtitle>{{ report.title }}</v-list-item-subtitle>
            </v-list-item-content> </v-list-item
          ><v-list-item>
            <v-list-item-content>
              <v-list-item-title style="font-weight:bold;"
                >Chi tiết</v-list-item-title
              >
              <v-list-item-subtitle>{{ report.detail }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-card-title>Phản hồi</v-card-title>
        <a
          style="margin-left: 20px;"
          @click="loadMoreFeedbacks()"
          v-if="seeMore"
          >Xem thêm Phản hồi</a
        >
        <v-list dense nav v-for="(item, index) in feedbacks" :key="index">
          <UserFeedback
            :item="item"
            :report="report"
            :forwarderFullname="forwarderFullname"
            :feedbacks.sync="feedbacks"
            :feedbackRecipient.sync="feedbackLocal.recipient"
            :showCreateFeedback.sync="showCreateFeedback"
            :recipientLabel.sync="recipient"
            :focus.sync="focus"
          />
        </v-list>
        <v-row
          style="margin-left:-2px;margin-right:2px;"
          v-if="
            report.status != 'REJECTED' &&
              report.status != 'CLOSED' &&
              ($auth.user().roles[0] == 'ROLE_MODERATOR' || showCreateFeedback)
          "
        >
          <v-col cols="12" md="1" style="margin-top: 30px;"
            ><v-avatar size="43">
              <v-img src="@/assets/images/ava.jpg" /> </v-avatar
          ></v-col>
          <v-col cols="12" md="11">
            <span style="font-size: 14px; margin-left: 24px;"
              >Phản hồi tới: </span
            ><span style="color: black; font-weight: bold;">{{
              recipient
            }}</span
            ><v-divider class="mx-4" inset vertical></v-divider
            ><a
              style="font-size: 14px;color: green;font-weight: bold;"
              @click="recipient = forwarderFullname"
              >Mặc định</a
            >
            <v-textarea
              v-model="feedbackLocal.message"
              :autofocus="focus"
              outlined
              rounded
              auto-grow
              clearable
              row-height="24"
              rows="1"
              placeholder="Phản hồi ..."
              @keydown.enter.exact.prevent
              @keyup.enter.exact="createFeedback"
              @keydown.enter.shift.exact="newline"
            ></v-textarea></v-col></v-row></v-card></v-row
  ></v-content>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Utils from "@/mixin/utils";
import { IReport } from "@/entity/report";
import { IFeedback } from "@/entity/feedback";
import {
  getFeedbacksByReport,
  createFeedbackToModerator,
  createFeedback
} from "@/api/feedback";
import { PaginationResponse } from "@/api/payload";
import ChangeStatusReport from "./ChangeStatusReport.vue";
import { IBiddingDocument } from "@/entity/bidding-document";
import { getReport } from "@/api/report";
import { getSupplier } from "@/api/supplier";
import UserFeedback from "./UserFeedback.vue";

@Component({
  mixins: [Utils],
  components: {
    UserFeedback,
    ChangeStatusReport
  }
})
export default class ReportDetail extends Vue {
  focus = false;
  seeMore = true;
  recipient = "";
  showCreateFeedback = false;
  forwarderFullname = "";
  feedbacks: Array<IFeedback> = [];
  report = null as IReport | null;
  limit = 5;
  dialogConfirm = false;
  status = "";
  openFeedback = false;
  feedbackLocal = {
    sender: this.$auth.user().username,
    recipient: "",
    message: "",
    satisfactionPoints: 0
  } as IFeedback;

  newline() {
    console.log(0);
    this.feedbackLocal.message = `${this.feedbackLocal.message}`;
  }
  async getFullname(username: string) {
    const _fullname = await getSupplier(username)
      .then(res => {
        const response = res.data;
        return response.contactPerson;
      })
      .catch(err => {
        console.log(err);
        return null;
      });
    if (_fullname) {
      return _fullname;
    }
  }
  async createFeedback() {
    if (
      this.feedbackLocal &&
      this.report &&
      this.report.id &&
      this.feedbackLocal.message != ""
    ) {
      if (this.$auth.user().roles[0] == "ROLE_MODERATOR") {
        if (this.feedbackLocal.recipient == "") {
          this.feedbackLocal.recipient = this.report.sender;
        }
        const _feedback = await createFeedback(
          this.report.id,
          this.feedbackLocal
        )
          .then(res => {
            const response: IFeedback = res.data;
            return response;
          })
          .catch(err => {
            console.log(err);
            return null;
          });
        if (_feedback) {
          this.feedbacks.push(_feedback);
          this.recipient = this.forwarderFullname;
          console.log(_feedback);
        }
        this.feedbackLocal = {
          sender: this.$auth.user().username,
          message: "",
          satisfactionPoints: 0
        } as IFeedback;
      } else {
        const _feedback = await createFeedbackToModerator(
          this.report.id,
          this.feedbackLocal.recipient,
          this.feedbackLocal
        )
          .then(res => {
            const response: IFeedback = res.data;
            return response;
          })
          .catch(err => {
            console.log(err);
            return null;
          });
        if (_feedback) {
          this.feedbacks.push(_feedback);
          console.log(_feedback);
        }
        this.feedbackLocal = {
          sender: this.$auth.user().username,
          message: "",
          satisfactionPoints: 0
        } as IFeedback;
      }
    }
  }
  async getFeedbacks(limit: number) {
    this.feedbacks = [] as Array<IFeedback>;
    const _feedbacks = await getFeedbacksByReport(parseInt(this.getRouterId), {
      page: 0,
      limit: limit + 1
    })
      .then(res => {
        const response: PaginationResponse<IFeedback> = res.data;
        return response.data;
      })
      .catch(err => {
        console.log(err);
        return null;
      });
    if (_feedbacks) {
      _feedbacks.forEach((x: IFeedback, index: number) => {
        if (index != limit) {
          this.feedbacks.unshift(x);
        }
      });
    }
    if (!_feedbacks || _feedbacks.length <= limit) {
      this.seeMore = false;
    }
  }
  async loadMoreFeedbacks() {
    this.limit += 5;
    await this.getFeedbacks(this.limit);
  }
  get getRouterId() {
    return this.$route.params.id;
  }
  async created() {
    const _report = await getReport(parseInt(this.getRouterId))
      .then(res => {
        const response = res.data;
        return response;
      })
      .catch(err => {
        console.log(err);
        return null;
      });
    if (_report) {
      this.report = _report;
      this.forwarderFullname = await this.getFullname(_report.sender);
      this.recipient = this.forwarderFullname;
    }
    await this.getFeedbacks(5);
  }

  openConfirmDialog(status: string) {
    this.status = status;
    this.dialogConfirm = true;
  }
  viewDetailBiddingDocument() {
    if (
      this.report &&
      this.report &&
      this.report.report &&
      typeof this.report.report != "number"
    ) {
      const report = this.report.report as IBiddingDocument;
      this.$router.push({ path: `/report-bidding-document/${report.id}` });
    }
  }
}
</script>
