<template>
  <v-dialog v-model="dialogAddSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhập Vai trò" : "Thêm mới Vai trò"
          }}</span>
          <v-btn
            icon
            dark
            @click="dialogAddSync = false"
            style="margin-left:337px;"
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
                label="Tên vai trò*"
                name="name"
                prepend-icon="mdi-account"
                type="text"
                :counter="20"
                :rules="[minLength('name', 5), maxLength('name', 20)]"
                v-model="permissionLocal.name"
                :readonly="readonly"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Mô tả*"
                name="description"
                prepend-icon="mdi-account"
                type="text"
                :counter="100"
                :rules="[
                  minLength('description', 5),
                  maxLength('description', 100)
                ]"
                v-model="permissionLocal.description"
                :readonly="readonly"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn @click="updatePermission()" color="primary" v-if="update"
          >Cập nhập</v-btn
        >
        <v-btn
          @click="createPermission()"
          color="primary"
          v-else
          :disabled="readonly"
          >Thêm mới</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IPermission } from "@/entity/permission";
import FormValidate from "@/mixin/form-validate";
import { createPermission, updatePermission } from "@/api/permission";

@Component({
  mixins: [FormValidate]
})
export default class CreatePermission extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("permissions", { type: Array }) permissionsSync!: Array<
    IPermission
  >;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("permission", { type: Object }) permissionSync!: IPermission;
  @Prop(Boolean) update!: boolean;

  readonly = false;
  permissionLocal = {} as IPermission;
  created() {
    this.permissionLocal = Object.assign({}, this.permissionSync);
  }
  createPermission() {
    if (this.permissionLocal) {
      createPermission(this.permissionLocal)
        .then(res => {
          console.log(res.data);
          const response: IPermission = res.data;
          console.log(response);
          this.permissionLocal.id = response.id;
          this.messageSync =
            "Thêm mới thành công vai trò: " + this.permissionLocal.name;
          this.permissionsSync.unshift(this.permissionLocal);
          console.log(this.permissionsSync);
          this.readonly = true;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  updatePermission() {
    if (this.permissionSync.id) {
      this.permissionSync = Object.assign({}, this.permissionLocal);
      updatePermission(this.permissionSync)
        .then(res => {
          console.log(res.data);
          const response: IPermission = res.data;
          this.permissionSync = response;
          this.messageSync =
            "Cập nhập thành công vai trò: " + this.permissionSync.name;
          const index = this.permissionsSync.findIndex(
            x => x.id === this.permissionSync.id
          );
          this.permissionsSync.splice(index, 1, this.permissionSync);
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
