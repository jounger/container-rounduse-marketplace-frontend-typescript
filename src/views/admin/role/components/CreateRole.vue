<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-card-title class="headline">{{
        update ? "Cập nhật Quyền" : "Thêm mới Quyền"
      }}</v-card-title>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                label="Tên vai trò*"
                name="name"
                prepend-icon="security"
                type="text"
                v-model="roleLocal.name"
                :disabled="update"
                :counter="20"
                :rules="[
                  minLength('Tên vai trò', 5),
                  maxLength('Tên vai trò', 20)
                ]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="11">
              <v-select
                v-model="roleLocal.permissions"
                :items="permissions"
                item-text="name"
                item-value="name"
                no-data-text="Danh sách vai trò rỗng."
                open-on-clear
                deletable-chips
                chips
                clearable
                label="Phân vai trò"
                multiple
                prepend-icon="enhanced_encryption"
              >
              </v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn
          @click="updateRole()"
          color="primary"
          v-if="update"
          :disabled="!valid"
          >Cập nhật</v-btn
        >
        <v-btn @click="createRole()" color="primary" v-else :disabled="!valid"
          >Thêm mới</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IRole } from "@/entity/role";
import { createRole, updateRole } from "@/api/role";
import { getPermissions } from "@/api/permission";
import { IPermission } from "@/entity/permission";
import FormValidate from "@/mixin/form-validate";

@Component({
  mixins: [FormValidate]
})
export default class CreateRole extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("roles", { type: Array }) rolesSync!: Array<IRole>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Boolean) update!: boolean;
  @Prop(Object) role!: IRole;

  permissions: Array<IPermission> = [];
  valid = false;
  roleLocal = {
    name: "",
    permissions: []
  } as IRole;

  async created() {
    if (this.update) {
      this.roleLocal = Object.assign({}, this.role);
    }
    const _res = await getPermissions({
      page: 0,
      limit: 100
    });
    if (_res.data) {
      const _permissions = _res.data.data;
      this.permissions = _permissions;
    }
  }

  async remove(item: string) {
    const permissions = this.roleLocal.permissions.filter(x => x != item);
    this.roleLocal.permissions = permissions;
  }

  async createRole() {
    if (this.roleLocal) {
      const _res = await createRole(this.roleLocal);
      if (_res.data) {
        const _role = _res.data.data;
        this.rolesSync.unshift(_role);
        this.totalItemsSync += 1;
        this.dialogAddSync = false;
      }
    }
  }
  async updateRole() {
    if (this.roleLocal.id) {
      const _res = await updateRole(this.roleLocal);
      if (_res.data) {
        const _role = _res.data.data;
        const index = this.rolesSync.findIndex(x => x.id == _role.id);
        this.rolesSync.splice(index, 1, _role);
      }
    }
  }
}
</script>
