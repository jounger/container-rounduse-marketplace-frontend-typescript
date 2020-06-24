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
                label="Tên vai trò"
                name="name"
                prepend-icon="mdi-account"
                type="text"
                v-model="permissionSync.name"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Mô tả"
                name="description"
                prepend-icon="mdi-account"
                type="text"
                v-model="permissionSync.description"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn @click="updatePermission()" color="primary" v-if="isUpdate"
          >Cập nhập</v-btn
        >
        <v-btn @click="addPermission()" color="primary" v-else>Thêm mới</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { IPermission } from "@/entity/permission";
import { createPermission, updatePermission } from "@/api/permission";

@Component
export default class CreatePermission extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("permission", { type: Object }) permissionSync!: IPermission;
  @PropSync("permissions", { type: Array }) permissionsSync!: Array<
    IPermission
  >;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  get isUpdate() {
    if (typeof this.permissionSync.id !== "undefined") return true;
    return false;
  }
  addPermission() {
    if (this.permissionSync) {
      createPermission(this.permissionSync)
        .then(res => {
          console.log(res.data);
          const response: IPermission = res.data;
          this.permissionSync = response;
          this.messageSync =
            "Thêm mới thành công vai trò: " + this.permissionSync.name;
          this.permissionsSync.push(this.permissionSync);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogAddSync = false))
        );
    }
  }
  updatePermission() {
    if (this.permissionSync.id) {
      updatePermission(this.permissionSync)
        .then(res => {
          console.log(res.data);
          const response: IPermission = res.data;
          this.permissionSync = response;
          this.messageSync =
            "Cập nhập thành công vai trò: " + this.permissionSync.name;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogAddSync = false))
        );
    }
  }
}
</script>
