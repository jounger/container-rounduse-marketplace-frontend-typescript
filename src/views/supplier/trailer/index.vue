<template>
  <v-container fluid>
    <v-card>
      <v-row justify="center">
        <DeleteTrailer
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :trailer="trailer"
          :totalItems.sync="serverSideOptions.totalItems"
          :trailers.sync="trailers"
        />
      </v-row>
      <v-row justify="center">
        <CreateTrailer
          v-if="dialogAdd"
          :trailer="trailer"
          :trailers.sync="trailers"
          :dialogAdd.sync="dialogAdd"
          :totalItems.sync="serverSideOptions.totalItems"
          :update="update"
        />
      </v-row>
      <v-data-table
        :headers="headers"
        :items="trailers"
        item-key="id"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
        no-data-text="Danh sách rơ moóc rỗng."
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title style="font-weight:bold; font-size: 25px;"
              >Danh sách Rơ moóc</v-toolbar-title
            >
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" @click="openCreateDialog()"
              >Thêm mới</v-btn
            >
          </v-toolbar>
        </template>
        <template v-slot:item.trailerType="{ item }">
          {{ item.type }} {{ item.unitOfMeasurement }}
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
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IContainerSemiTrailer } from "@/entity/container-semi-trailer";
import DeleteTrailer from "./components/DeleteTrailer.vue";
import CreateTrailer from "./components/CreateTrailer.vue";
import { getContainerSemiTrailersByForwarder } from "@/api/container-semi-trailer";
import { DataOptions } from "vuetify";

@Component({
  components: {
    CreateTrailer,
    DeleteTrailer
  }
})
export default class Trailer extends Vue {
  trailers: Array<IContainerSemiTrailer> = [];
  trailer = null as IContainerSemiTrailer | null;
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
    {
      text: "Biển số",
      value: "licensePlate"
    },
    { text: "Số lượng trục", value: "numberOfAxles" },
    { text: "Loại rơ moóc", value: "trailerType" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];
  openCreateDialog() {
    this.update = false;
    this.dialogAdd = true;
  }

  openUpdateDialog(item: IContainerSemiTrailer) {
    this.update = true;
    this.trailer = item;
    this.dialogAdd = true;
  }

  openDeleteDialog(item: IContainerSemiTrailer) {
    this.trailer = item;
    this.dialogDel = true;
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getContainerSemiTrailersByForwarder({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _trailers = _res.data.data;
        this.trailers = _trailers;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
