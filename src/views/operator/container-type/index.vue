<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách loại Container
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
        @click="addContainerType()"
      >
        Thêm mới
      </v-btn>
      <v-row justify="center">
        <DialogDeleteContainerType
          :dialogDel.sync="dialogDel"
          :containerType.sync="containerType"
          :containerTypes.sync="containerTypes"
          :options.sync="options"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <DialogCreateContainerType
          :containerType.sync="containerType"
          :containerTypes.sync="containerTypes"
          :options.sync="options"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-data-table
        :headers="headers"
        :items="containerTypes"
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
              <v-list-item @click="removeContainerType(item)">
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
import { IContainerType } from "@/entity/container-type";
import { getContainerTypes } from "@/api/container-type";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";
import DialogCreateContainerType from "./components/CreateContainerType.vue";
import DialogDeleteContainerType from "./components/DeleteContainerType.vue";

@Component({
  components: {
    DialogCreateContainerType,
    DialogDeleteContainerType,
    Snackbar
  }
})
export default class ContainerType extends Vue {
  @PropSync("layout") layoutSync!: object;
  containerTypes: Array<IContainerType> = [];
  containerType: IContainerType = {
    name: "",
    description: "",
    tareWeight: 0,
    payloadCapacity: 0,
    cubicCapacity: 0,
    internalLength: 0,
    internalWidth: 0,
    internalHeight: 0,
    doorOpeningWidth: 0,
    doorOpeningHeight: 0
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
      text: "Tên loại Container",
      align: "start",
      sortable: true,
      value: "name"
    },
    { text: "Mô tả", value: "description" },
    { text: "Khối lượng vỏ", value: "tareWeight" },
    { text: "Sức chứa", value: "payloadCapacity" },
    { text: "Công suất khối", value: "cubicCapacity" },
    { text: "Chiều dài trong", value: "internalLength" },
    { text: "Chiều rộng trong", value: "internalWidth" },
    { text: "Chiều cao trong", value: "internalHeight" },
    { text: "Chiều rộng cửa mở", value: "doorOpeningWidth" },
    { text: "Chiều cao cửa mở", value: "doorOpeningHeight" },
    {
      text: "Hành động",
      value: "action"
    }
  ];
  created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }

  addContainerType() {
    this.containerType = {
      name: "",
      description: "",
      tareWeight: 0,
      payloadCapacity: 0,
      cubicCapacity: 0,
      internalLength: 0,
      internalWidth: 0,
      internalHeight: 0,
      doorOpeningWidth: 0,
      doorOpeningHeight: 0
    };
    this.dialogAdd = true;
  }

  viewDetail(item: IContainerType) {
    this.containerType = item;
    this.dialogAdd = true;
  }

  removeContainerType(item: IContainerType) {
    this.containerType = item;
    this.dialogDel = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    if (val !== oldVal) {
      getContainerTypes({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IContainerType> = res.data;
          console.log("watch", this.options);
          this.containerTypes = response.data;
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
