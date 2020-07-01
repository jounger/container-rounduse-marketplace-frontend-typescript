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
        <v-form>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Tên quyền*"
                name="name"
                prepend-icon="mdi-account"
                type="text"
                v-model="roleLocal.name"
                :counter="20"
                :rules="[minLength('name', 5), maxLength('name', 20)]"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs9>
              <v-combobox
                v-model="roleLocal.permissions"
                :items="permissionsToString"
                chips
                :clearable="!readonly"
                label="Phân vai trò*"
                multiple
                prepend-icon="filter_list"
                :rules="[required('permissions')]"
              >
                <template
                  v-slot:selection="{ attrs, item, select, selected }"
                  v-if="!readonly"
                >
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
              </v-combobox>
            </v-flex>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn @click="updateRole()" color="primary" v-if="update"
          >Cập nhập</v-btn
        >
        <v-btn @click="createRole()" color="primary" v-else>Thêm mới</v-btn>
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
  @PropSync("role", { type: Object }) roleSync!: IRole;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @Prop(Boolean) update!: boolean;

  permissions = [] as Array<IPermission>;
  roleLocal = {} as IRole;
  created() {
    this.roleLocal = Object.assign({}, this.roleSync);
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
    this.roleLocal.permissions.splice(
      this.roleLocal.permissions.indexOf(item),
      1
    );
    this.roleLocal.permissions = [...this.roleLocal.permissions];
  }
  createRole() {
    if (this.roleLocal) {
      createRole(this.roleLocal)
        .then(res => {
          const response: IRole = res.data;
          this.roleLocal.id = response.id;
          this.messageSync =
            "Thêm mới thành công quyền: " + this.roleLocal.name;
          this.rolesSync.unshift(this.roleLocal);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  updateRole() {
    if (this.roleSync.id) {
      this.roleSync = Object.assign({}, this.roleLocal);
      updateRole(this.roleSync)
        .then(res => {
          console.log(res.data);
          const response: IRole = res.data;
          this.roleSync = response;
          this.messageSync = "Cập nhập thành công quyền: " + this.roleSync.name;
          const index = this.rolesSync.findIndex(
            x => x.id === this.roleSync.id
          );
          this.rolesSync.splice(index, 1, this.roleSync);
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
