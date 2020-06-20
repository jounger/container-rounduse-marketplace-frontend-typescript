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
        <v-dialog v-model="dialogDetail" persistent max-width="600px">
          <v-card>
            <v-toolbar color="primary" light flat>
              <v-toolbar-title
                ><span class="headline" style="color:white;"
                  >Chi tiết đơn đăng ký</span
                >
                <v-btn
                  icon
                  dark
                  @click="dialogDetail = false"
                  style="margin-left:308px;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-title
              >
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Tên đăng nhập"
                        name="username"
                        prepend-icon="mdi-account"
                        type="text"
                        v-model="username"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Email"
                        name="email"
                        prepend-icon="mdi-lock"
                        type="text"
                        v-model="email"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Số điện thoại"
                        name="phone"
                        prepend-icon="mdi-lock"
                        type="number"
                        v-model="phone"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Phân quyền"
                        name="role"
                        prepend-icon="mdi-lock"
                        type="text"
                        v-model="role"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Quốc gia"
                        name="country"
                        prepend-icon="mdi-lock"
                        type="text"
                        v-model="country"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Tỉnh"
                        name="city"
                        prepend-icon="mdi-lock"
                        type="text"
                        v-model="city"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs4>
                      <v-text-field
                        label="Mã code"
                        name="code"
                        prepend-icon="mdi-lock"
                        type="text"
                        v-model="code"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs10>
                      <v-text-field
                        label="Địa chỉ chi tiết"
                        name="address"
                        prepend-icon="mdi-lock"
                        type="text"
                        v-model="address"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="dialogDetail = false">Trở về</v-btn>
              <v-btn @click="destroy()" color="red">Hủy bỏ</v-btn>
              <v-btn @click="approve()" color="primary">Cho phép</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="dialogConfirm" persistent max-width="600px">
          <v-card>
            <v-toolbar color="primary" light flat>
              <v-toolbar-title
                ><span class="headline" style="color:white;">{{ title }}</span>
                <v-btn
                  icon
                  dark
                  @click="dialoConfirm = false"
                  style="margin-left:403px;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-title
              >
            </v-toolbar>

            <v-card-text>
              <v-form>
                <v-container>
                  <span style="color: black; font-size:22px;"
                    >Bạn có chắc chắn muốn {{ status }} đơn đăng ký này?</span
                  >
                  <v-list>
                    <v-list-item v-for="(item, i) in selected" :key="i">
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.username"
                        ></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-container>
                <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions style="margin-left: 205px;">
              <v-btn @click="cancelConfirm()">Trở về</v-btn>
              <v-btn @click="del()" color="red" v-if="checkDestroy"
                >Hủy bỏ</v-btn
              >
              <v-btn @click="accept()" color="green" v-if="checkAcc"
                >Chấp nhận</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
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
import { UserEntity } from "@/store/definitions/user";
import data from "../supplier-register/data";
import { SupplierRegister } from "../supplier-register/supplier-register";

@Component({
  name: "RequestUserManagement",
  components: {}
})
export default class RequestUserManagement extends Vue {
  @PropSync("layout") layoutSync!: object;
  username = "";
  password = "";
  email = "";
  phone = "";
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
  public del() {
    this.success = "Thành công!";
    this.checkSuccess = true;
    this.dialogConfirm = false;
    this.dialogDetail = false;
    this.title = "";
    this.status = "";
  }
  public accept() {
    this.success = "Thành công!";
    this.checkSuccess = true;
    this.dialogConfirm = false;
    this.dialogDetail = false;
    this.title = "";
    this.status = "";
  }
  public cancelConfirm() {
    this.dialogConfirm = false;
    this.title = "";
    this.status = "";
  }
  public viewDetail(item: SupplierRegister) {
    this.username = item.username;
    this.email = item.email;
    this.phone = item.phone;
    this.role = item.roles;
    this.country = item.country;
    this.city = item.city;
    this.code = item.postalCode;
    this.address = item.address;
    this.readonly = true;
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
