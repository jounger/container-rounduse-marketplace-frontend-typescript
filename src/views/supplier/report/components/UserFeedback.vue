<template>
  <v-list-item three-line class="px-0">
    <MarkFeedback
      v-if="dialogMark"
      :dialogMark.sync="dialogMark"
      :feedback="feedback"
      :feedbacks.sync="feedbacksSync"
    />
    <DeleteFeedback
      v-if="dialogDel"
      :dialogDel.sync="dialogDel"
      :feedback="feedback"
      :feedbacks.sync="feedbacksSync"
    />
    <v-list-item-avatar v-if="!edit">
      <v-img src="@/assets/images/ava.jpg" />
    </v-list-item-avatar>
    <v-list-item-content style="margin-top: 10px;" v-if="!edit">
      <v-list-item-title style="font-weight:bold;">{{
        fullname
      }}</v-list-item-title>
      <v-list-item-subtitle>
        <span
          style="color: black;"
          v-if="feedbackLocal.recipient != report.sender"
          >@{{ recipient }}</span
        >
        {{ feedbackLocal.message
        }}<v-menu
          :close-on-click="true"
          v-if="report.status == 'PENDING' || report.status == 'UPDATED'"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              text
              small
              v-bind="attrs"
              v-on="on"
              v-if="feedbackLocal.sender == $auth.user().username"
            >
              <span class="mb-3">...</span>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              @click="editFeedback()"
              v-if="feedbackLocal.sender == $auth.user().username"
            >
              <v-list-item-icon>
                <v-icon small>edit</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Chỉnh sửa</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              @click="openDeleteDialog()"
              v-if="feedbackLocal.sender == $auth.user().username"
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
          v-if="
            feedbackLocal.sender != $auth.user().username &&
              $auth.user().roles[0] == 'ROLE_FORWARDER'
          "
          @click="openMarkDialog()"
          >Đánh giá .</a
        >
        <a
          style="margin-left:10px;"
          v-if="
            report.status != 'REJECTED' &&
              report.status != 'CLOSED' &&
              feedbackLocal.sender != $auth.user().username &&
              $auth.user().roles[0] == 'ROLE_FORWARDER'
          "
          @click="replyFeedback()"
          >Phản hồi .</a
        ><a
          v-if="
            report.status != 'REJECTED' &&
              report.status != 'CLOSED' &&
              (feedbackLocal.sender == $auth.user().username ||
                $auth.user().roles[0] == 'ROLE_MODERATOR')
          "
          @click="replyFeedback()"
          >Phản hồi .</a
        >
        {{ convertTime(item.sendDate) }}
      </v-list-item-subtitle>
    </v-list-item-content>
    <v-row style="margin-left:-2px;margin-right:2px;" v-if="edit">
      <v-col cols="12" md="1" style="margin-top: 30px;"
        ><v-avatar size="43"> <v-img src="@/assets/images/ava.jpg" /> </v-avatar
      ></v-col>
      <v-col cols="12" md="11">
        <span style="font-size: 14px; margin-left: 24px;">Phản hồi tới: </span
        ><span style="color: black; font-weight: bold;"
          >{{ updateRecipient
          }}<v-divider class="mx-4" inset vertical></v-divider
        ></span>
        <v-textarea
          v-model="message"
          outlined
          rounded
          auto-grow
          clearable
          row-height="24"
          rows="1"
          placeholder="Phản hồi ..."
          @keydown.enter.exact.prevent
          @keyup.enter.exact="updateFeedback"
          @keydown.enter.shift.exact="newline"
        ></v-textarea></v-col
    ></v-row>
  </v-list-item>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import Utils from "@/mixin/utils";
import { IFeedback } from "@/entity/feedback";
import { getOperatorByUsername } from "@/api/operator";
import { IReport } from "@/entity/report";
import MarkFeedback from "./MarkFeedback.vue";
import DeleteFeedback from "../../../operator/supplier-report/components/DeleteFeedback.vue";
import { editFeedback } from "@/api/feedback";
import { IOperator } from "@/entity/operator";

@Component({
  mixins: [Utils],
  components: {
    DeleteFeedback,
    MarkFeedback
  }
})
export default class UserFeedback extends Vue {
  @PropSync("feedbacks", { type: Array }) feedbacksSync!: Array<IFeedback>;
  @PropSync("focus", { type: Boolean }) focusSync!: boolean;
  @PropSync("recipientLabel", { type: String }) recipientLabelSync!: string;
  @Prop(Object) report!: IReport;
  @Prop(String) forwarderFullname!: string;
  @Prop(Object) item!: IFeedback;
  @PropSync("feedbackRecipient", { type: String })
  feedbackRecipientSync!: string;
  @PropSync("showCreateFeedback", { type: Boolean })
  showCreateFeedbackSync!: boolean;

  message = "";
  fullname = "";
  recipient = "";
  updateRecipient = "";
  edit = false;
  update = false;
  dialogFeedback = false;
  dialogDel = false;
  dialogMark = false;
  feedback = null as IFeedback | null;
  feedbackLocal = {
    sender: this.$auth.user().username,
    recipient: "",
    message: "",
    satisfactionPoints: 0
  } as IFeedback;

  async created() {
    this.feedbackLocal = Object.assign({}, this.item);
    await this.getFullname();
  }

  async updateFeedback() {
    if (this.item.id) {
      const _res = await editFeedback(this.item.id, {
        message: this.message
      });
      if (_res.data) {
        const _feedback = _res.data;
        this.feedbackLocal = _feedback;
        this.edit = false;
      }
    }
  }

  async getFullname() {
    if (this.item.sender == this.report.sender) {
      this.fullname = this.forwarderFullname;
    } else {
      const _res = await getOperatorByUsername(this.item.sender);
      if (_res.data) {
        const _operator = _res.data as IOperator;
        this.fullname = _operator.fullname;
      }
    }
    if (this.item.recipient != this.report.sender) {
      const _res = await getOperatorByUsername(this.item.recipient);
      if (_res.data) {
        const _operator = _res.data as IOperator;
        this.recipient = _operator.fullname;
        this.updateRecipient = this.recipient;
      }
    } else {
      this.updateRecipient = this.forwarderFullname;
    }
  }

  replyFeedback() {
    this.feedbackRecipientSync = this.item.sender;
    this.recipientLabelSync = this.fullname;
    if (this.$auth.user().roles[0] == "ROLE_FORWARDER") {
      this.showCreateFeedbackSync = true;
    }
    this.focusSync = true;
  }

  editFeedback() {
    this.edit = true;
    this.message = this.item.message;
  }

  openDeleteDialog() {
    this.feedback = this.item;
    this.dialogDel = true;
  }

  openMarkDialog() {
    this.feedback = this.item;
    this.dialogMark = true;
  }
}
</script>
