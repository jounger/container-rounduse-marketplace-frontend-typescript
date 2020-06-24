<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách hàng nhập
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
        @click="addInbound()"
      >
        Thêm mới
      </v-btn>
      <v-row justify="center">
        <!-- <DialogDeleteInbound
          :dialogDel.sync="dialogDel"
          :inbound.sync="inbound"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <DialogCreateInbound
          :inbound.sync="inbound"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :snackbar.sync="snackbar"
        /> -->
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-data-table
        :headers="headers"
        :items="inbounds"
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
              <v-list-item @click="removeInbound(item)">
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
import { IInbound } from "@/entity/inbound";
// import DialogCreateInbound from "./components/DialogCreateInbound.vue";
// import DialogDeleteInbound from "./components/DialogDeleteInbound.vue";
// import { getInboundByForwarder } from "@/api/inbound";
// import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";
import { InboundData } from "./data";

@Component({
  components: {
    // DialogCreateInbound,
    // DialogDeleteInbound,
    Snackbar
  }
})
export default class Inbound extends Vue {
  @PropSync("layout") layoutSync!: object;

  inbounds: Array<IInbound> = [];
  inbound = {} as IInbound;
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
      text: "Mã",
      align: "start",
      value: "id"
    },
    { text: "Hãng tàu", value: "shippingLine" },
    { text: "Loại cont", value: "containerType" },
    { text: "Trạng thái", value: "status" },
    { text: "Lấy cont đặc", value: "pickUpTime" },
    // { text: "Thời gian đóng hàng", value: "billOfLading.billOfLadingNumber" },
    // { text: "Thời gian làm hàng", value: "portOfDelivery.nameCode" },
    // { text: "Thời gian tàu chạy", value: "freeTime" },
    {
      text: "Hành động",
      value: "action"
    }
  ];
  created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
    this.inbounds = InboundData as Array<IInbound>;
    this.loading = false;
  }

  addInbound() {
    this.dialogAdd = true;
  }

  viewDetail(item: IInbound) {
    this.inbound = item;
    this.dialogAdd = true;
  }

  removeInbound(item: IInbound) {
    this.inbound = item;
    this.dialogDel = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    console.log(this.$auth.user());
    if (val !== oldVal) {
      console.log(InboundData);
      this.inbounds = InboundData;
      this.loading = false;
      this.options.totalItems = 10;
      /*
      getInboundByForwarder(this.$auth.user().id, {
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IInbound> = res.data;
          console.log("watch", this.options);
          this.inbounds = response.data;
          this.options.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
        */
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
