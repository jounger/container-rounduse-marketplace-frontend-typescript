<template>
  <v-content>
    <v-row justify="center">
      <DeleteOperator
        v-if="dialogDel"
        :dialogDel.sync="dialogDel"
        :operator="operator"
        :operators.sync="operators"
        :totalItems.sync="serverSideOptions.totalItems"
      />
    </v-row>
    <v-row justify="center">
      <CreateOperator
        v-if="dialogAdd"
        :operator="operator"
        :operators.sync="operators"
        :dialogAdd.sync="dialogAdd"
        :totalItems.sync="serverSideOptions.totalItems"
        :update="update"
      />
    </v-row>
    <v-card class="ma-5">
      <v-data-table
        :headers="headers"
        :items="operators"
        :loading="loading"
        :options.sync="options"
        disable-sort
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
        no-data-text="Danh sách quản trị viên rỗng."
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
        <template v-slot:item.status="{ item }">
          <v-chip :color="item.status == 'ACTIVE' ? 'success' : 'error'" dark>{{
            item.status
          }}</v-chip>
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
import { IOperator } from "@/entity/operator";
import CreateOperator from "./components/CreateOperator.vue";
import DeleteOperator from "./components/DeleteOperator.vue";
import { getOperators } from "@/api/operator";
import { DataOptions } from "vuetify";

@Component({
  components: {
    CreateOperator,
    DeleteOperator
  }
})
export default class Operator extends Vue {
  operators: Array<IOperator> = [];
  operator = null as IOperator | null;
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
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    {
      text: "Tên đăng nhập",
      align: "start",
      value: "username"
    },
    { text: "Email", value: "email" },
    { text: "Số điện thoại", value: "phone" },
    {
      text: "Vai trò",
      value: "roles"
    },
    { text: "Trạng thái", value: "status" },
    {
      text: "Hành động",
      value: "actions",
      sortable: false
    }
  ];

  openCreateDialog() {
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

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _operators = await getOperators({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_operators.data) {
        this.operators = _operators.data.data;
        this.serverSideOptions.totalItems = _operators.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
