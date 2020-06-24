<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <DeleteDiscount
          :dialogDel.sync="dialogDel"
          :discount.sync="discount"
          :discounts.sync="discounts"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <CreateDiscount
          :discount.sync="discount"
          :discounts.sync="discounts"
          :dialogAdd.sync="dialogAdd"
          :expiredDate.sync="expiredDate"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-data-table
        :headers="headers"
        :items="discounts"
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
              >Danh sách vai trò</v-toolbar-title
            >
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" @click="addDiscount()"
              >Thêm mới</v-btn
            >
          </v-toolbar>
        </template>
        <template v-slot:item.expired="{ item }">
          {{ convertExpiredDate(item.expiredDate) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="viewDetail(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="removeDiscount(item)">
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
import { IDiscount } from "@/entity/discount";
import { getDiscounts } from "@/api/discount";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";
import DeleteDiscount from "./components/DeleteDiscount.vue";
import CreateDiscount from "./components/CreateDiscount.vue";

@Component({
  components: {
    CreateDiscount,
    DeleteDiscount,
    Snackbar
  }
})
export default class Discount extends Vue {
  @PropSync("layout") layoutSync!: object;
  discounts: Array<IDiscount> = [];
  discount = {} as IDiscount;
  dialogAdd = false;
  dialogDel = false;
  search = "";
  message = "";
  expiredDate = "";
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
  created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }
  convertExpiredDate(expiredDate: string) {
    const index = expiredDate.indexOf("T");
    return (
      expiredDate.slice(0, index) +
      " " +
      expiredDate.slice(index + 1, expiredDate.length)
    );
  }
  addDiscount() {
    this.discount = {} as IDiscount;
    this.expiredDate = "";
    this.dialogAdd = true;
  }

  viewDetail(item: IDiscount) {
    const index = item.expiredDate.indexOf("T");
    this.expiredDate = item.expiredDate.slice(0, index);
    this.discount = item;
    this.dialogAdd = true;
  }

  removeDiscount(item: IDiscount) {
    this.discount = item;
    this.dialogDel = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    if (val !== oldVal) {
      getDiscounts({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IDiscount> = res.data;
          console.log("watch", response);
          this.discounts = response.data;
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