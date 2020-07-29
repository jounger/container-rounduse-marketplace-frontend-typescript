<template>
  <v-dialog v-model="dialogDelSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa rơ moóc</span>
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn xóa rơ moóc này?</span
            >
            <v-divider class="mt-3"></v-divider>
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
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogDelSync = false">Hủy</v-btn>
        <v-btn @click="removeTrailer()" color="error">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IContainerSemiTrailer } from "@/entity/container-semi-trailer";
import { removeContainerSemiTrailer } from "@/api/container-semi-trailer";
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";

@Component
export default class DeleteTrailer extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("trailers", { type: Array }) trailersSync!: Array<
    IContainerSemiTrailer
  >;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) trailer!: IContainerSemiTrailer;

  async removeTrailer() {
    if (this.trailer.id) {
      await removeContainerSemiTrailer(this.trailer.id)
        .then(res => {
          console.log(res.data);
          snackbar.setSnackbar({
            text: "Xóa thành công Rơ moóc: " + this.trailer.licensePlate,
            color: "success"
          });
          const index = this.trailersSync.findIndex(
            x => x.id === this.trailer.id
          );
          this.trailersSync.splice(index, 1);
          this.totalItemsSync -= 1;
          this.dialogDelSync = false;
        })
        .catch(err => {
          console.log(err);
          snackbar.setSnackbar({
            text: getErrorMessage(err),
            color: "error"
          });
        });
      snackbar.setDisplay(true);
    }
  }
}
</script>
