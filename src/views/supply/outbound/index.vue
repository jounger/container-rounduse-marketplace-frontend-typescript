<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách hàng
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-btn
        color="primary"
        style="margin-left: 35px;"
        dark
        @click="addOutbound()"
      >
        Thêm mới
      </v-btn>
      <v-row justify="center">
        <DeleteOutbound
          :dialogDel.sync="dialogDel"
          :outbound.sync="outbound"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <CreateOutbound
          :outbound.sync="outbound"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-data-table
        :headers="headers"
        :items="outbounds"
        item-key="id"
        :search="search"
        :loading="loading"
        :options.sync="options"
        :server-items-length="options.totalItems"
        :footer-props="{ 'items-per-page-options': options.itemsPerPageItems }"
        :actions-append="options.page"
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
              <v-list-item @click="viewDetail(item)">
                <v-list-item-title>Chi tiết</v-list-item-title>
              </v-list-item>
              <v-list-item @click="removeOutbound(item)">
                <v-list-item-title>Xóa</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, PropSync, Watch, Vue } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import { IOutbound } from "@/entity/outbound";
import CreateOutbound from "./components/CreateOutbound.vue";
import DeleteOutbound from "./components/DeleteOutbound.vue";
import { getOutboundByMerchant } from "@/api/outbound";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";

@Component({
  components: {
    CreateOutbound,
    DeleteOutbound,
    Snackbar
  }
})
export default class Outbound extends Vue {
  @PropSync("layout") layoutSync!: object;

  outbounds: Array<IOutbound> = [];
  outbound = {} as IOutbound;
  dialogAdd = false;
  dialogDel = false;
  search = "";
  message = "";
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
      text: "Mã hàng",
      align: "start",
      sortable: true,
      value: "merchantId"
    },
    { text: "Mã booking", value: "bookingNumber" },
    { text: "Loại hàng", value: "categoryList" },
    { text: "Hãng tàu", value: "shippingLine" },
    { text: "Bến cảng", value: "portOfLoading" },
    { text: "Thời gian đóng hàng", value: "packingTime" },
    { text: "Thời gian làm hàng", value: "laytime" },
    { text: "Thời gian tàu chạy", value: "cutOffTime" },
    { text: "Loại cont", value: "containerType" },
    { text: "Khối lượng", value: "payload" },
    { text: "Đơn vị", value: "unitOfMeasurement" },
    { text: "Full container loaded", value: "fcl" },
    { text: "Trạng thái", value: "status" },
    {
      text: "Hành động",
      value: "action"
    }
  ];
  created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }

  addOutbound() {
    this.dialogAdd = true;
  }

  viewDetail(item: IOutbound) {
    this.outbound = item;
    this.dialogAdd = true;
  }

  removeOutbound(item: IOutbound) {
    this.outbound = item;
    this.dialogDel = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    console.log(this.$auth.user());
    if (val !== oldVal) {
      getOutboundByMerchant(this.$auth.user().id, {
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IOutbound> = res.data;
          console.log("watch", this.options);
          this.outbounds = response.data;
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
