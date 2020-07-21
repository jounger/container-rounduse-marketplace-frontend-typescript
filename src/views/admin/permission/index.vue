<template>
  <v-content>
    <v-card class="ma-5">
      <v-row justify="center">
        <DeletePermission
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :permission="permission"
          :totalItems.sync="serverSideOptions.totalItems"
          :permissions.sync="permissions"
        />
      </v-row>
      <v-row justify="center">
        <CreatePermission
          v-if="dialogAdd"
          :permission="permission"
          :permissions.sync="permissions"
          :dialogAdd.sync="dialogAdd"
          :totalItems.sync="serverSideOptions.totalItems"
          :update="update"
        />
      </v-row>
      <v-data-table
        :headers="headers"
        :items="permissions"
        item-key="id"
        :loading="loading"
        disable-sort
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title style="font-weight:bold; font-size: 25px;"
              >Danh sách vai trò</v-toolbar-title
            >
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" @click="openCreateDialog()"
              >Thêm mới</v-btn
            >
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openUpdateDialog(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="openDeleteDialog(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IPermission } from "@/entity/permission";
import { getPermissions } from "@/api/permission";
import { PaginationResponse } from "@/api/payload";
import DeletePermission from "./components/DeletePermission.vue";
import CreatePermission from "./components/CreatePermission.vue";
import { DataOptions } from "vuetify";

@Component({
  components: {
    CreatePermission,
    DeletePermission
  }
})
export default class Permission extends Vue {
  permissions: Array<IPermission> = [];
  permission = {} as IPermission;
  dialogAdd = false;
  dialogDel = false;
  loading = true;
  update = false;
  options = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  headers = [
    {
      text: "Tên vai trò",
      align: "start",
      sortable: true,
      value: "name"
    },
    { text: "Mô tả", value: "description" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];
  openCreateDialog() {
    this.update = false;
    this.permission = {} as IPermission;
    this.dialogAdd = true;
  }

  openUpdateDialog(item: IPermission) {
    this.update = true;
    this.permission = item;
    this.dialogAdd = true;
  }

  openDeleteDialog(item: IPermission) {
    this.permission = item;
    this.dialogDel = true;
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _permissions = await getPermissions({
        page: val.page - 1,
        limit: val.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IPermission> = res.data;
          console.log("watch", response);
          return response;
        })
        .catch(err => {
          console.log(err);
          return null;
        });
      if (_permissions) {
        this.permissions = _permissions.data;
        this.serverSideOptions.totalItems = _permissions.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
