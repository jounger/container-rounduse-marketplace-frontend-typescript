<template>
  <v-dialog v-model="dialogDelSync" max-width="400px">
    <v-card>
      <v-card-title class="headline">Xóa đặc quyền</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span>Bạn có chắc chắn muốn xóa đặc quyền này?</span>
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ permission.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogDelSync = false">Trở về</v-btn>
        <v-btn @click="removePermission()" color="error">Xóa bỏ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IPermission } from "@/entity/permission";
import { removePermission } from "@/api/permission";

@Component
export default class DeletePermission extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("permissions", { type: Array }) permissionsSync!: IPermission[];
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) permission!: IPermission;

  async removePermission() {
    const _res = await removePermission(this.permission.id as number);
    if (_res.data) {
      // const _permission = _res.data.data;
      const index = this.permissionsSync.findIndex(
        x => x.id === this.permission.id
      );
      this.permissionsSync.splice(index, 1);
      this.totalItemsSync -= 1;
      this.dialogDelSync = false;
    }
  }
}
</script>
