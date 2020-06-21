<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <DialogRegisterDetail
          :dialogDetail.sync="dialogDetail"
          :supplier.sync="supplier"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-card-title>
        Danh sách đơn đăng ký
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="suppliers"
        :search="search"
        :loading="loading"
        :options.sync="options"
        :server-items-length="options.totalItems"
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
import { Component, PropSync, Watch, Vue } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import { SupplierEntity } from "../supplier-register/supplier-register";
import DialogRegisterDetail from "./components/DialogRegisterDetail.vue";
import { getSuppliers } from "../../../api/supplier-request";
import { PaginationResponse } from "../../../api/payload";
import Snackbar from "../../../components/Snackbar.vue";

@Component({
  name: "RequestUserManagement",
  components: {
    DialogRegisterDetail,
    Snackbar
  }
})
export default class RequestUserManagement extends Vue {
  @PropSync("layout") layoutSync!: object;
  suppliers: Array<SupplierEntity> = [];
  supplier: SupplierEntity = {
    username: "",
    password: "",
    email: "",
    phone: "",
    role: [],
    status: "",
    address: {
      street: "",
      county: "",
      city: "",
      country: "",
      postalCode: ""
    },
    website: "",
    contactPerson: "",
    companyName: "",
    shortName: "",
    companyDescription: "",
    tin: "",
    tax: ""
  };

  dialogDetail = false;
  loading = true;
  message = "";
  snackbar = false;
  search = "";
  options = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
    totalItems: 0,
    itemsPerPageItems: [5, 10, 15, 20]
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
  async created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }

  viewDetail(item: SupplierEntity) {
    this.dialogDetail = true;
    this.supplier = item;
  }

  @Watch("options", { deep: true })
  getOptions() {
    getSuppliers({
      page: this.options.page - 1,
      limit: this.options.itemsPerPage
    })
      .then(res => {
        const response: PaginationResponse<SupplierEntity> = res.data;
        console.log(response);
        this.suppliers = response.data;
        this.options.totalItems = response.total_elements;
      })
      .catch(err => console.log(err))
      .finally(() => (this.loading = false));
  }

  async mounted() {
    console.log("--- get supplier ----");
    getSuppliers({ page: 0, limit: 5 })
      .then(res => {
        const response: PaginationResponse<SupplierEntity> = res.data;
        this.suppliers = response.data;
        this.options.totalItems = response.total_elements;
      })
      .catch(err => console.log(err))
      .finally(() => (this.loading = false));
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
