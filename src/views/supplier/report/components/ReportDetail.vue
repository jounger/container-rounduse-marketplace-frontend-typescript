<template>
  <v-card class="order-1 flex-grow-1 mx-auto my-1">
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
    <v-toolbar color="primary" light flat>
      <v-toolbar-title
        ><span class="headline" style="color:white;">Chi tiết Report</span>
      </v-toolbar-title>
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
                <v-list-item-subtitle>{{ report.sender }}</v-list-item-subtitle>
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
                  report.report.id
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
                <v-list-item-title>Trạng thái</v-list-item-title>
                <v-list-item-subtitle>{{ report.status }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card-text>

    <v-divider class="mx-1"></v-divider>

    <v-card-title
      >{{ report.title }}
      <v-spacer></v-spacer>
      <v-btn
        style="margin-top: 10px!important;"
        class="ma-1"
        tile
        outlined
        color="success"
        @click.stop="openConfirmDialog('REJECTED')"
        small
        v-if="
          $auth.user().roles[0] == 'ROLE_MODERATOR' &&
            (report.status == 'PENDING' || report.status == 'UPDATED')
        "
      >
        <v-icon left>mdi-pencil</v-icon> Từ chối
      </v-btn>
      <v-btn
        style="margin-top: 10px!important;"
        class="ma-1"
        tile
        outlined
        color="success"
        @click.stop="openConfirmDialog('CLOSED')"
        small
        v-if="
          $auth.user().roles[0] == 'ROLE_MODERATOR' &&
            report.status == 'RESOLVED'
        "
      >
        <v-icon left>mdi-pencil</v-icon> Đóng Report
      </v-btn>
      <v-btn
        style="margin-top: 10px!important;"
        class="ma-1"
        tile
        outlined
        color="success"
        @click.stop="openConfirmDialog('RESOLVED')"
        small
        v-if="
          $auth.user().roles[0] == 'ROLE_FORWARDER' &&
            (report.status == 'PENDING' || report.status == 'UPDATED')
        "
      >
        <v-icon left>mdi-pencil</v-icon> Đóng Report
      </v-btn>
    </v-card-title>
    <v-col cols="12" md="12">
      <v-textarea
        outlined
        name="detail"
        label="Chi tiết"
        :value="report.detail"
        hint="Nội dung Report"
        readonly
      ></v-textarea>
    </v-col>
    <v-list dense>
      <v-list-item v-for="item in feedbacks" :key="item.title">
        <v-list-item-icon>
          <v-icon>{{
            item.sender == $auth.user().username &&
            $auth.user().roles[0] == "ROLE_FORWARDER"
              ? "person"
              : "verified_user"
          }}</v-icon>
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
            <v-list-item
              v-if="item.sender != $auth.user().username"
              @click="openMarkDialog(item)"
            >
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
      style="margin-left: 15px;
    margin-bottom: 15px;"
      v-if="
        feedbacks.length == 0 &&
          $auth.user().roles[0] == 'ROLE_MODERATOR' &&
          (report.status == 'PENDING' || report.status == 'UPDATED')
      "
      @click="openCreateFeedbackDialog()"
      class="primary"
      >Phản hồi</v-btn
    >
  </v-card>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import Utils from "@/mixin/utils";
import { IReport } from "@/entity/report";
import { IFeedback } from "@/entity/feedback";
import CreateFeedback from "../../../operator/supplier-report/components/CreateFeedback.vue";
import DeleteFeedback from "../../../operator/supplier-report/components/DeleteFeedback.vue";
import { getFeedbacksByReport } from "@/api/feedback";
import { PaginationResponse } from "@/api/payload";
import MarkFeedback from "./MarkFeedback.vue";
import ChangeStatusReport from "./ChangeStatusReport.vue";
import { IBiddingDocument } from "@/entity/bidding-document";
import { IOutbound } from "@/entity/outbound";
import { IBid } from "@/entity/bid";
import { IBooking } from "@/entity/booking";

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
  get getRouterId() {
    return this.$route.params.id;
  }
  async created() {
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
