<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="shippingLines"
        item-key="id"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
        no-data-text="Danh sách hãng tàu rỗng."
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Danh sách hãng tàu</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" @click="dialogAdd = true">
              Thêm mới
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item.status="{ item }">
          <ChipStatus :status="item.status" />
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
    <CreateShippingLine
      v-if="dialogAdd"
      :shippingLines.sync="shippingLines"
      :dialogAdd.sync="dialogAdd"
      :totalItems.sync="serverSideOptions.totalItems"
    />
    <UpdateShippingLine
      v-if="dialogEdit"
      :shippingLine="shippingLine"
      :shippingLines.sync="shippingLines"
      :dialogEdit.sync="dialogEdit"
    />
    <v-row justify="center">
      <DeleteShippingLine
        v-if="dialogDel"
        :dialogDel.sync="dialogDel"
        :shippingLine="shippingLine"
        :shippingLines.sync="shippingLines"
        :totalItems.sync="serverSideOptions.totalItems"
      />
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IShippingLine } from "@/entity/shipping-line";
import { getShippingLines } from "@/api/shipping-line";
import CreateShippingLine from "./components/CreateShippingLine.vue";
import DeleteShippingLine from "./components/DeleteShippingLine.vue";
import UpdateShippingLine from "./components/UpdateShippingLine.vue";
import { DataOptions } from "vuetify";
import ChipStatus from "@/components/ChipStatus.vue";

@Component({
  components: {
    CreateShippingLine,
    DeleteShippingLine,
    UpdateShippingLine,
    ChipStatus
  }
})
export default class ShippingLine extends Vue {
  shippingLines: Array<IShippingLine> = [];
  shippingLine = null as IShippingLine | null;

  dialogAdd = false;
  dialogDel = false;
  dialogEdit = false;
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
      text: "Tên đăng nhập",
      value: "username"
    },
    { text: "Email", value: "email" },
    { text: "Người liên hệ", value: "fullname" },
    { text: "Tên công ty", value: "companyName" },
    { text: "Mã số thuế", value: "tin" },
    { text: "Trang web", value: "website" },
    { text: "Trạng thái", value: "status" },
    { text: "Hành động", value: "actions" }
  ];
  openUpdateDialog(item: IShippingLine) {
    this.shippingLine = item;
    this.dialogEdit = true;
  }
  openDeleteDialog(item: IShippingLine) {
    this.shippingLine = item;
    this.dialogDel = true;
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getShippingLines({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _shippingLines = _res.data.data;
        this.shippingLines = _shippingLines;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
