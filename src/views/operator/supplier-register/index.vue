<template>
  <v-container fluid>
    <v-row justify="center">
      <ConfirmReviewSupplier
        v-if="dialogConfirm"
        :dialogConfirm.sync="dialogConfirm"
        :suppliers.sync="suppliers"
        :supplier.sync="supplier"
        :status="status"
      />
      <SupplierDetail
        v-if="dialogDetail"
        :dialogDetail.sync="dialogDetail"
        :supplier="supplier"
      />
    </v-row>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="suppliers"
        item-key="id"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
        no-data-text="Danh sách đơn đăng ký rỗng."
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Danh sách đơn đăng ký</v-toolbar-title>
          </v-toolbar>
        </template>
        <template v-slot:item.status="{ item }">
          <ChipStatus :status="item.status" />
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
                  <v-icon small>remove_red_eye</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xem chi tiết</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="openConfirmDialog(item, true)">
                <v-list-item-icon>
                  <v-icon small>add</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Đồng ý đơn</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="openConfirmDialog(item, false)">
                <v-list-item-icon>
                  <v-icon small>delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Từ chối đơn</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { ISupplier } from "@/entity/supplier";
import { getSuppliersByStatus } from "@/api/supplier";
import { DataOptions } from "vuetify";
import ConfirmReviewSupplier from "./components/ConfirmReviewSupplier.vue";
import SupplierDetail from "../supplier/components/SupplierDetail.vue";
import ChipStatus from "@/components/ChipStatus.vue";

@Component({
  components: {
    SupplierDetail,
    ConfirmReviewSupplier,
    ChipStatus
  }
})
export default class Supplier extends Vue {
  suppliers: Array<ISupplier> = [];
  supplier = null as ISupplier | null;
  dialogDetail = false;
  dialogConfirm = false;
  loading = true;
  status = false;
  options = {
    page: 1,
    itemsPerPage: 10
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
      value: "username"
    },
    { text: "Email", value: "email" },
    { text: "Người liên hệ", value: "fullname" },
    { text: "Tên công ty", value: "companyName" },
    { text: "Mã số thuế", value: "tin" },
    { text: "Trang web", value: "website" },
    { text: "Vai trò", value: "roles" },
    { text: "Trạng thái", value: "status" },
    { text: "Hành động", value: "actions" }
  ];

  openDetailDialog(item: ISupplier) {
    this.supplier = item;
    this.dialogDetail = true;
  }

  openConfirmDialog(item: ISupplier, status: boolean) {
    this.supplier = item;
    this.status = status;
    this.dialogConfirm = true;
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getSuppliersByStatus({
        page: val.page - 1,
        limit: val.itemsPerPage,
        status: "PENDING"
      });
      if (_res.data) {
        const _suppliers = _res.data.data;
        this.suppliers = _suppliers;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
