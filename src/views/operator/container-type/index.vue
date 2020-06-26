<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <DeleteContainerType
          :dialogDel.sync="dialogDel"
          :containerType.sync="containerType"
          :containerTypes.sync="containerTypes"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <CreateContainerType
          :containerType.sync="containerType"
          :containerTypes.sync="containerTypes"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :snackbar.sync="snackbar"
          :update="update"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-data-table
        :headers="headers"
        :items="containerTypes"
        item-key="id"
        :loading="loading"
        :options.sync="options"
        :server-items-length="options.totalItems"
        :footer-props="{ 'items-per-page-options': options.itemsPerPageItems }"
        :actions-append="options.page"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title style="font-weight:bold; font-size: 25px;"
              >Danh sách loại Container</v-toolbar-title
            >
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" @click="openCreateDialog()"
              >Thêm mới</v-btn
            >
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openUpdateDialog(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="openDeleteDialog(item)">
            mdi-delete
          </v-icon>
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
import CreateContainerType from "./components/CreateContainerType.vue";
import DeleteContainerType from "./components/DeleteContainerType.vue";

@Component({
  components: {
    CreateContainerType,
    DeleteContainerType,
    Snackbar
  }
})
export default class ContainerType extends Vue {
  @PropSync("layout") layoutSync!: object;
  containerTypes: Array<IContainerType> = [];
  containerType = {} as IContainerType;
  dialogAdd = false;
  dialogDel = false;
  search = "";
  message = "";
  snackbar = false;
  loading = true;
  update = false;
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
      value: "actions"
    }
  ];
  created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }

  openCreateDialog() {
    this.containerType = {} as IContainerType;
    this.update = false;
    this.dialogAdd = true;
  }

  openUpdateDialog(item: IContainerType) {
    this.containerType = item;
    this.update = true;
    this.dialogAdd = true;
  }

  openDeleteDialog(item: IContainerType) {
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
