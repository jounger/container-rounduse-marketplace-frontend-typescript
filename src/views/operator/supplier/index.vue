<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <SupplierDetail
          v-if="dialogDetail"
          :dialogDetail.sync="dialogDetail"
          :dialogReview.sync="dialogReview"
          :supplier.sync="supplier"
          :suppliers.sync="suppliers"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <ReviewSupplier
          v-if="dialogReview"
          :dialogReview.sync="dialogReview"
          :supplier.sync="supplier"
          :suppliers.sync="suppliers"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-card-title>
        Danh sách Supplier
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="suppliers"
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
              <v-list-item @click="openDetailDialog(item)">
                <v-list-item-title>Xem chi tiết</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="openReviewDialog(item)"
                v-if="item.status === 'ACTIVE'"
              >
                <v-list-item-title>Khóa tài khoản</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="openReviewDialog(item)"
                v-if="item.status === 'BANNED'"
              >
                <v-list-item-title>Mở khóa tài khoản</v-list-item-title>
              </v-list-item>
              <v-list-item @click="openDeleteDialog(item)">
                <v-list-item-title>Xóa tài khoản</v-list-item-title>
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
import { ISupplier } from "@/entity/supplier";
import { getSuppliers } from "@/api/supplier";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";
import ReviewSupplier from "./components/ReviewSupplier.vue";
import SupplierDetail from "./components/SupplierDetail.vue";

@Component({
  components: {
    Snackbar,
    ReviewSupplier,
    SupplierDetail
  }
})
export default class Supplier extends Vue {
  @PropSync("layout") layoutSync!: object;
  suppliers: Array<ISupplier> = [];
  supplier = {} as ISupplier;

  dialogDetail = false;
  dialogDel = false;
  dialogReview = false;
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
      value: "action",
      sortable: false,
      align: "center"
    }
  ];
  created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }

  openDetailDialog(item: ISupplier) {
    this.supplier = item;
    this.dialogDetail = true;
  }
  openDeleteDialog(item: ISupplier) {
    this.supplier = item;
    this.dialogDel = true;
  }
  openReviewDialog(item: ISupplier) {
    this.supplier = item;
    this.dialogReview = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    if (val !== oldVal) {
      getSuppliers({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<ISupplier> = res.data;
          console.log("watch", this.options);
          this.suppliers = response.data.filter(
            (supplier: ISupplier) => supplier.status != "PENDING"
          );
          this.options.totalItems = this.suppliers.length;
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
