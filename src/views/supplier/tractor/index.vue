<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <DeleteTractor
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :tractor="tractor"
          :totalItems.sync="serverSideOptions.totalItems"
          :tractors.sync="tractors"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <CreateTractor
          v-if="dialogAdd"
          :tractor="tractor"
          :tractors.sync="tractors"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :totalItems.sync="serverSideOptions.totalItems"
          :snackbar.sync="snackbar"
          :update="update"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
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
import { IContainerTractor } from "@/entity/container-tractor";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";
import DeleteTractor from "./components/DeleteTractor.vue";
import CreateTractor from "./components/CreateTractor.vue";
import { getContainerTractorsByForwarder } from "@/api/container-tractor";
import { DataOptions } from "vuetify";

@Component({
  components: {
    CreateTractor,
    DeleteTractor,
    Snackbar
  }
})
export default class Tractor extends Vue {
  tractors: Array<IContainerTractor> = [];
  tractor = {} as IContainerTractor;
  dialogAdd = false;
  dialogDel = false;
  message = "";
  snackbar = false;
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
      text: "Biển số",
      align: "start",
      sortable: true,
      value: "licensePlate"
    },
    { text: "Số lượng trục", value: "numberOfAxles" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];
  openCreateDialog() {
    this.update = false;
    this.tractor = {} as IContainerTractor;
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
  onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      getContainerTractorsByForwarder({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IContainerTractor> = res.data;
          this.tractors = response.data;
          this.serverSideOptions.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
}
</script>
