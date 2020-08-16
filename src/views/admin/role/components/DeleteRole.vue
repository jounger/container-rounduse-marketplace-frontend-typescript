<template>
  <v-dialog v-model="dialogDelSync" max-width="400px">
    <v-card>
      <v-card-title class="headline">Xóa vai trò</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span>Bạn có chắc chắn muốn Xóa vai trò này?</span>
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ role.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogDelSync = false">Trở về</v-btn>
        <v-btn @click="removeRole()" color="error">Xóa bỏ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IRole } from "@/entity/role";
import { removeRole } from "@/api/role";

@Component
export default class DeleteRole extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("roles", { type: Array }) rolesSync!: Array<IRole>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) role!: IRole;

  async removeRole() {
    if (this.role.id) {
      const _res = await removeRole(this.role.id);
      if (_res) {
        const index = this.rolesSync.findIndex(x => x.id === this.role.id);
        this.rolesSync.splice(index, 1);
        this.totalItemsSync -= 1;
        this.dialogDelSync = false;
      }
    }
  }
}
</script>
