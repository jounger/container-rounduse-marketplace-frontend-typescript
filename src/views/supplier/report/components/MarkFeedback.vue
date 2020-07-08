<template>
  <v-dialog v-model="dialogMarkSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Chấm điểm Feedback</span>
          <v-btn
            icon
            dark
            @click="dialogMarkSync = false"
            style="margin-left:288px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Số điểm bạn chấm là:"
                name="satisfactionPoints"
                prepend-icon="filter_vintage"
                type="number"
                :rules="[required('satisfactionPoints')]"
                v-model="feedbackLocal.satisfactionPoints"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogMarkSync = false">Trở về</v-btn>
        <v-btn @click="markFeedback()" color="primary" :disabled="!valid"
          >Chấm điểm</v-btn
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
export default class MarkFeedback extends Vue {
  @PropSync("dialogMark", { type: Boolean }) dialogMarkSync!: boolean;
  @PropSync("feedbacks", { type: Array }) feedbacksSync!: Array<IFeedback>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @Prop(Object) feedback!: IFeedback;
  @Prop(Boolean) update!: boolean;

  feedbackLocal = {} as IFeedback;
  valid = false;
  created() {
    this.feedbackLocal = Object.assign({}, this.feedback);
  }
  markFeedback() {
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
        "Chấm điểm thành công Phản hồi: " + this.feedbackLocal.id;
      const index = this.feedbacksSync.findIndex(
        x => x.id == this.feedbackLocal.id
      );
      this.feedbacksSync.splice(index, 1, this.feedbackLocal);

      this.snackbarSync = true;
    }
  }
}
</script>
