<template>
  <v-dialog v-model="dialogDelSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa đầu kéo</span>
          <v-btn
            icon
            dark
            @click="dialogDelSync = false"
            style="margin-left:387px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn xóa phản hồi này?</span
            >
            <div class="line"></div>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ feedback.id }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogDelSync = false">Hủy</v-btn>
        <v-btn @click="removeFeedback()" color="red">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IFeedback } from "@/entity/feedback";

@Component
export default class DeleteFeedback extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("feedbacks", { type: Array }) feedbacksSync!: Array<IFeedback>;
  @Prop(Object) feedback!: IFeedback;

  removeFeedback() {
    if (this.feedback.id) {
      // removeFeedback(this.feedback.id)
      //   .then(res => {
      //     console.log(res.data);
      //     this.messageSync = "Xóa thành công vai trò: " + this.feedback.name;
      //     const index = this.feedbacksSync.findIndex(
      //       x => x.id === this.feedback.id
      //     );
      //     this.feedbacksSync.splice(index, 1);
      //     this.totalItemsSync -= 1;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     this.messageSync = "Error happend";
      //   })
      //   .finally(
      //     () => ((this.snackbarSync = true), (this.dialogDelSync = false))
      //   );
      this.messageSync = "Xóa thành công phản hồi: " + this.feedback.id;
      const index = this.feedbacksSync.findIndex(
        x => x.id === this.feedback.id
      );
      this.feedbacksSync.splice(index, 1);
      this.snackbarSync = true;
      this.dialogDelSync = false;
    }
  }
}
</script>
