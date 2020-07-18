<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <SupplierDetail
          v-if="dialogDetail"
          :dialogDetail.sync="dialogDetail"
          :supplier="supplier"
        />
      </v-row>
      <v-row justify="center">
        <ReviewSupplier
          v-if="dialogReview"
          :dialogReview.sync="dialogReview"
          :supplier="supplier"
          :suppliers.sync="suppliers"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-card-title>
        Danh sách Supplier
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="suppliers"
        item-key="username"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
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
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { ISupplier } from "@/entity/supplier";
import { getSuppliers } from "@/api/supplier";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";
import ReviewSupplier from "./components/ReviewSupplier.vue";
import SupplierDetail from "./components/SupplierDetail.vue";
import { DataOptions } from "vuetify";

@Component({
  components: {
    Snackbar,
    ReviewSupplier,
    SupplierDetail
  }
})
export default class Supplier extends Vue {
  suppliers: Array<ISupplier> = [];
  supplier = {} as ISupplier;

  dialogDetail = false;
  dialogDel = false;
  dialogReview = false;
  loading = true;
  message = "";
  snackbar = false;
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

  @Watch("options")
  onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      getSuppliers({
        page: val.page - 1,
        limit: val.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<ISupplier> = res.data;
          console.log("watch", response);
          this.suppliers = response.data.filter(x => x.status != "PENDING");
          this.serverSideOptions.totalItems = this.suppliers.length;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
}
</script>
