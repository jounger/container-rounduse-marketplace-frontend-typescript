<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách hãng tàu
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
        @click.stop="addShippingLine"
        v-if="$auth.check(['ROLE_MODERATOR'])"
      >
        Thêm mới
      </v-btn>
      <v-row justify="center">
        <DeleteShippingLine
          :dialogDel.sync="dialogDel"
          :checkSuccess.sync="checkSuccess"
          :success.sync="success"
          :name="name"
        />
      </v-row>
      <v-row justify="center">
        <CreateShippingLine
          :shippingLine.sync="shippingLine"
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
        :items="ships"
        :search="search"
        item-key="namecode"
        :options.sync="options"
        :server-items-length="totalShips"
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
              <v-list-item @click="delShippingLine(item)">
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
import data from "../shipping-line/data";
import { ShippingLineEntity } from "./shipping-line";
import DeleteShippingLine from "./components/DeleteShippingLine.vue";
import CreateShippingLine from "./components/CreateShippingLine.vue";

@Component({
  name: "ShippingLineManagement",
  components: {
    DeleteShippingLine,
    CreateShippingLine
  }
})
export default class ShippingLineManagement extends Vue {
  @PropSync("layout") layoutSync!: object;

  success = "";
  name = "";
  checkSuccess = false;
  dialogAdd = false;
  dialogDel = false;
  readonly = false;
  checkAdd = false;
  checkUpdate = false;
  shippingLine: ShippingLineEntity = {
    username: "",
    password: "",
    email: "",
    phone: "",
    role: ["ROLE_SHIPPINGLINE"],
    status: "ACTIVE",
    shipName: "",
    nameCode: "",
    website: "",
    icds: [""],
    address: ""
  };
  search = "";
  title = "";
  totalShips = 0;
  ships = [] as Array<ShippingLineEntity>;
  loading = true;
  options = {} as any;
  headers = [
    {
      text: "Tên đăng nhập",
      align: "start",
      sortable: true,
      value: "username"
    },
    { text: "Tên hãng tàu", value: "shipName" },
    { text: "Mã tên", value: "nameCode" },
    { text: "Email", value: "email" },
    { text: "Website", value: "website" },
    { text: "Số điện thoại", value: "phone" },
    { text: "ICD", value: "icds" },
    { text: "Địa chỉ", value: "address" },
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
      this.ships = data.items;
      this.totalShips = data.total;
    });
  }
  async mounted() {
    this.getDataFromApi().then((data: any) => {
      this.ships = data.items;
      this.totalShips = data.total;
    });
  }
  public getDataFromApi() {
    console.log(this.options);
    this.loading = true;
    return new Promise((resolve, reject) => {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let items = this.getShips();
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
  public getShips(): Array<ShippingLineEntity> {
    return data;
  }
  public viewDetail(item: ShippingLineEntity) {
    this.shippingLine = item;
    this.checkAdd = false;
    this.checkUpdate = false;
    this.title = "Thông tin hãng tàu";
    this.readonly = true;
    this.dialogAdd = true;
  }
  public update(item: ShippingLineEntity) {
    this.shippingLine = item;
    this.checkAdd = false;
    this.checkUpdate = true;
    this.title = "Cập nhập hãng tàu";
    this.readonly = false;
    this.dialogAdd = true;
  }
  public addShippingLine() {
    this.title = "Thêm mới hãng tàu";
    this.shippingLine = {
      username: "",
      password: "",
      email: "",
      phone: "",
      role: ["ROLE_SHIPPINGLINE"],
      status: "ACTIVE",
      shipName: "",
      nameCode: "",
      website: "",
      icds: [""],
      address: ""
    };
    this.checkAdd = true;
    this.checkUpdate = false;
    this.readonly = false;
    this.dialogAdd = true;
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
