<template>
  <v-content>
    <v-card class="ma-5">
      <v-row justify="center">
        <RegisterDetail
          v-if="dialogDetail"
          :dialogDetail.sync="dialogDetail"
          :supplier="supplier"
          :suppliers.sync="suppliers"
          :totalItems.sync="serverSideOptions.totalItems"
        />
      </v-row>
      <v-card-title>
        Danh sách đơn đăng ký
      </v-card-title>
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
        disable-sort
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
import { getSuppliersByStatus } from "@/api/supplier";
import { PaginationResponse } from "@/api/payload";
import RegisterDetail from "./components/RegisterDetail.vue";
import { DataOptions } from "vuetify";

@Component({
  components: {
    RegisterDetail
  }
})
export default class Supplier extends Vue {
  suppliers: Array<ISupplier> = [];
  supplier = {} as ISupplier;

  dialogDetail = false;
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

  @Watch("options")
  onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      getSuppliersByStatus({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage,
        status: "PENDING"
      })
        .then(res => {
          const response: PaginationResponse<ISupplier> = res.data;
          console.log(response.data);
          this.suppliers = response.data;
          this.serverSideOptions.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
}
</script>
