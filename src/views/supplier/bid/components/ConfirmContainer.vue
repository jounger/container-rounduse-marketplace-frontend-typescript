<template>
  <v-dialog v-model="dialogConfirmSync" max-width="400">
    <v-card>
      <v-card-title class="headline">Xác nhận bỏ chọn Container</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span>Bạn có chắc chắn muốn bỏ chọn Container này?</span>
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ container.id }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogConfirmSync = false">Trở về</v-btn>
        <v-btn @click="confirmContainer()" color="error">Bỏ chọn</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IContainer } from "@/entity/container";
import { IBid } from "@/entity/bid";
import { removeContainer } from "@/api/bid";

@Component
export default class ConfirmContainer extends Vue {
  @PropSync("dialogConfirm", { type: Boolean }) dialogConfirmSync!: boolean;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @PropSync("containersSelected", { type: Array })
  containersSelectedSync!: Array<IContainer>;
  @PropSync("listContainersSelected", { type: Array })
  listContainersSelectedSync!: Array<IContainer>;
  @Prop(Object) container!: IContainer;
  @Prop(Object) bid!: IBid;

  async confirmContainer() {
    if (this.container.id && this.bid.id) {
      const _res = await removeContainer(this.bid.id, this.container.id);
      if (_res.data) {
        const _container = _res.data.data;
        const index = this.containersSelectedSync.findIndex(
          (x: IContainer) => x.id == _container.id
        );
        this.containersSelectedSync.splice(index, 1);
        const indexList = this.listContainersSelectedSync.findIndex(
          (x: IContainer) => x.id == _container.id
        );
        this.listContainersSelectedSync.splice(indexList, 1);
        this.totalItemsSync -= 1;
        this.dialogConfirmSync = false;
      }
    }
  }
}
</script>
