<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhập Phản hồi" : "Thêm mới Phản hồi"
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
          >Cập nhập</v-btn
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
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";

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

  feedbackLocal = {
    sender: this.$auth.user().username,
    message: "",
    satisfactionPoints: 0
  } as IFeedback;
  valid = false;
  created() {
    console.log(this.report);
    console.log(this.receiver);
    if (this.update) {
      this.feedbackLocal = Object.assign({}, this.feedback);
    }
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
          this.feedbacksSync.push(_feedback);
          this.dialogAddSync = false;
        }
        snackbar.setDisplay(true);
      } else {
        if (this.receiver) {
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
            this.feedbacksSync.push(_feedback);
            this.dialogAddSync = false;
          }
          snackbar.setDisplay(true);
        }
      }
    }
  }
  async updateFeedback() {
    if (this.feedbackLocal.id) {
      const _feedback = await editFeedback(
        this.feedbackLocal.id,
        this.feedbackLocal
      )
        .then(res => {
          console.log(res.data);
          const response: IFeedback = res.data;
          snackbar.setSnackbar({
            text: "Cập nhật thành công Phản hồi: " + response.id,
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
        const index = this.feedbacksSync.findIndex(x => x.id == _feedback.id);
        this.feedbacksSync.splice(index, 1, _feedback);
      }
      snackbar.setDisplay(true);
    }
  }
}
</script>
