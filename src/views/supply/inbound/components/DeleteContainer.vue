<template>
  <v-row justify="center">
    <v-dialog v-model="dialogDelContSync" max-width="600px">
      <v-card>
        <v-toolbar color="primary" light flat>
          <v-toolbar-title
            ><span class="headline" style="color:white;">Xóa Container</span>
          </v-toolbar-title>
        </v-toolbar>

        <v-card-text>
          <v-form>
            <v-container>
              <span style="color: black; font-size:22px;"
                >Bạn có chắc chắn muốn xóa Container này?</span
              >
              <v-divider class="mt-3"></v-divider>
              <v-list>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>{{
                      container.containerNumber
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions style="margin-left: 205px;">
          <v-btn @click="dialogDelContSync = false">Hủy</v-btn>
          <v-btn @click="removeContainer()" color="error">Xóa</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IContainer } from "@/entity/container";
import { removeContainer } from "@/api/container";

@Component
export default class DeleteContainer extends Vue {
  @PropSync("dialogDelCont", { type: Boolean }) dialogDelContSync!: boolean;
  @PropSync("containers", { type: Array }) containersSync!: Array<IContainer>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) container!: IContainer;

  async removeContainer() {
    // TODO
    if (this.container.id) {
      const _res = await removeContainer(this.container.id);
      if (_res.status == 200) {
        const index = this.containersSync.findIndex(
          x => x.id === this.container.id
        );
        this.containersSync.splice(index, 1);
        this.totalItemsSync -= 1;
        this.dialogDelContSync = false;
      }
    }
  }
}
</script>
