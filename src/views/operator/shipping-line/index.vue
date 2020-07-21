<template>
  <v-content>
    <v-card class="ma-5">
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
        disable-sort
        class="elevation-1"
      >
        <!--  -->
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
        <template v-slot:item.actions="{ item }">
          <v-menu :close-on-click="true">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="pink" icon outlined v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
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
                  <v-list-item-title>Xóa</v-list-item-title>
                </v-list-item-content>
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
import { IShippingLine } from "@/entity/shipping-line";
import { getShippingLines } from "@/api/shipping-line";
import { PaginationResponse } from "@/api/payload";
import CreateShippingLine from "./components/CreateShippingLine.vue";
import DeleteShippingLine from "./components/DeleteShippingLine.vue";
import UpdateShippingLine from "./components/UpdateShippingLine.vue";
import { DataOptions } from "vuetify";

@Component({
  components: {
    CreateShippingLine,
    DeleteShippingLine,
    UpdateShippingLine
  }
})
export default class ShippingLine extends Vue {
  shippingLines: Array<IShippingLine> = [];
  shippingLine = {} as IShippingLine;

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
      text: "Tên đăng nhập",
      value: "username"
    },
    { text: "Email", value: "email" },
    { text: "Trạng thái", value: "status" },
    { text: "Phân quyền", value: "roles" },
    {
      text: "Hành động",
      value: "actions",
      sortable: false,
      align: "center"
    }
  ];
  openUpdateDialog(item: IShippingLine) {
    console.log(item);
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
      const _shippingLines = await getShippingLines({
        page: val.page - 1,
        limit: val.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IShippingLine> = res.data;
          console.log("watch", response);
          return response;
        })
        .catch(err => {
          console.log(err);
          return null;
        });
      if (_shippingLines) {
        this.shippingLines = _shippingLines.data;
        this.serverSideOptions.totalItems = _shippingLines.totalElements;
      }
      this.loading = false;
    }
  }

  @Watch("shippingLine", { deep: true })
  onShippingLineChange(val: IShippingLine, oldVal: IShippingLine) {
    if (val.status !== oldVal.status) {
      const index = this.shippingLines.findIndex(
        x => x.id === this.shippingLine.id
      );
      this.shippingLines.splice(index, 1, val);
    }
  }
}
</script>
