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
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-row>
            <v-col cols="12" md="10">
              <v-text-field
                label="Tên vai trò*"
                name="name"
                prepend-icon="enhanced_encryption"
                type="text"
                :counter="20"
                :rules="[minLength('name', 5), maxLength('name', 20)]"
                v-model="permissionLocal.name"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="10">
              <v-text-field
                label="Mô tả*"
                name="description"
                prepend-icon="description"
                type="text"
                :counter="100"
                :rules="[
                  minLength('description', 5),
                  maxLength('description', 100)
                ]"
                v-model="permissionLocal.description"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn
          @click="updatePermission()"
          color="primary"
          v-if="update"
          :disabled="!valid"
          >Cập nhập</v-btn
        >
        <v-btn
          @click="createPermission()"
          color="primary"
          v-else
          :disabled="!valid"
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
import { getErrorMessage } from "@/utils/tool";

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
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) permission!: IPermission;
  @Prop(Boolean) update!: boolean;

  permissionLocal = {
    name: "",
    description: ""
  } as IPermission;
  valid = false;
  created() {
    if (this.update) {
      this.permissionLocal = Object.assign({}, this.permission);
    }
  }
  createPermission() {
    if (this.permissionLocal) {
      createPermission(this.permissionLocal)
        .then(res => {
          const response: IPermission = res.data;
          this.messageSync = "Thêm mới thành công vai trò: " + response.name;
          this.permissionsSync.unshift(response);
          this.totalItemsSync += 1;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = getErrorMessage(err);
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  updatePermission() {
    if (this.permissionLocal.id) {
      updatePermission(this.permissionLocal)
        .then(res => {
          console.log(res.data);
          const response: IPermission = res.data;
          this.messageSync = "Cập nhập thành công vai trò: " + response.name;
          const index = this.permissionsSync.findIndex(
            x => x.id == response.id
          );
          this.permissionsSync.splice(index, 1, response);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = getErrorMessage(err);
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
}
</script>
