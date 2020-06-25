<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <DeleteRole
          :dialogDel.sync="dialogDel"
          :role.sync="role"
          :roles.sync="roles"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <CreateRole
          :role.sync="role"
          :roles.sync="roles"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-data-table
        :headers="headers"
        :items="roles"
        item-key="id"
        :loading="loading"
        :options.sync="options"
        :server-items-length="options.totalItems"
        :footer-props="{ 'items-per-page-options': options.itemsPerPageItems }"
        :actions-append="options.page"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title style="font-weight:bold; font-size: 25px;"
              >Danh sách quyền</v-toolbar-title
            >
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" @click="addRole()"
              >Thêm mới</v-btn
            >
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="viewDetail(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="removeRole(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, PropSync, Watch, Vue } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import { IRole } from "@/entity/role";
import { getRoles } from "@/api/role";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";
import DeleteRole from "./components/DeleteRole.vue";
import CreateRole from "./components/CreateRole.vue";

@Component({
  components: {
    CreateRole,
    DeleteRole,
    Snackbar
  }
})
export default class Role extends Vue {
  @PropSync("layout") layoutSync!: object;
  roles: Array<IRole> = [];
  role = {} as IRole;
  dialogAdd = false;
  dialogDel = false;
  search = "";
  message = "";
  snackbar = false;
  loading = true;
  options = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
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
  created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }

  addRole() {
    this.dialogAdd = true;
  }

  viewDetail(item: IRole) {
    console.log(item);
    this.role = item;
    this.dialogAdd = true;
  }

  removeRole(item: IRole) {
    this.role = item;
    this.dialogDel = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    if (val !== oldVal) {
      getRoles({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IRole> = res.data;
          console.log("watch", response);
          this.roles = response.data;
          this.options.totalItems = response.totalElements;
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
