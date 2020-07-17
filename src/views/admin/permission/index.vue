<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <DeletePermission
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :permission="permission"
          :totalItems.sync="serverSideOptions.totalItems"
          :permissions.sync="permissions"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <CreatePermission
          v-if="dialogAdd"
          :permission="permission"
          :permissions.sync="permissions"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :totalItems.sync="serverSideOptions.totalItems"
          :snackbar.sync="snackbar"
          :update="update"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-data-table
        :headers="headers"
        :items="permissions"
        item-key="id"
        :loading="loading"
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
import Snackbar from "@/components/Snackbar.vue";
import DeletePermission from "./components/DeletePermission.vue";
import CreatePermission from "./components/CreatePermission.vue";
import { DataOptions } from "vuetify";

@Component({
  components: {
    CreatePermission,
    DeletePermission,
    Snackbar
  }
})
export default class Permission extends Vue {
  permissions: Array<IPermission> = [];
  permission = {} as IPermission;
  dialogAdd = false;
  dialogDel = false;
  message = "";
  snackbar = false;
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

  @Watch("options", { deep: true })
  onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      getPermissions({
        page: val.page - 1,
        limit: val.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IPermission> = res.data;
          console.log("watch", response);
          this.permissions = response.data;
          this.serverSideOptions.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
}
</script>
<style type="text/css">
.line {
  margin-top: 10px;
  width: 520px;
  border-bottom: 1px solid black;
  position: absolute;
}
</style>
