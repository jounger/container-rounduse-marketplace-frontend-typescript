<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="tractors"
        item-key="id"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
        no-data-text="Danh sách đầu kéo rỗng."
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title style="font-weight:bold; font-size: 25px;"
              >Danh sách Đầu kéo</v-toolbar-title
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
      <DeleteTractor
        v-if="dialogDel"
        :dialogDel.sync="dialogDel"
        :tractor="tractor"
        :totalItems.sync="serverSideOptions.totalItems"
        :tractors.sync="tractors"
      />
      <CreateTractor
        v-if="dialogAdd"
        :tractor="tractor"
        :tractors.sync="tractors"
        :dialogAdd.sync="dialogAdd"
        :totalItems.sync="serverSideOptions.totalItems"
        :update="update"
      />
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IContainerTractor } from "@/entity/container-tractor";
import DeleteTractor from "./components/DeleteTractor.vue";
import CreateTractor from "./components/CreateTractor.vue";
import { getContainerTractorsByForwarder } from "@/api/container-tractor";
import { DataOptions } from "vuetify";

@Component({
  components: {
    CreateTractor,
    DeleteTractor
  }
})
export default class Tractor extends Vue {
  tractors: Array<IContainerTractor> = [];
  tractor = null as IContainerTractor | null;
  dialogAdd = false;
  dialogDel = false;
  loading = true;
  update = false;
  options = {
    page: 1,
    itemsPerPage: 10
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
    {
      text: "Biển số",
      value: "licensePlate"
    },
    { text: "Số cầu", value: "numberOfAxles" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];
  openCreateDialog() {
    this.update = false;
    this.dialogAdd = true;
  }

  openUpdateDialog(item: IContainerTractor) {
    this.update = true;
    this.tractor = item;
    this.dialogAdd = true;
  }

  openDeleteDialog(item: IContainerTractor) {
    this.tractor = item;
    this.dialogDel = true;
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getContainerTractorsByForwarder({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _tractors = _res.data.data;
        this.tractors = _tractors;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
