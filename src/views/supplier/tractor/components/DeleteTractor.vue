<template>
  <v-dialog v-model="dialogDelSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa đầu kéo</span>
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn xóa đầu kéo này?</span
            >
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{
                    tractor.licensePlate
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogDelSync = false">Hủy</v-btn>
        <v-btn @click="removeTractor()" color="error">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IContainerTractor } from "@/entity/container-tractor";
import { removeContainerTractor } from "@/api/container-tractor";

@Component
export default class DeleteTractor extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("tractors", { type: Array }) tractorsSync!: IContainerTractor[];
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) tractor!: IContainerTractor;

  async removeTractor() {
    if (this.tractor.id) {
      const _res = await removeContainerTractor(this.tractor.id);
      if (_res.status == 200) {
        const index = this.tractorsSync.findIndex(
          x => x.id === this.tractor.id
        );
        this.tractorsSync.splice(index, 1);
        this.totalItemsSync -= 1;
        this.dialogDelSync = false;
      }
    }
  }
}
</script>
