<template>
  <v-content>
    <v-card class="ma-5">
      <v-row justify="center">
        <DeleteContainerType
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :containerType="containerType"
          :containerTypes.sync="containerTypes"
          :totalItems.sync="serverSideOptions.totalItems"
        />
      </v-row>
      <v-row justify="center">
        <CreateContainerType
          v-if="dialogAdd"
          :totalItems.sync="serverSideOptions.totalItems"
          :containerType="containerType"
          :containerTypes.sync="containerTypes"
          :dialogAdd.sync="dialogAdd"
          :update="update"
        />
      </v-row>
      <v-data-table
        :headers="headers"
        :items="containerTypes"
        item-key="id"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
        disable-sort
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
import { Component, Watch, Vue } from "vue-property-decorator";
import { IContainerType } from "@/entity/container-type";
import { getContainerTypes } from "@/api/container-type";
import { PaginationResponse } from "@/api/payload";
import CreateContainerType from "./components/CreateContainerType.vue";
import DeleteContainerType from "./components/DeleteContainerType.vue";
import { DataOptions } from "vuetify";

@Component({
  components: {
    CreateContainerType,
    DeleteContainerType
  }
})
export default class ContainerType extends Vue {
  containerTypes: Array<IContainerType> = [];
  containerType = {} as IContainerType;
  dialogAdd = false;
  dialogDel = false;
  loading = true;
  update = false;
  options = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
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
    { text: "Sức chứa", value: "grossWeight" },
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

  @Watch("options")
  onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      getContainerTypes({
        page: val.page - 1,
        limit: val.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IContainerType> = res.data;
          console.log("watch", this.options);
          this.containerTypes = response.data;
          this.serverSideOptions.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
}
</script>
