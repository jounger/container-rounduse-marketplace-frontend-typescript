<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhật Quyền" : "Thêm mới Quyền"
          }}</span></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                label="Tên quyền*"
                name="name"
                prepend-icon="security"
                type="text"
                v-model="roleLocal.name"
                :disabled="update"
                :counter="20"
                :rules="[minLength('Tên quyền', 5), maxLength('Tên quyền', 20)]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="11">
              <v-select
                v-model="roleLocal.permissions"
                :items="permissionsToString"
                :loading="loading"
                no-data-text="Danh sách vai trò rỗng."
                open-on-clear
                deletable-chips
                chips
                clearable
                label="Phân vai trò"
                multiple
                prepend-icon="enhanced_encryption"
              >
                <v-btn
                  text
                  small
                  color="primary"
                  v-if="seeMore"
                  slot="append-item"
                  style="margin-left:190px;"
                  @click="loadMorePermissions()"
                  >Xem thêm</v-btn
                >
              </v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
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
  limit = 5;
  loading = false;
  valid = false;
  seeMore = true;
  roleLocal = {
    name: "",
    permissions: []
  } as IRole;
  async getPermissions(limit: number) {
    this.loading = true;
    this.permissions = [] as Array<IPermission>;
    const _res = await getPermissions({
      page: 0,
      limit: limit + 1
    });
    if (_res.data) {
      const _permissions = _res.data.data;
      if (!this.update) {
        _permissions.forEach((x: IPermission, index: number) => {
          if (index != limit) {
            this.permissions.push(x);
          }
        });
      } else {
        _permissions.forEach((x: IPermission) => {
          for (let i = 0; i < this.roleLocal.permissions.length; i++) {
            if (x.name == this.roleLocal.permissions[i]) {
              this.permissions.push(x);
            }
          }
        });
        if (this.permissions.length > this.limit) {
          this.limit = this.permissions.length;
        } else {
          if (this.permissions.length < this.limit) {
            _permissions.forEach((x: IPermission) => {
              let check = false;
              for (let i = 0; i < this.permissions.length; i++) {
                if (x.name == this.permissions[i].name) {
                  check = true;
                }
              }
              if (check == false && this.permissions.length < this.limit) {
                this.permissions.push(x);
              }
            });
          }
        }
      }
      if (!_permissions.data || _permissions.data.length <= this.limit) {
        this.seeMore = false;
      }
    }
    this.loading = false;
  }
  async loadMorePermissions() {
    this.limit += 5;
    await this.getPermissions(this.limit);
  }
  async created() {
    if (this.update) {
      this.roleLocal = Object.assign({}, this.role);
      await this.getPermissions(100);
    } else {
      await this.getPermissions(50);
    }
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
