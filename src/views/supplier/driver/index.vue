<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách lái xe
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
        @click.stop="addDriver"
        v-if="$auth.check(['ROLE_FORWARDER'])"
      >
        Thêm mới
      </v-btn>
      <v-row justify="center">
        <DeleteDriver
          :dialogDel.sync="dialogDel"
          :checkSuccess.sync="checkSuccess"
          :success.sync="success"
          :name="name"
        />
      </v-row>
      <v-row justify="center">
        <CreateDriver
          :driver.sync="driver"
          :title="title"
          :dialogAdd.sync="dialogAdd"
          :checkSuccess.sync="checkSuccess"
          :checkAdd="checkAdd"
          :checkUpdate="checkUpdate"
          :success.sync="success"
          :readonly="readonly"
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
        :items="drivers"
        :search="search"
        item-key="driverLicense"
        :options.sync="options"
        :server-items-length="totalDrivers"
        :loading="loading"
        :items-per-page="5"
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
              <v-list-item @click="update(item)">
                <v-list-item-title>Cập nhập</v-list-item-title>
              </v-list-item>
              <v-list-item @click="delDriver(item)">
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
import data from "../driver/data";
import { Driver } from "../driver/driver";
import DeleteDriver from "./components/DeleteDriver.vue";
import CreateDriver from "./components/CreateDriver.vue";

@Component({
  name: "DriverManagement",
  components: {
    DeleteDriver,
    CreateDriver
  }
})
export default class DriverManagement extends Vue {
  @PropSync("layout") layoutSync!: object;
  driverName = "";
  driverLicense = "";
  location = "";
  success = "";
  driver: Driver = {
    driverName: "",
    driverLicense: "",
    location: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    role: ["ROLE_DRIVER"],
    status: "ACTIVE"
  };
  checkSuccess = false;
  dialogAdd = false;
  dialogDel = false;
  checkAdd = false;
  checkUpdate = false;
  title = "";
  name = "";
  search = "";
  readonly = false;
  totalDrivers = 0;
  drivers = [] as Array<Driver>;
  loading = true;
  options = {} as any;
  headers = [
    {
      text: "Tên lái xe",
      align: "start",
      sortable: true,
      value: "driverName"
    },
    { text: "Số bằng lái", value: "driverLicense" },
    { text: "Vị trí hiện tại", value: "location" },
    {
      text: "Hành động",
      value: "action"
    }
  ];
  async created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }
  @Watch("options", { deep: true })
  getOptions() {
    this.getDataFromApi().then((data: any) => {
      this.drivers = data.items;
      this.totalDrivers = data.total;
    });
  }
  async mounted() {
    this.getDataFromApi().then((data: any) => {
      this.drivers = data.items;
      this.totalDrivers = data.total;
    });
  }
  public getDataFromApi() {
    console.log(this.options);
    this.loading = true;
    return new Promise((resolve, reject) => {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let items = this.getDrivers();
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
  public getDrivers(): Array<Driver> {
    return data;
  }
  public submit() {
    this.success = "Thêm mới thành công!";
    this.checkSuccess = true;
    this.dialogAdd = false;
  }
  public cancel() {
    this.checkAdd = false;
    this.checkUpdate = false;
    this.readonly = false;
    this.dialogAdd = false;
  }
  public viewDetail(item: Driver) {
    this.driver = item;
    this.checkAdd = false;
    this.checkUpdate = false;
    this.title = "Thông tin lái xe";
    this.readonly = true;
    this.dialogAdd = true;
  }
  public update(item: Driver) {
    this.driver = item;
    this.checkAdd = false;
    this.checkUpdate = true;
    this.title = "Cập nhập lái xe";
    this.readonly = false;
    this.dialogAdd = true;
  }
  public delDriver(item: Driver) {
    this.name = item.driverName;
    this.dialogDel = true;
  }
  public delSingle(name: string) {
    this.drivers = this.drivers.filter(
      (driver: Driver) => driver.driverName != name
    );
    this.success = "Xóa thành công";
    this.checkSuccess = true;
  }
  public cancelDelSingle() {
    this.name = "";
  }
  public addDriver() {
    this.title = "Thêm mới Lái xe";
    this.driver = {
      driverName: "",
      driverLicense: "",
      location: "",
      username: "",
      password: "",
      email: "",
      phone: "",
      role: ["ROLE_DRIVER"],
      status: "ACTIVE"
    };
    this.checkAdd = true;
    this.checkUpdate = false;
    this.readonly = false;
    this.dialogAdd = true;
  }
  public updateDriver() {
    this.success = "Cập nhập thành công";
    this.checkSuccess = true;
    this.dialogAdd = false;
  }
  public del() {
    this.success = "Xóa thành công!";
    this.checkSuccess = true;
    this.dialogDel = false;
  }
  public cancelDel() {
    this.dialogDel = false;
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
