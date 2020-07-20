<template>
  <v-content>
    <v-card class="ma-5">
      <v-row justify="center">
        <DeleteDiscount
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :discount="discount"
          :discounts.sync="discounts"
          :totalItems.sync="serverSideOptions.totalItems"
        />
      </v-row>
      <v-row justify="center">
        <CreateDiscount
          v-if="dialogAdd"
          :discount="discount"
          :discounts.sync="discounts"
          :dialogAdd.sync="dialogAdd"
          :totalItems.sync="serverSideOptions.totalItems"
          :update="update"
        />
      </v-row>
      <v-data-table
        :headers="headers"
        :items="discounts"
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
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title style="font-weight:bold; font-size: 25px;"
              >Danh sách mã giảm giá</v-toolbar-title
            >
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" @click="openCreateDialog()"
              >Thêm mới</v-btn
            >
          </v-toolbar>
        </template>
        <template v-slot:item.expired="{ item }">
          {{ formatDatetime(item.expiredDate) }}
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
import { IDiscount } from "@/entity/discount";
import { getDiscounts } from "@/api/discount";
import { PaginationResponse } from "@/api/payload";
import DeleteDiscount from "./components/DeleteDiscount.vue";
import CreateDiscount from "./components/CreateDiscount.vue";
import Utils from "@/mixin/utils";
import { DataOptions } from "vuetify";

@Component({
  mixins: [Utils],
  components: {
    CreateDiscount,
    DeleteDiscount
  }
})
export default class Discount extends Vue {
  discounts: Array<IDiscount> = [];
  discount = {} as IDiscount;
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
      text: "Mã giảm giá",
      align: "start",
      sortable: true,
      value: "code"
    },
    { text: "Chi tiết", value: "detail" },
    { text: "Loại tiền tệ", value: "currency" },
    { text: "Phần trăm", value: "percent" },
    { text: "Giảm giá nhiều nhất", value: "maximumDiscount" },
    { text: "Ngày hết hạn", value: "expired" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];
  openCreateDialog() {
    this.discount = {} as IDiscount;
    this.update = false;
    this.dialogAdd = true;
  }

  openUpdateDialog(item: IDiscount) {
    console.log(item);
    this.discount = item;
    this.update = true;
    this.dialogAdd = true;
  }

  openDeleteDialog(item: IDiscount) {
    this.discount = item;
    this.dialogDel = true;
  }

  @Watch("options")
  onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      getDiscounts({
        page: val.page - 1,
        limit: val.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IDiscount> = res.data;
          console.log("watch", response);
          this.discounts = response.data;
          this.serverSideOptions.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
}
</script>
