<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách ICD
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-btn color="primary" style="margin-left: 35px;" dark @click="addIcd()">
        Thêm mới
      </v-btn>
      <v-row justify="center">
        <DialogDeleteIcd
          :dialogDel.sync="dialogDel"
          :icd.sync="icd"
          :icds.sync="icds"
          :options.sync="options"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <DialogCreateIcd
          :icd.sync="icd"
          :icds.sync="icds"
          :options.sync="options"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-data-table
        :headers="headers"
        :items="icds"
        item-key="nameCode"
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
              <v-list-item @click="removeIcd(item)">
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
import { IIcd } from "@/entity/icd";
import { getIcds } from "@/api/icd";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";
import DialogCreateIcd from "./components/DialogCreateICD.vue";
import DialogDeleteIcd from "./components/DialogDeleteICD.vue";

@Component({
  components: {
    DialogCreateIcd,
    DialogDeleteIcd,
    Snackbar
  }
})
export default class Icd extends Vue {
  @PropSync("layout") layoutSync!: object;
  icds: Array<IIcd> = [];
  icd: IIcd = {
    fullname: "",
    nameCode: "",
    address: ""
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
      text: "Mã code",
      align: "start",
      sortable: true,
      value: "nameCode"
    },
    { text: "Tên ICD", value: "fullname" },
    { text: "Địa chỉ", value: "address" },
    {
      text: "Hành động",
      value: "action"
    }
  ];
  created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }

  addIcd() {
    this.icd = {
      fullname: "",
      nameCode: "",
      address: ""
    };
    this.dialogAdd = true;
  }

  viewDetail(item: IIcd) {
    this.icd = item;
    this.dialogAdd = true;
  }

  removeIcd(item: IIcd) {
    this.icd = item;
    this.dialogDel = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    if (val !== oldVal) {
      getIcds({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IIcd> = res.data;
          console.log("watch", this.options);
          this.icds = response.data;
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
