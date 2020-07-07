<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <DeleteDiscount
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :discount="discount"
          :discounts.sync="discounts"
          :totalItems.sync="options.totalItems"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <CreateDiscount
          v-if="dialogAdd"
          :discount="discount"
          :discounts.sync="discounts"
          :dialogAdd.sync="dialogAdd"
          :totalItems.sync="options.totalItems"
          :message.sync="message"
          :snackbar.sync="snackbar"
          :update="update"
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
import Snackbar from "@/components/Snackbar.vue";
import DeleteDiscount from "./components/DeleteDiscount.vue";
import CreateDiscount from "./components/CreateDiscount.vue";
import Utils from "@/mixin/utils";

@Component({
  mixins: [Utils],
  components: {
    CreateDiscount,
    DeleteDiscount,
    Snackbar
  }
})
export default class Discount extends Vue {
  discounts: Array<IDiscount> = [];
  discount = {} as IDiscount;
  dialogAdd = false;
  dialogDel = false;
  message = "";
  snackbar = false;
  loading = true;
  update = false;
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
  openCreateDialog() {
    this.discount = {} as IDiscount;
    this.update = false;
    this.dialogAdd = true;
  }

  openUpdateDialog(item: IDiscount) {
    console.log(item);
    const index = item.expiredDate.indexOf("T");
    item.expiredDate = item.expiredDate.slice(0, index);
    this.discount = item;
    this.update = true;
    this.dialogAdd = true;
  }

  openDeleteDialog(item: IDiscount) {
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
