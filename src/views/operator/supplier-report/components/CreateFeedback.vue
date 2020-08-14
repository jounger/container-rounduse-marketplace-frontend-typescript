<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhật Phản hồi" : "Thêm mới Phản hồi"
          }}</span></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Gửi tới*"
                name="sender"
                prepend-icon="person"
                type="text"
                readonly
                v-model="report.sender"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea
                outlined
                label="Nội dung*"
                name="message"
                prepend-icon="description"
                type="text"
                :counter="200"
                :rules="[
                  minLength('Nội dung feedback', 5),
                  maxLength('Nội dung feedback', 200)
                ]"
                v-model="feedbackLocal.message"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn
          @click="updateFeedback()"
          color="primary"
          v-if="update"
          :disabled="!valid"
          >Cập nhật</v-btn
        >
        <v-btn
          @click="createFeedback()"
          color="primary"
          v-else
          :disabled="!valid"
          >Thêm mới</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IFeedback } from "@/entity/feedback";
import FormValidate from "@/mixin/form-validate";
import {
  createFeedback,
  editFeedback,
  createFeedbackToModerator
} from "@/api/feedback";
import { IReport } from "@/entity/report";

@Component({
  mixins: [FormValidate]
})
export default class CreateFeedback extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("feedbacks", { type: Array }) feedbacksSync!: Array<IFeedback>;
  @Prop(Object) feedback!: IFeedback;
  @Prop(Object) report!: IReport;
  @Prop(Boolean) update!: boolean;
  @Prop(String) receiver?: string;

  valid = false;
  feedbackLocal = {
    sender: this.$auth.user().username,
    message: "",
    satisfactionPoints: 0
  } as IFeedback;

  created() {
    if (this.update) {
      this.feedbackLocal = Object.assign({}, this.feedback);
    }
  }

  async createFeedback() {
    if (this.feedbackLocal && this.report.id) {
      if (this.$auth.check("ROLE_MODERATOR")) {
        const _res = await createFeedback(this.report.id, this.feedbackLocal);
        if (_res.data) {
          const _feedback = _res.data.data;
          this.feedbacksSync.push(_feedback);
          this.dialogAddSync = false;
        }
      } else {
        if (this.receiver) {
          const _res = await createFeedbackToModerator(
            this.report.id,
            this.receiver,
            this.feedbackLocal
          );
          if (_res.data) {
            const _feedback = _res.data.data;
            this.feedbacksSync.push(_feedback);
            this.dialogAddSync = false;
          }
        }
      }
    }
  }

  async updateFeedback() {
    if (this.feedbackLocal.id) {
      const _res = await editFeedback(
        this.feedbackLocal.id,
        this.feedbackLocal
      );
      if (_res.data) {
        const _feedback = _res.data.data;
        const index = this.feedbacksSync.findIndex(x => x.id == _feedback.id);
        this.feedbacksSync.splice(index, 1, _feedback);
      }
    }
  }
}
</script>
