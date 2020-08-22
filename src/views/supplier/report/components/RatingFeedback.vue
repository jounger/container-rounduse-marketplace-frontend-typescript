<template>
  <v-dialog v-model="dialogRatingSync" width="400">
    <v-card>
      <v-card-title class="headline">
        Đánh giá phản hồi
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <div class="text-center mt-12">
          <v-rating
            v-model="feedbackLocal.satisfactionPoints"
            color="yellow darken-3"
            background-color="grey darken-1"
            empty-icon="$ratingFull"
            hover
          ></v-rating>
        </div>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="resetRating">Trở về</v-btn>
        <v-btn
          @click="ratingFeedback()"
          color="primary"
          :disabled="!feedbackLocal.satisfactionPoints"
          >Đánh giá</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { IFeedback } from "@/entity/feedback";
import { editFeedback } from "@/api/feedback";

@Component
export default class RatingFeedback extends Vue {
  @PropSync("dialogRating", { type: Boolean }) dialogRatingSync!: boolean;
  @PropSync("feedbacks", { type: Array }) feedbacksSync!: Array<IFeedback>;
  @PropSync("feedback", { type: Object }) feedbackSync!: IFeedback;

  feedbackLocal = null as IFeedback | null;

  created() {
    this.feedbackLocal = Object.assign({}, this.feedbackSync);
    console.log(this.feedbackLocal);
  }

  resetRating() {
    this.dialogRatingSync = false;
    this.feedbackSync.satisfactionPoints = 0;
  }

  async ratingFeedback() {
    if (this.feedbackLocal) {
      const _res = await editFeedback(this.feedbackLocal.id as number, {
        satisfactionPoints: this.feedbackLocal.satisfactionPoints
      });
      if (_res.data) {
        const _feedback = _res.data.data;
        const index = this.feedbacksSync.findIndex(x => x.id == _feedback.id);
        this.feedbacksSync.splice(index, 1, _feedback);
        this.dialogRatingSync = false;
      }
    }
  }

  beforeDestroy() {
    this.feedbackSync.satisfactionPoints = 0;
  }
}
</script>
