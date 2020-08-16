<template>
  <v-dialog v-model="dialogDelSync" max-width="400px">
    <v-card>
      <v-card-title class="headline">Xóa rơ moóc</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span>Bạn có chắc chắn muốn xóa rơ moóc này?</span>
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
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogDelSync = false">Trở về</v-btn>
        <v-btn @click="removeTrailer()" color="error">Xóa bỏ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IContainerSemiTrailer } from "@/entity/container-semi-trailer";
import { removeContainerSemiTrailer } from "@/api/container-semi-trailer";

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
      const _res = await removeContainerSemiTrailer(this.trailer.id);
      if (_res.status == 200) {
        const index = this.trailersSync.findIndex(
          x => x.id === this.trailer.id
        );
        this.trailersSync.splice(index, 1);
        this.totalItemsSync -= 1;
        this.dialogDelSync = false;
      }
    }
  }
}
</script>
