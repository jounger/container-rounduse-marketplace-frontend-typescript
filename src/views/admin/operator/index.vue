<template>
  <v-container fluid>
    <v-card>
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
        <template v-slot:item.avatar="{ item }">
          <v-avatar size="35" color="tertiary">
            <v-img
              v-if="item.profileImagePath"
              :src="item.profileImagePath"
            ></v-img>
            <span v-else class="white--text headline">{{
              item.username.substring(0, 1).toUpperCase()
            }}</span>
          </v-avatar>
        </template>
        <template v-slot:item.status="{ item }">
          <ChipStatus :status="item.status" />
        </template>
        <template v-slot:item.roles="{ item }">
          <ChipStatus :status="item.roles" type="roles" />
        </template>
        <template v-slot:item.isRoot="{ item }">
          {{ item.isRoot ? "Đúng" : "Không" }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-menu :close-on-click="true">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" icon outlined v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="openUpdateDialog(item)">
                <v-list-item-icon>
                  <v-icon small>edit</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Chỉnh sửa</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="openDeleteDialog(item)">
                <v-list-item-icon>
                  <v-icon small>delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xóa bỏ</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
    <v-row justify="center">
      <DeleteOperator
        v-if="dialogDel"
        :dialogDel.sync="dialogDel"
        :operator="operator"
        :operators.sync="operators"
        :totalItems.sync="serverSideOptions.totalItems"
      />
      <CreateOperator
        v-if="dialogAdd"
        :operator="operator"
        :operators.sync="operators"
        :dialogAdd.sync="dialogAdd"
        :totalItems.sync="serverSideOptions.totalItems"
        :update="update"
      />
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IOperator } from "@/entity/operator";
import CreateOperator from "./components/CreateOperator.vue";
import DeleteOperator from "./components/DeleteOperator.vue";
import { getOperators } from "@/api/operator";
import { DataOptions } from "vuetify";
import ChipStatus from "@/components/ChipStatus.vue";

@Component({
  components: {
    CreateOperator,
    DeleteOperator,
    ChipStatus
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
      text: "Ảnh",
      value: "avatar"
    },
    {
      text: "Tên đăng nhập",
      value: "username"
    },
    {
      text: "Họ và tên",
      value: "fullname"
    },
    { text: "Email", value: "email" },
    { text: "Số điện thoại", value: "phone" },
    {
      text: "Vai trò",
      value: "roles"
    },
    { text: "Root", value: "isRoot" },
    { text: "Trạng thái", value: "status" },
    { text: "Hành động", value: "actions" }
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
      const _res = await getOperators({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _operators = _res.data.data;
        this.operators = _operators;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
