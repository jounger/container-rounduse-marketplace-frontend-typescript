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
import { IShippingLine } from "@/entity/shipping-line";
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
  shippingLine = {} as IShippingLine;
  search = "";
  title = "";
  totalShips = 0;
  ships = [] as Array<IShippingLine>;
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
