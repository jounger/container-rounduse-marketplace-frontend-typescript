<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <DeleteTrailer
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :trailer="trailer"
          :totalItems.sync="serverSideOptions.totalItems"
          :trailers.sync="trailers"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <CreateTrailer
          v-if="dialogAdd"
          :trailer="trailer"
          :trailers.sync="trailers"
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
        :items="trailers"
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
import { IContainerSemiTrailer } from "@/entity/container-semi-trailer";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";
import DeleteTrailer from "./components/DeleteTrailer.vue";
import CreateTrailer from "./components/CreateTrailer.vue";
import { getContainerSemiTrailersByForwarder } from "@/api/container-semi-trailer";
import { DataOptions } from "vuetify";

@Component({
  components: {
    CreateTrailer,
    DeleteTrailer,
    Snackbar
  }
})
export default class Trailer extends Vue {
  trailers: Array<IContainerSemiTrailer> = [];
  trailer = {} as IContainerSemiTrailer;
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
    { text: "Loại rơ moóc", value: "trailerType" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];
  openCreateDialog() {
    this.update = false;
    this.trailer = {} as IContainerSemiTrailer;
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
  onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      getContainerSemiTrailersByForwarder({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IContainerSemiTrailer> = res.data;
          this.trailers = response.data;
          this.serverSideOptions.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
}
</script>
