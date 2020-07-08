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
            style="margin-left:337px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Người gửi*"
                name="sender"
                prepend-icon="enhanced_encryption"
                type="text"
                readonly
                :counter="20"
                :rules="[minLength('sender', 5), maxLength('sender', 20)]"
                v-model="feedbackLocal.sender"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Nội dung*"
                name="message"
                prepend-icon="enhanced_encryption"
                type="text"
                :counter="20"
                :rules="[minLength('message', 5), maxLength('message', 20)]"
                v-model="feedbackLocal.message"
              ></v-text-field>
            </v-flex>
          </v-layout>
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
    if (this.feedbackLocal) {
      // createFeedback(this.feedbackLocal)
      //   .then(res => {
      //     const response: IFeedback = res.data;
      //     this.messageSync = "Thêm mới thành công Phản hồi: " + response.id;
      //     this.feedbacksSync.unshift(response);
      //     this.totalItemsSync += 1;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     this.messageSync = "Đã có lỗi xảy ra";
      //   })
      //   .finally(() => (this.snackbarSync = true));
      this.feedbackLocal.id = 1;
      this.messageSync =
        "Thêm mới thành công Phản hồi: " + this.feedbackLocal.id;
      this.feedbacksSync.unshift(this.feedbackLocal);

      this.snackbarSync = true;
    }
  }
  updateFeedback() {
    if (this.feedbackLocal.id) {
      // updateFeedback(this.feedbackLocal)
      //   .then(res => {
      //     console.log(res.data);
      //     const response: IFeedback = res.data;
      //     this.messageSync = "Cập nhập thành công Phản hồi: " + response.id;
      //     const index = this.feedbacksSync.findIndex(x => x.id == response.id);
      //     this.feedbacksSync.splice(index, 1, response);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     this.messageSync = "Đã có lỗi xảy ra";
      //   })
      //   .finally(() => (this.snackbarSync = true));
      this.messageSync =
        "Cập nhập thành công Phản hồi: " + this.feedbackLocal.id;
      const index = this.feedbacksSync.findIndex(
        x => x.id == this.feedbackLocal.id
      );
      this.feedbacksSync.splice(index, 1, this.feedbackLocal);

      this.snackbarSync = true;
    }
  }
}
</script>
