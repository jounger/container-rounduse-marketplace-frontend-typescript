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
        no-data-text="Danh sách đơn đăng ký rỗng."
        disable-sort
        class="elevation-1"
      >
        <template v-slot:item.status="{ item }">
          <v-chip color="orange" dark>{{ item.status }}</v-chip>
        </template>
        <template v-slot:item.action="{ item }">
          <v-menu :loading="item.createloading" :disabled="item.createloading">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                color="pink"
                icon
                outlined
                v-bind="attrs"
                v-on="on"
                class="ml-10"
              >
                <v-icon>mdi-dots-vertical</v-icon></v-btn
              >
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
  supplier = null as ISupplier | null;
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
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _suppliers = await getSuppliersByStatus({
        page: val.page - 1,
        limit: val.itemsPerPage,
        status: "PENDING"
      })
        .then(res => {
          const response: PaginationResponse<ISupplier> = res.data;
          console.log(response.data);
          return response;
        })
        .catch(err => {
          console.log(err);
          return null;
        });
      if (_suppliers) {
        this.suppliers = _suppliers.data;
        this.serverSideOptions.totalItems = _suppliers.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
