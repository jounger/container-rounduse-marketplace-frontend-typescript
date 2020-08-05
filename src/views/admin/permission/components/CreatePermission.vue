<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhập Vai trò" : "Thêm mới Vai trò"
          }}</span></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                label="Tên vai trò*"
                name="name"
                prepend-icon="enhanced_encryption"
                type="text"
                :readonly="update"
                :counter="20"
                :rules="[minLength('name', 5), maxLength('name', 20)]"
                v-model="permissionLocal.name"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="11">
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
        </v-form>
      </v-card-text>
      <v-card-actions>
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

@Component({
  mixins: [FormValidate]
})
export default class CreatePermission extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("permissions", { type: Array }) permissionsSync!: Array<
    IPermission
  >;
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
  async createPermission() {
    if (this.permissionLocal) {
      const _permission = await createPermission(this.permissionLocal);
      if (_permission.data) {
        this.permissionsSync.unshift(_permission.data);
        this.totalItemsSync += 1;
        this.dialogAddSync = false;
      }
    }
  }
  async updatePermission() {
    if (this.permissionLocal.id) {
      const _permission = await updatePermission(this.permissionLocal);
      if (_permission.data) {
        const index = this.permissionsSync.findIndex(
          x => x.id == _permission.data.id
        );
        this.permissionsSync.splice(index, 1, _permission.data);
      }
    }
  }
}
</script>
