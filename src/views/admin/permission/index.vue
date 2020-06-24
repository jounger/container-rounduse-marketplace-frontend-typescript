<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách vai trò
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-btn
        color="primary"
        style="margin-left: 35px;"
        dark
        @click="addPermission()"
      >
        Thêm mới
      </v-btn>
      <v-row justify="center">
        <DialogDeletePermission
          :dialogDel.sync="dialogDel"
          :permission.sync="permission"
          :permissions.sync="permissions"
          :options.sync="options"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <DialogCreatePermission
          :permission.sync="permission"
          :permissions.sync="permissions"
          :options.sync="options"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-data-table
        :headers="headers"
        :items="permissions"
        item-key="id"
        :search="search"
        :loading="loading"
        :options.sync="options"
        :server-items-length="options.totalItems"
        :footer-props="{ 'items-per-page-options': options.itemsPerPageItems }"
        :actions-append="options.page"
        class="elevation-1"
      >
        <template v-slot:item.action="{ item }">
          <v-menu :loading="item.createloading" :disabled="item.createloading">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="secondary" dark v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="viewDetail(item)">
                <v-list-item-title>Chi tiết</v-list-item-title>
              </v-list-item>
              <v-list-item @click="removePermission(item)">
                <v-list-item-title>Xóa</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, PropSync, Watch, Vue } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import { IPermission } from "@/entity/permission";
import { getPermissions } from "@/api/permission";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";
import DialogDeletePermission from "./components/DialogDeletePermission.vue";
import DialogCreatePermission from "./components/DialogCreatePermission.vue";

@Component({
  components: {
    DialogCreatePermission,
    DialogDeletePermission,
    Snackbar
  }
})
export default class Permission extends Vue {
  @PropSync("layout") layoutSync!: object;
  permissions: Array<IPermission> = [];
  permission: IPermission = {
    name: "",
    description: ""
  };
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
      text: "Tên vai trò",
      align: "start",
      sortable: true,
      value: "name"
    },
    { text: "Mô tả", value: "description" },
    {
      text: "Hành động",
      value: "action"
    }
  ];
  created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }

  addPermission() {
    this.permission = {
      name: "",
      description: ""
    };
    this.dialogAdd = true;
  }

  viewDetail(item: IPermission) {
    this.permission = item;
    this.dialogAdd = true;
  }

  removePermission(item: IPermission) {
    this.permission = item;
    this.dialogDel = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    if (val !== oldVal) {
      getPermissions({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IPermission> = res.data;
          console.log("watch", this.options);
          this.permissions = response.data;
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
