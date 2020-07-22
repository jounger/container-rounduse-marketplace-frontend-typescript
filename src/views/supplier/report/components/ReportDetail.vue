<template>
  <v-content>
    <v-row justify="center">
      <v-card class="mx-12 my-5" width="800">
        <v-row justify="center">
          <MarkFeedback
            v-if="dialogMark"
            :dialogMark.sync="dialogMark"
            :feedback="feedback"
            :feedbacks.sync="feedbacks"
          />
        </v-row>
        <v-row justify="center">
          <CreateFeedback
            v-if="dialogFeedback"
            :feedback="feedback"
            :feedbacks.sync="feedbacks"
            :dialogAdd.sync="dialogFeedback"
            :update="update"
            :report="report"
            :receiver="receiver"
          />
        </v-row>
        <v-row justify="center">
          <DeleteFeedback
            v-if="dialogDel"
            :dialogDel.sync="dialogDel"
            :feedback="feedback"
            :feedbacks.sync="feedbacks"
          />
        </v-row>
        <v-row justify="center">
          <ChangeStatusReport
            v-if="dialogConfirm"
            :dialogConfirm.sync="dialogConfirm"
            :report="report"
            :status="status"
            :reports.sync="reportsSync"
          />
        </v-row>

        <v-row>
          <v-col cols="12" sm="6" md="4">
            <v-list-item>
              <v-list-item-avatar>
                <v-img src="@/assets/images/ava.jpg" />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ report.sender }}</v-list-item-title>
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
                    <v-list-item @click="viewDetailReport(item)">
                      <v-list-item-icon>
                        <v-icon small>edit</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Xem HSMT</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item
                      @click="openCreateDialog(item)"
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
        <v-list dense nav>
          <v-list-item
            three-line
            class="px-0"
            v-for="item in feedbacks"
            :key="item.title"
          >
            <v-list-item-avatar>
              <v-img src="@/assets/images/ava.jpg" />
            </v-list-item-avatar>
            <v-list-item-content style="margin-top: 10px;">
              <v-list-item-title style="font-weight:bold;">{{
                item.sender
              }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ item.message
                }}<v-menu
                  :close-on-click="true"
                  v-if="
                    report.status == 'PENDING' || report.status == 'UPDATED'
                  "
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn text small v-bind="attrs" v-on="on">
                      <span class="mb-3">...</span>
                    </v-btn>
                  </template>
                  <v-list>
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
                </v-menu></v-list-item-subtitle
              >
              <v-list-item-subtitle>
                <a
                  v-if="item.sender != $auth.user().username"
                  @click="openMarkDialog(item)"
                  >Đánh giá .</a
                >
                <a
                  style="margin-left:10px;"
                  v-if="item.sender != $auth.user().username"
                  >Phản hồi</a
                ><a v-if="item.sender == $auth.user().username"
                  >Phản hồi</a
                ></v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-col cols="12" md="12">
          <v-textarea
            v-model="feedbackLocal.message"
            outlined
            rounded
            auto-grow
            clearable
            row-height="24"
            rows="1"
            placeholder="Viết feedback ..."
            @keydown.enter.exact.prevent
            @keyup.enter.exact="createFeedback"
            @keydown.enter.shift.exact="newline"
          ></v-textarea></v-col></v-card></v-row
  ></v-content>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import Utils from "@/mixin/utils";
