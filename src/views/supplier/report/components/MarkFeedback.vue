<template>
  <v-dialog v-model="dialogMarkSync" width="400">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Chấm điểm Feedback</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <v-row justify="center" style="margin-top:20px;">
            <v-rating
              v-model="feedbackLocal.satisfactionPoints"
              color="yellow darken-3"
              background-color="grey darken-1"
              empty-icon="$ratingFull"
              half-increments
              hover
              :rules="[required('số sao đánh giá')]"
            ></v-rating>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 20px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogMarkSync = false">Trở về</v-btn>
        <v-btn @click="markFeedback()" color="primary" :disabled="!valid"
          >Đánh giá</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IFeedback } from "@/entity/feedback";
import FormValidate from "@/mixin/form-validate";
import { editFeedback } from "@/api/feedback";

@Component({
  mixins: [FormValidate]
})
export default class MarkFeedback extends Vue {
  @PropSync("dialogMark", { type: Boolean }) dialogMarkSync!: boolean;
  @PropSync("feedbacks", { type: Array }) feedbacksSync!: Array<IFeedback>;
  @Prop(Object) feedback!: IFeedback;

  feedbackLocal = {} as IFeedback;
  valid = false;
  created() {
    this.feedbackLocal = Object.assign({}, this.feedback);
  }
  async markFeedback() {
    if (this.feedbackLocal.id) {
      const _res = await editFeedback(this.feedbackLocal.id, {
        satisfactionPoints: this.feedbackLocal.satisfactionPoints
      });
      if (_res.data) {
        const _feedback = _res.data.data;
        const index = this.feedbacksSync.findIndex(x => x.id == _feedback.id);
        this.feedbacksSync.splice(index, 1, _feedback);
        this.dialogMarkSync = false;
      }
    }
  }
}
</script>
