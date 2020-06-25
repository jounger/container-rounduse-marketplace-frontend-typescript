<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            isUpdate ? "Cập nhập" : "Thêm mới"
          }}</span>
          <v-btn
            icon
            dark
            @click="dialogAddSync = false"
            style="margin-left:412px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Tên quyền"
                name="name"
                prepend-icon="mdi-account"
                type="text"
                v-model="roleSync.name"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs9>
              <v-select
                :items="permissionsToString"
                label="Phân vai trò"
                multiple
                v-model="roleSync.permissions"
              ></v-select>
            </v-flex>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn @click="updateRole()" color="primary" v-if="isUpdate"
          >Cập nhập</v-btn
        >
        <v-btn @click="addRole()" color="primary" v-else>Thêm mới</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { IRole } from "@/entity/role";
import { createRole, updateRole, getRoles } from "@/api/role";
import { PaginationResponse } from "@/api/payload";
import { getPermissions } from "@/api/permission";
import { IPermission } from "@/entity/permission";

@Component
export default class CreateRole extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("role", { type: Object }) roleSync!: IRole;
  @PropSync("roles", { type: Array }) rolesSync!: Array<IRole>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  permissions = [] as Array<IPermission>;
  created() {
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
  get isUpdate() {
    if (typeof this.roleSync.id !== "undefined") return true;
    return false;
  }
  get permissionsToString() {
    return this.permissions.map(x => x.name);
  }
  addRole() {
    if (this.roleSync) {
      createRole(this.roleSync)
        .then(res => {
          console.log(res.data);
          const response: IRole = res.data;
          this.roleSync = response;
          this.messageSync = "Thêm mới thành công quyền: " + this.roleSync.name;
          this.rolesSync.push(this.roleSync);
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
      updateRole(this.roleSync)
        .then(res => {
          console.log(res.data);
          const response: IRole = res.data;
          this.roleSync = response;
          this.messageSync = "Cập nhập thành công quyền: " + this.roleSync.name;
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