import { IReport } from "@/entity/report";
import { IFeedback } from "@/entity/feedback";
import CreateFeedback from "../../../operator/supplier-report/components/CreateFeedback.vue";
import DeleteFeedback from "../../../operator/supplier-report/components/DeleteFeedback.vue";
import {
  getFeedbacksByReport,
  createFeedbackToModerator,
  createFeedback
} from "@/api/feedback";
import { PaginationResponse } from "@/api/payload";
import MarkFeedback from "./MarkFeedback.vue";
import ChangeStatusReport from "./ChangeStatusReport.vue";
import { IBiddingDocument } from "@/entity/bidding-document";
import { IOutbound } from "@/entity/outbound";
import { IBid } from "@/entity/bid";
import { IBooking } from "@/entity/booking";
import { getReport } from "@/api/report";
import snackbar from "@/store/modules/snackbar";
import { getErrorMessage } from "@/utils/tool";

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
  @PropSync("reports", { type: Array }) reportsSync!: Array<IReport>;

  feedbacks: Array<IFeedback> = [];
  report = {
    sender: "",
    report: {
      merchant: "",
      outbound: {
        goodsDescription: "",
        packingTime: "",
        packingStation: "",
        deliveryTime: "",
        grossWeight: 0,
        unitOfMeasurement: "",
        booking: {
          bookingNumber: "",
          unit: 0,
          cutOffTime: "",
          isFcl: false,
          portOfLoading: ""
        } as IBooking
      } as IOutbound,
      bids: [] as Array<IBid>,
      discount: "",
      isMultipleAward: false,
      bidOpening: "",
      bidClosing: "",
      dateOfDecision: "",
      currencyOfPayment: "",
      bidPackagePrice: 0,
      bidFloorPrice: 0,
      priceLeadership: 0,
      status: ""
    } as IBiddingDocument,
    title: "",
    detail: "",
    status: ""
  } as IReport;
  dialogFeedback = false;
  dialogDel = false;
  dialogMark = false;
  receiver = "";
  dialogConfirm = false;
  status = "";
  feedback = {} as IFeedback;
  update = false;
  openFeedback = false;
  feedbackLocal = {
    sender: this.$auth.user().username,
    message: "",
    satisfactionPoints: 0
  } as IFeedback;
  newline() {
    console.log(0);
    this.feedbackLocal.message = `${this.feedbackLocal.message}`;
  }
  async createFeedback() {
    if (this.feedbackLocal && this.report.id) {
      if (this.$auth.user().roles[0] == "ROLE_MODERATOR") {
        const _feedback = await createFeedback(
          this.report.id,
          this.feedbackLocal
        )
          .then(res => {
            const response: IFeedback = res.data;
            snackbar.setSnackbar({
              text: "Thêm mới thành công Phản hồi: " + response.id,
              color: "success"
            });
            return response;
          })
          .catch(err => {
            console.log(err);
            snackbar.setSnackbar({
              text: getErrorMessage(err),
              color: "error"
            });
            return null;
          });
        if (_feedback) {
          this.feedbacks.push(_feedback);
        }
        this.feedbackLocal = {
          sender: this.$auth.user().username,
          message: "",
          satisfactionPoints: 0
        } as IFeedback;
        snackbar.setDisplay(true);
      } else {
        const _feedback = await createFeedbackToModerator(
          this.report.id,
          this.receiver,
          this.feedbackLocal
        )
          .then(res => {
            const response: IFeedback = res.data;
            snackbar.setSnackbar({
              text: "Thêm mới thành công Phản hồi: " + response.id,
              color: "success"
            });
            return response;
          })
          .catch(err => {
            console.log(err);
            snackbar.setSnackbar({
              text: getErrorMessage(err),
              color: "error"
            });
            return null;
          });
        if (_feedback) {
          this.feedbacks.push(_feedback);
        }
        this.feedbackLocal = {
          sender: this.$auth.user().username,
          message: "",
          satisfactionPoints: 0
        } as IFeedback;
        snackbar.setDisplay(true);
      }
    }
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
    }
    const _feedbacks = await getFeedbacksByReport(parseInt(this.getRouterId), {
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IFeedback> = res.data;
        return response;
      })
      .catch(err => {
        console.log(err);
        return null;
      });
    if (_feedbacks) {
      this.feedbacks = _feedbacks.data;
    }
  }
  openCreateDialog(item: IFeedback) {
    console.log("feedback", item);
    this.receiver = item.sender;
    this.update = false;
    this.feedback = {} as IFeedback;
    this.dialogFeedback = true;
  }
  openCreateFeedbackDialog() {
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
  openConfirmDialog(status: string) {
    this.status = status;
    this.dialogConfirm = true;
  }
  viewDetailBiddingDocument() {
    this.$router.push({ path: `/bidding-document/${this.report.report}` });
  }
}
</script>
