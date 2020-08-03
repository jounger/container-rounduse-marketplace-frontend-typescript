<template>
  <v-content>
    <v-card class="ma-5">
      <v-row justify="center">
        <DeleteRole
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :role="role"
          :roles.sync="roles"
          :totalItems.sync="serverSideOptions.totalItems"
        />
      </v-row>
      <v-row justify="center">
        <CreateRole
          v-if="dialogAdd"
          :role="role"
          :roles.sync="roles"
          :totalItems.sync="serverSideOptions.totalItems"
          :dialogAdd.sync="dialogAdd"
          :update="update"
        />
      </v-row>
      <v-data-table
        :headers="headers"
        :items="roles"
        item-key="id"
        :loading="loading"
        disable-sort
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
        no-data-text="Danh sách quyền rỗng."
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title style="font-weight:bold; font-size: 25px;"
              >Danh sách quyền</v-toolbar-title
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
import { IRole } from "@/entity/role";
import { getRoles } from "@/api/role";
import { PaginationResponse } from "@/api/payload";
import DeleteRole from "./components/DeleteRole.vue";
import CreateRole from "./components/CreateRole.vue";
import { DataOptions } from "vuetify";

@Component({
  components: {
    CreateRole,
    DeleteRole
  }
})
export default class Role extends Vue {
  roles: Array<IRole> = [];
  role = null as IRole | null;
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
      text: "Tên quyền",
      align: "start",
      sortable: true,
      value: "name"
    },
    { text: "Vai trò", value: "permissions" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  openCreateDialog() {
    this.update = false;
    this.dialogAdd = true;
  }

  openUpdateDialog(item: IRole) {
    this.role = item;
    this.update = true;
    this.dialogAdd = true;
  }

  openDeleteDialog(item: IRole) {
    this.role = item;
    this.dialogDel = true;
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _roles = await getRoles({
        page: val.page - 1,
        limit: val.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IRole> = res.data;
          console.log("watch", response);
          return response;
        })
        .catch(err => {
          console.log(err);
          return null;
        });
      if (_roles) {
        this.roles = _roles.data;
        this.serverSideOptions.totalItems = _roles.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
