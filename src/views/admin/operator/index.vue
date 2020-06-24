<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách Operator
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
        @click="addOperator()"
      >
        Thêm mới
      </v-btn>
      <v-row justify="center">
        <DialogDeleteOperator
          :dialogDel.sync="dialogDel"
          :operator.sync="operator"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <DialogCreateOperator
          :operator.sync="operator"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-data-table
        :headers="headers"
        :items="operators"
        item-key="username"
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
              <v-list-item @click="removeOperator(item)">
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
import { IOperator } from "@/entity/operator";
import DialogCreateOperator from "./components/DialogCreateOperator.vue";
import DialogDeleteOperator from "./components/DialogDeleteOperator.vue";
import { getOperators } from "@/api/operator";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";

@Component({
  components: {
    DialogCreateOperator,
    DialogDeleteOperator,
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
      text: "Tên đăng nhập",
      align: "start",
      sortable: true,
      value: "username"
    },
    { text: "Email", value: "email" },
    { text: "Số điện thoại", value: "phone" },
    { text: "Phân quyền", value: "roles" },
    { text: "Trạng thái", value: "status" },
    {
      text: "Hành động",
      value: "action"
    }
  ];
  created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }

  addOperator() {
    this.dialogAdd = true;
  }

  viewDetail(item: IOperator) {
    this.operator = item;
    this.dialogAdd = true;
  }

  removeOperator(item: IOperator) {
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
