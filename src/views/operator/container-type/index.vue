<template>
  <v-container fluid>
    <v-card>
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
        no-data-text="Danh sách loại Container rỗng."
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
          <v-menu :close-on-click="true">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" icon outlined v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="openUpdateDialog(item)">
                <v-list-item-icon>
                  <v-icon small>edit</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Chỉnh sửa</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="openDeleteDialog(item)">
                <v-list-item-icon>
                  <v-icon small>delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xóa bỏ</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
    <v-row justify="center">
      <DeleteContainerType
        v-if="dialogDel"
        :dialogDel.sync="dialogDel"
        :containerType="containerType"
        :containerTypes.sync="containerTypes"
        :totalItems.sync="serverSideOptions.totalItems"
      />
      <CreateContainerType
        v-if="dialogAdd"
        :totalItems.sync="serverSideOptions.totalItems"
        :containerType="containerType"
        :containerTypes.sync="containerTypes"
        :dialogAdd.sync="dialogAdd"
        :update="update"
      />
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IContainerType } from "@/entity/container-type";
import { getContainerTypes } from "@/api/container-type";
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
  containerType = null as IContainerType | null;
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
      text: "Mã",
      align: "start",
      sortable: true,
      value: "id"
    },
    { text: "Tên loại", value: "name" },
    { text: "Mô tả", value: "description" },
    { text: "Khối lượng vỏ", value: "tareWeight" },
    { text: "Sức chứa", value: "grossWeight" },
    { text: "Thể tích", value: "cubicCapacity" },
    { text: "Dài trong", value: "internalLength" },
    { text: "Rộng trong", value: "internalWidth" },
    { text: "Cao trong", value: "internalHeight" },
    { text: "Rộng cửa mở", value: "doorOpeningWidth" },
    { text: "Cao cửa mở", value: "doorOpeningHeight" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  openCreateDialog() {
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
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getContainerTypes({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _containerTypes = _res.data.data;
        this.containerTypes = _containerTypes;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
