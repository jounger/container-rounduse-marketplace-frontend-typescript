<template>
  <v-content>
    <v-card class="ma-5">
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
        />
      </v-row>
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
        no-data-text="Danh sách người dùng rỗng."
        disable-sort
        class="elevation-1"
      >
        <template v-slot:item.avatar="{ item }">
          <v-avatar size="35" color="indigo">
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
          <v-chip :color="item.status == 'ACTIVE' ? 'success' : 'error'" dark>{{
            item.status
          }}</v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-menu :loading="item.createloading" :disabled="item.createloading">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="primary"
                icon
                outlined
                v-bind="attrs"
                v-on="on"
                class="ml-10"
              >
                <v-icon>mdi-dots-vertical</v-icon></v-btn
              >
            </template>
            <v-list dense>
              <v-list-item @click="openDetailDialog(item)">
                <v-list-item-icon>
                  <v-icon small>edit</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Xem chi tiết</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="openReviewDialog(item)"
                v-if="item.status === 'ACTIVE'"
              >
                <v-list-item-icon>
                  <v-icon small>lock</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Khóa tài khoản</v-list-item-title>
              </v-list-item>
              <v-list-item
                @click="openReviewDialog(item)"
                v-if="item.status === 'BANNED'"
              >
                <v-list-item-icon>
                  <v-icon small>lock_open</v-icon>
                </v-list-item-icon>
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
import ReviewSupplier from "./components/ReviewSupplier.vue";
import SupplierDetail from "./components/SupplierDetail.vue";
import { DataOptions } from "vuetify";

@Component({
  components: {
    ReviewSupplier,
    SupplierDetail
  }
})
export default class Supplier extends Vue {
  suppliers: Array<ISupplier> = [];
  supplier = null as ISupplier | null;

  dialogDetail = false;
  dialogReview = false;
  loading = true;
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
    { text: "Email", value: "email" },
    { text: "Người liên hệ", value: "fullname" },
    { text: "Tên công ty", value: "companyName" },
    { text: "Mã số thuế", value: "tin" },
    { text: "Trang web", value: "website" },
    { text: "Vai trò", value: "roles" },
    { text: "Trạng thái", value: "status" },
    {
      text: "Hành động",
      value: "actions",
      sortable: false,
      align: "center"
    }
  ];

  openDetailDialog(item: ISupplier) {
    this.supplier = item;
    this.dialogDetail = true;
  }
  openReviewDialog(item: ISupplier) {
    this.supplier = item;
    this.dialogReview = true;
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getSuppliers({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _suppliers = _res.data.data as ISupplier[];
        this.suppliers = _suppliers.filter(x => x.status != "PENDING");
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
