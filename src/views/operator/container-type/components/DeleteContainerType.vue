<template>
  <v-dialog v-model="dialogDelSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa loại Container</span>
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn xóa loại Container này?</span
            >
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
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogDelSync = false">Hủy</v-btn>
        <v-btn @click="removeContainerType()" color="error">Xóa</v-btn>
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
    console.log(this.containerType);
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
