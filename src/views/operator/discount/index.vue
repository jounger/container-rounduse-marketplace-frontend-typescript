<template>
  <v-container fluid>
    <v-card>
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
        no-data-text="Danh sách mã giảm giá rỗng."
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
        <template v-slot:item.maximumDiscount="{ item }">
          {{ item.maximumDiscount + " " + item.currency }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-menu :close-on-click="true">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" icon outlined v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="openUpdateDialog(item)">
                <v-list-item-icon>
                  <v-icon small>edit</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Chỉnh sửa</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="openDeleteDialog(item)">
                <v-list-item-icon>
                  <v-icon small>delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xóa bỏ</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
    <v-row justify="center">
      <DeleteDiscount
        v-if="dialogDel"
        :dialogDel.sync="dialogDel"
        :discount="discount"
        :discounts.sync="discounts"
        :totalItems.sync="serverSideOptions.totalItems"
      />
      <CreateDiscount
        v-if="dialogAdd"
        :discount="discount"
        :discounts.sync="discounts"
        :dialogAdd.sync="dialogAdd"
        :totalItems.sync="serverSideOptions.totalItems"
        :update="update"
      />
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IDiscount } from "@/entity/discount";
import { getDiscounts } from "@/api/discount";
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
  discount = null as IDiscount | null;
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
    { text: "Giảm (%)", value: "percent" },
    { text: "Giảm nhiều nhất", value: "maximumDiscount" },
    { text: "Chi tiết", value: "detail" },
    { text: "Ngày hết hạn", value: "expired" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];
  openCreateDialog() {
    this.update = false;
    this.dialogAdd = true;
  }

  openUpdateDialog(item: IDiscount) {
    this.discount = item;
    this.update = true;
    this.dialogAdd = true;
  }

  openDeleteDialog(item: IDiscount) {
    this.discount = item;
    this.dialogDel = true;
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getDiscounts({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _discounts = _res.data.data;
        this.discounts = _discounts;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
