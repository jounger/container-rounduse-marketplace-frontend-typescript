<template>
  <v-dialog v-model="dialogDelSync" max-width="400px">
    <v-card>
      <v-card-title class="headline">Xóa phản hồi</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span>Bạn có chắc chắn muốn xóa phản hồi này?</span>
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ feedback.id }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogDelSync = false">Trở về</v-btn>
        <v-btn @click="removeFeedback()" color="error">Xóa bỏ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IFeedback } from "@/entity/feedback";
import { removeFeedback } from "@/api/feedback";

@Component
export default class DeleteFeedback extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("feedbacks", { type: Array }) feedbacksSync!: Array<IFeedback>;
  @Prop(Object) feedback!: IFeedback;

  async removeFeedback() {
    if (this.feedback.id) {
      const _res = await removeFeedback(this.feedback.id);
      if (_res.status == 200) {
        const index = this.feedbacksSync.findIndex(
          x => x.id === this.feedback.id
        );
        this.feedbacksSync.splice(index, 1);
        this.dialogDelSync = false;
      }
    }
  }
}
</script>
