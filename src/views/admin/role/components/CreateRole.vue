<template>
  <v-dialog v-model="dialogAddSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhập Quyền" : "Thêm mới Quyền"
          }}</span>
          <v-btn
            icon
            dark
            @click="dialogAddSync = false"
            style="margin-left:339px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
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
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
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

@Component({
  mixins: [FormValidate]
})
export default class CreateRole extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("roles", { type: Array }) rolesSync!: Array<IRole>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Boolean) update!: boolean;
  @Prop(Object) role!: IRole;

  permissions: Array<IPermission> = [];
  valid = false;
  roleLocal = {
    name: "",
    permissions: []
  } as IRole;
  created() {
    if (this.update) {
      this.roleLocal = Object.assign({}, this.role);
    }
    getPermissions({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IPermission> = res.data;
        this.permissions = response.data;
      })
      .catch(err => console.log(err))
      .finally();
  }
  get permissionsToString() {
    return this.permissions.map(x => x.name);
  }
  remove(item: string) {
    const permissions = this.roleLocal.permissions.filter(x => x != item);
    this.roleLocal.permissions = permissions;
  }
  createRole() {
    if (this.roleLocal) {
      console.log(this.roleLocal);
      createRole(this.roleLocal)
        .then(res => {
          const response: IRole = res.data;
          this.messageSync = "Thêm mới thành công quyền: " + response.name;
          this.rolesSync.unshift(response);
          this.totalItemsSync += 1;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  updateRole() {
    if (this.roleLocal.id) {
      updateRole(this.roleLocal)
        .then(res => {
          console.log(res.data);
          const response: IRole = res.data;
          this.messageSync = "Cập nhập thành công quyền: " + response.name;
          const index = this.rolesSync.findIndex(x => x.id == response.id);
          this.rolesSync.splice(index, 1, response);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
}
</script>
