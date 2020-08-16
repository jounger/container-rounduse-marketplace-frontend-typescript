<template>
  <v-dialog v-model="dialogDelSync" max-width="400px">
    <v-card>
      <v-card-title class="headline">Xóa loại Container</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span>Bạn có chắc chắn muốn xóa loại Container này?</span>
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{
                    containerType.name
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogDelSync = false">Trở về</v-btn>
        <v-btn @click="removeContainerType()" color="error">Xóa bỏ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IContainerType } from "@/entity/container-type";
import { removeContainerType } from "@/api/container-type";

@Component
export default class DeleteContainerType extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("containerTypes", { type: Array })
  containerTypesSync!: IContainerType[];
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) containerType!: IContainerType;

  async removeContainerType() {
    if (this.containerType.id) {
      const _res = await removeContainerType(this.containerType.id);
      if (_res.status == 200) {
        const index = this.containerTypesSync.findIndex(
          x => x.id === this.containerType.id
        );
        this.containerTypesSync.splice(index, 1);
        this.totalItemsSync -= 1;
        this.dialogDelSync = false;
      }
    }
  }
}
</script>
