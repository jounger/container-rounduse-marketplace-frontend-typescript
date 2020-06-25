<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <DeleteShippingLine
          :dialogDel.sync="dialogDel"
          :shippingLine.sync="shippingLine"
          :shippingLines.sync="shippingLines"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <CreateShippingLine
          :shippingLine.sync="shippingLine"
          :shippingLines.sync="shippingLines"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-data-table
        :headers="headers"
        :items="shippingLines"
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
              >Danh sách hãng tàu</v-toolbar-title
            >
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" @click="addShippingLine()"
              >Thêm mới</v-btn
            >
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="viewDetail(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="removeShippingLine(item)">
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
import { IShippingLine } from "@/entity/shipping-line";
import { getShippingLines } from "@/api/shipping-line";
import { PaginationResponse } from "@/api/payload";
import CreateShippingLine from "./components/CreateShippingLine.vue";
import Snackbar from "@/components/Snackbar.vue";
import DeleteShippingLine from "./components/DeleteShippingLine.vue";

@Component({
  components: {
    CreateShippingLine,
    DeleteShippingLine,
    Snackbar
  }
})
export default class ShippingLine extends Vue {
  @PropSync("layout") layoutSync!: object;
  shippingLines: Array<IShippingLine> = [];
  shippingLine = {} as IShippingLine;

  dialogAdd = false;
  dialogDel = false;
  loading = true;
  message = "";
  snackbar = false;
  search = "";
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
      value: "username"
    },
    { text: "Email", value: "email" },
    { text: "Trạng thái", value: "status" },
    { text: "Phân quyền", value: "roles" },
    {
      text: "Hành động",
      value: "actions",
      sortable: false,
      align: "center"
    }
  ];
  created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }
  addShippingLine() {
    this.shippingLine = {} as IShippingLine;
    this.dialogAdd = true;
  }
  viewDetail(item: IShippingLine) {
    this.shippingLine = item;
    this.dialogAdd = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    if (val !== oldVal) {
      getShippingLines({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IShippingLine> = res.data;
          this.shippingLines = response.data.filter(
            x => x.roles[0] == "ROLE_SHIPPINGLINE"
          );
          this.options.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }

  @Watch("shippingLine", { deep: true })
  onShippingLineChange(val: IShippingLine, oldVal: IShippingLine) {
    if (val.status !== oldVal.status) {
      const index = this.shippingLines.findIndex(
        x => x.id === this.shippingLine.id
      );
      this.shippingLines.splice(index, 1, val);
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
