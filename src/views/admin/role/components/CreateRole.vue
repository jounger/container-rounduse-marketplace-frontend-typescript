<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhập Quyền" : "Thêm mới Quyền"
          }}</span></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-row>
            <v-col cols="12" md="10">
              <v-text-field
                label="Tên quyền*"
                name="name"
                prepend-icon="security"
                type="text"
                v-model="roleLocal.name"
                :readonly="update"
                :counter="20"
                :rules="[minLength('name', 5), maxLength('name', 20)]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="10">
              <v-select
                v-model="roleLocal.permissions"
                :items="permissionsToString"
                chips
                clearable
                label="Phân vai trò"
                multiple
                prepend-icon="enhanced_encryption"
              >
                <template v-slot:selection="{ attrs, item, select, selected }">
                  <v-chip
                    v-bind="attrs"
                    :input-value="selected"
                    close
                    @click="select"
                    @click:close="remove(item)"
                  >
                    {{ item }}
                  </v-chip>
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn
          @click="updateRole()"
          color="primary"
          v-if="update"
          :disabled="!valid"
          >Cập nhập</v-btn
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
import { PaginationResponse } from "@/api/payload";
import { getPermissions } from "@/api/permission";
import { IPermission } from "@/entity/permission";
import FormValidate from "@/mixin/form-validate";
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";

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
    const _permissions = await getPermissions({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IPermission> = res.data;
        return response.data;
      })
      .catch(err => console.log(err));
    this.permissions = _permissions || [];
  }
  get permissionsToString() {
    return this.permissions.map(x => x.name);
  }
  async remove(item: string) {
    const permissions = this.roleLocal.permissions.filter(x => x != item);
    this.roleLocal.permissions = permissions;
  }
  async createRole() {
    if (this.roleLocal) {
      console.log(this.roleLocal);
      const _role = await createRole(this.roleLocal)
        .then(res => {
          const response: IRole = res.data;
          snackbar.setSnackbar({
            text: "Thêm mới thành công quyền: " + response.name,
            color: "success"
          });
          return response;
        })
        .catch(err => {
          console.log(err);
          snackbar.setSnackbar({
            text: getErrorMessage(err),
            color: "error"
          });
          return null;
        });
      if (_role) {
        this.rolesSync.unshift(_role);
        this.totalItemsSync += 1;
        this.dialogAddSync = false;
      }
      snackbar.setDisplay(true);
    }
  }
  async updateRole() {
    if (this.roleLocal.id) {
      const _role = await updateRole(this.roleLocal)
        .then(res => {
          console.log(res.data);
          const response: IRole = res.data;
          snackbar.setSnackbar({
            text: "Cập nhập thành công quyền: " + response.name,
            color: "success"
          });
          return response;
        })
        .catch(err => {
          console.log(err);
          snackbar.setSnackbar({
            text: getErrorMessage(err),
            color: "error"
          });
          return null;
        });
      if (_role) {
        const index = this.rolesSync.findIndex(x => x.id == _role.id);
        this.rolesSync.splice(index, 1, _role);
      }
      snackbar.setDisplay(true);
    }
  }
}
</script>
