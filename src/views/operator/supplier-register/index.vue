<template>
  <v-content>
    <v-card>
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
      <v-row justify="center">
        <SupplierRegisterDetail
          :dialogDetail.sync="dialogDetail"
          :supplier.sync="supplier"
          :checkSuccess.sync="checkSuccess"
          :sucess.sync="success"
        />
      </v-row>
      <v-alert
        v-model="checkSuccess"
        dismissible
        close-icon="mdi-delete"
        type="success"
      >
        {{ success }}
      </v-alert>
      <v-data-table
        :headers="headers"
        :items="requests"
        :search="search"
        :options.sync="options"
        :server-items-length="totalRequests"
        :loading="loading"
        :items-per-page="5"
        :sort-by="['username']"
        :sort-asc="[true]"
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
import data from "../supplier-register/data";
import { SupplierRegister } from "../supplier-register/supplier-register";
import DialogConfirm from "./components/DialogConfirm.vue";
import SupplierRegisterDetail from "./components/SupplierRegisterDetail.vue";

@Component({
  name: "RequestUserManagement",
  components: {
    SupplierRegisterDetail
  }
})
export default class RequestUserManagement extends Vue {
  @PropSync("layout") layoutSync!: object;
  username = "";
  password = "";
  email = "";
  phone = "";
  name = "";
  supplier: SupplierRegister = {
    username: "",
    password: "",
    email: "",
    phone: "",
    role: [""],
    status: "",
    postalCode: "",
    country: "",
    city: "",
    address: ""
  };
  dialogConfirm = false;
  checkDestroy = false;
  checkAcc = false;
  readonly = false;
  role = "";
  country = "";
  city = "";
  address = "";
  code = "";
  success = "";
  title = "";
  status = "";
  checkSuccess = false;
  dialogDetail = false;
  search = "";
  totalRequests = 0;
  requests = [] as Array<SupplierRegister>;
  loading = true;
  options = {} as any;
  headers = [
    {
      text: "Tên đăng nhập",
      align: "start",
      sortable: true,
      searchable: true,
      value: "username"
    },
    { text: "Email", value: "email" },
    { text: "Số điện thoại", value: "phone" },
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
  @Watch("options", { deep: true })
  getOptions() {
    this.getDataFromApi().then((data: any) => {
      this.requests = data.items;
      this.totalRequests = data.total;
    });
  }
  async mounted() {
    this.getDataFromApi().then((data: any) => {
      this.requests = data.items;
      this.totalRequests = data.total;
    });
  }
  public getDataFromApi() {
    console.log(this.options);
    this.loading = true;
    return new Promise((resolve, reject) => {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let items = this.getRequests();
      const total = items.length;

      if (sortBy.length === 1 && sortDesc.length === 1) {
        items = items.sort((a: any, b: any) => {
          const sortA = a[sortBy[0]];
          const sortB = b[sortBy[0]];

          if (sortDesc[0]) {
            if (sortA < sortB) return 1;
            if (sortA > sortB) return -1;
            return 0;
          } else {
            if (sortA < sortB) return -1;
            if (sortA > sortB) return 1;
            return 0;
          }
        });
      }

      if (itemsPerPage > 0) {
        items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
      }

      setTimeout(() => {
        this.loading = false;
        resolve({
          items,
          total
        });
      }, 1000);
    });
  }
  public getRequests(): Array<SupplierRegister> {
    return data;
  }
  public approve() {
    this.checkAcc = true;
    this.checkDestroy = false;
    this.title = "Xác nhận kiểm duyệt";
    this.status = "chấp nhận";
    this.dialogConfirm = true;
  }
  public cancel() {
    this.dialogDetail = false;
  }
  public destroy() {
    this.checkDestroy = true;
    this.checkAcc = false;
    this.title = "Xác nhận hủy bỏ";
    this.status = "hủy bỏ";
    this.dialogConfirm = true;
  }

  public viewDetail(item: SupplierRegister) {
    this.supplier = item;
    this.dialogDetail = true;
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
