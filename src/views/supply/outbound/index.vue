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
        @click="addConsignment()"
      >
        Thêm mới
      </v-btn>
      <v-row justify="center">
        <DialogDeleteConsignment
          :dialogDel.sync="dialogDel"
          :consignment.sync="consignment"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <DialogCreateConsignment
          :consignment.sync="consignment"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-data-table
        :headers="headers"
        :items="consignments"
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
              <v-list-item @click="removeConsignment(item)">
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
import { IConsignment } from "@/entity/consignment";
import DialogCreateConsignment from "./components/DialogCreateConsignment.vue";
import DialogDeleteConsignment from "./components/DialogDeleteConsignment.vue";
import { getConsignmentByMerchant } from "@/api/consignment";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";

@Component({
  components: {
    DialogCreateConsignment,
    DialogDeleteConsignment,
    Snackbar
  }
})
export default class Consignment extends Vue {
  @PropSync("layout") layoutSync!: object;

  consignments: Array<IConsignment> = [];
  consignment: IConsignment = {
    merchantId: "",
    categories: new Set("abc"),
    packingTime: "",
    packingStation: {
      street: "",
      county: "",
      city: "",
      country: "",
      postalCode: ""
    },
    bookingNumber: "",
    cutOffTime: "",
    laytime: "",
    payload: 0,
    unitOfMeasurement: "KG",
    portOfLoading: "",
    fcl: true,
    shippingLine: "",
    containerType: "",
    status: ""
  };
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

  addConsignment() {
    this.consignment = {
      merchantId: "",
      categories: new Set("abc"),
      packingTime: "2020-06-23T20:20",
      packingStation: {
        street: "abc",
        county: "xyz",
        city: "Hà Nội",
        country: "VN",
        postalCode: "03132"
      },
      bookingNumber: "12356",
      cutOffTime: "2020-06-27T20:20",
      laytime: "2020-06-23T20:20",
      payload: 2000,
      unitOfMeasurement: "KG",
      portOfLoading: "HAIPHONGPORT",
      fcl: true,
      shippingLine: "apl",
      containerType: "40HC",
      status: "CREATED"
    };
    this.dialogAdd = true;
  }

  viewDetail(item: IConsignment) {
    this.consignment = item;
    this.dialogAdd = true;
  }

  removeConsignment(item: IConsignment) {
    this.consignment = item;
    this.dialogDel = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    console.log(this.$auth.user());
    if (val !== oldVal) {
      getConsignmentByMerchant(this.$auth.user().id, {
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IConsignment> = res.data;
          console.log("watch", this.options);
          this.consignments = response.data;
          this.options.totalItems = response.total_elements;
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
