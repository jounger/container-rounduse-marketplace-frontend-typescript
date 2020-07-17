<template>
  <v-dialog v-model="dialogAddSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhập Phản hồi" : "Thêm mới Phản hồi"
          }}</span>
          <v-btn
            icon
            dark
            @click="dialogAddSync = false"
            style="margin-left:312px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                label="Người gửi*"
                name="sender"
                prepend-icon="person"
                type="text"
                readonly
                v-model="feedbackLocal.sender"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                label="Nội dung*"
                name="message"
                prepend-icon="description"
                type="text"
                :counter="200"
                :rules="[minLength('message', 5), maxLength('message', 200)]"
                v-model="feedbackLocal.message"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
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
import { createFeedback, editFeedback } from "@/api/feedback";
import { IReport } from "@/entity/report";
// import { createFeedback, updateFeedback } from "@/api/feedback";

@Component({
  mixins: [FormValidate]
})
export default class CreateFeedback extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("feedbacks", { type: Array }) feedbacksSync!: Array<IFeedback>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @Prop(Object) feedback!: IFeedback;
  @Prop(Object) report!: IReport;
  @Prop(Boolean) update!: boolean;

  feedbackLocal = {
    sender: this.$auth.user().username,
    message: "",
    satisfactionPoints: 0
  } as IFeedback;
  valid = false;
  created() {
    if (this.update) {
      this.feedbackLocal = Object.assign({}, this.feedback);
    }
  }
  createFeedback() {
    if (this.feedbackLocal && this.report.id) {
      createFeedback(this.report.id, this.feedbackLocal)
        .then(res => {
          const response: IFeedback = res.data;
          this.messageSync = "Thêm mới thành công Phản hồi: " + response.id;
          this.feedbacksSync.unshift(response);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  updateFeedback() {
    if (this.feedbackLocal.id) {
      editFeedback(this.feedbackLocal.id, this.feedbackLocal)
        .then(res => {
          console.log(res.data);
          const response: IFeedback = res.data;
          this.messageSync = "Cập nhập thành công Phản hồi: " + response.id;
          const index = this.feedbacksSync.findIndex(x => x.id == response.id);
          this.feedbacksSync.splice(index, 1, response);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
}
</script>
