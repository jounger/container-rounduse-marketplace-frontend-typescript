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
    <v-list-item-avatar>
      <v-img src="@/assets/images/ava.jpg" />
    </v-list-item-avatar>
    <v-list-item-content style="margin-top: 10px;">
      <v-list-item-title style="font-weight:bold;">{{
        fullname
      }}</v-list-item-title>
      <v-list-item-subtitle>
        <span style="color: black;" v-if="item.recipient != report.sender"
          >@{{ recipient }}</span
        >
        {{ item.message
        }}<v-menu
          :close-on-click="true"
          v-if="report.status == 'PENDING' || report.status == 'UPDATED'"
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
          v-if="
            item.sender != $auth.user().username &&
              $auth.user().roles[0] == 'ROLE_FORWARDER'
          "
          @click="openMarkDialog(item)"
          >Đánh giá .</a
        >
        <a
          style="margin-left:10px;"
          v-if="
            report.status != 'REJECTED' &&
              report.status != 'CLOSED' &&
              item.sender != $auth.user().username &&
              $auth.user().roles[0] == 'ROLE_FORWARDER'
          "
          @click="replyFeedback()"
          >Phản hồi .</a
        ><a
          v-if="
            report.status != 'REJECTED' &&
              report.status != 'CLOSED' &&
              (item.sender == $auth.user().username ||
                $auth.user().roles[0] == 'ROLE_MODERATOR')
          "
          @click="replyFeedback()"
          >Phản hồi .</a
        >
        {{ convertTime(item.sendDate) }}
      </v-list-item-subtitle>
    </v-list-item-content>
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

@Component({
  mixins: [Utils],
  components: {
    DeleteFeedback,
    MarkFeedback
  }
})
export default class UserFeedback extends Vue {
  @Prop(Object) item!: IFeedback;
  @Prop(Object) report!: IReport;
  @Prop(String) forwarderFullname!: string;
  @PropSync("feedbacks", { type: Array }) feedbacksSync!: Array<IFeedback>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("feedbackItem", { type: Object }) feedbackItemSync!: IFeedback;
  @PropSync("showCreateFeedback", { type: Boolean })
  showCreateFeedbackSync!: boolean;
  fullname = "";
  recipient = "";
  update = false;
  dialogFeedback = false;
  dialogDel = false;
  dialogMark = false;
  feedback = null as IFeedback | null;

  async created() {
    await this.getFullname();
  }
  async getFullname() {
    if (this.item.sender == this.report.sender) {
      this.fullname = this.forwarderFullname;
    } else {
      const _fullname = await getOperatorByUsername(this.item.sender)
        .then(res => {
          const response = res.data;
          return response.fullname;
        })
        .catch(err => {
          console.log(err);
          return null;
        });
      if (_fullname) {
        this.fullname = _fullname;
      }
    }
    if (this.item.recipient != this.report.sender) {
      const _fullname = await getOperatorByUsername(this.item.recipient)
        .then(res => {
          const response = res.data;
          return response.fullname;
        })
        .catch(err => {
          console.log(err);
          return null;
        });
      if (_fullname) {
        this.recipient = _fullname;
      }
    }
  }
  replyFeedback() {
    console.log(1);
    this.feedbackItemSync.recipient = this.item.sender;
    if (this.$auth.user().roles[0] == "ROLE_FORWARDER") {
      this.showCreateFeedbackSync = true;
    }
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
}
</script>
