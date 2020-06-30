<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <DeleteOperator
          :dialogDel.sync="dialogDel"
          :operator.sync="operator"
          :operators.sync="operators"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <CreateOperator
          v-if="dialogAdd"
          :operator="operator"
          :operators.sync="operators"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :snackbar.sync="snackbar"
          :update="update"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-data-table
        :headers="headers"
        :items="operators"
        :search="search"
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
              >Danh sách Quản trị viên</v-toolbar-title
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
import { Component, PropSync, Watch, Vue } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import { IOperator } from "@/entity/operator";
import CreateOperator from "./components/CreateOperator.vue";
import DeleteOperator from "./components/DeleteOperator.vue";
import { getOperators } from "@/api/operator";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";

@Component({
  components: {
    CreateOperator,
    DeleteOperator,
    Snackbar
  }
})
export default class Operator extends Vue {
  @PropSync("layout") layoutSync!: object;
  operators: Array<IOperator> = [];
  operator = {} as IOperator;
  dialogAdd = false;
  dialogDel = false;
  search = "";
  roleSearch = "";
  message = "";
  snackbar = false;
  loading = true;
  update = false;
  options = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  rolesSearch = ["ROLE_ADMIN", "ROLE_MODERATOR"];
  headers = [
    {
      text: "Tên đăng nhập",
      align: "start",
      value: "username"
    },
    { text: "Email", value: "email" },
    { text: "Số điện thoại", value: "phone" },
    {
      text: "Phân quyền",
      value: "roles"
    },
    { text: "Trạng thái", value: "status" },
    {
      text: "Hành động",
      value: "actions",
      sortable: false
    }
  ];
  created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }
  openCreateDialog() {
    this.operator = {} as IOperator;
    this.operator.roles = ["ROLE_ADMIN"];
    this.operator.status = "ACTIVE";
    this.update = false;
    this.dialogAdd = true;
  }

  openUpdateDialog(item: IOperator) {
    this.operator = item;
    this.update = true;
    this.dialogAdd = true;
  }

  openDeleteDialog(item: IOperator) {
    this.operator = item;
    this.dialogDel = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    if (val !== oldVal) {
      getOperators({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IOperator> = res.data;
          console.log("watch", response);
          this.operators = response.data;
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
