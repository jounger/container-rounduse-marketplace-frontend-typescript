<template>
  <v-dialog v-model="dialogDelSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa rơ moóc</span>
          <v-btn
            icon
            dark
            @click="dialogDelSync = false"
            style="margin-left:383px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn xóa rơ moóc này?</span
            >
            <div class="line"></div>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{
                    trailer.licensePlate
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogDelSync = false">Hủy</v-btn>
        <v-btn @click="removeTrailer()" color="red">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IContainerSemiTrailer } from "@/entity/container-semi-trailer";

@Component
export default class DeleteTrailer extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("trailers", { type: Array }) trailersSync!: Array<
    IContainerSemiTrailer
  >;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) trailer!: IContainerSemiTrailer;

  removeTrailer() {
    if (this.trailer.id) {
      // removeTrailer(this.trailer.id)
      //   .then(res => {
      //     console.log(res.data);
      //     this.messageSync = "Xóa thành công vai trò: " + this.trailer.name;
      //     const index = this.trailersSync.findIndex(
      //       x => x.id === this.trailer.id
      //     );
      //     this.trailersSync.splice(index, 1);
      //     this.totalItemsSync -= 1;
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     this.messageSync = "Error happend";
      //   })
      //   .finally(
      //     () => ((this.snackbarSync = true), (this.dialogDelSync = false))
      //   );
      this.messageSync = "Xóa thành công vai trò: " + this.trailer.licensePlate;
      const index = this.trailersSync.findIndex(x => x.id === this.trailer.id);
      this.trailersSync.splice(index, 1);
      this.totalItemsSync -= 1;
      this.snackbarSync = true;
      this.dialogDelSync = false;
    }
  }
}
</script>
