<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <DeleteDriver
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :totalItems.sync="options.totalItems"
          :driver="driver"
          :drivers.sync="drivers"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <CreateDriver
          v-if="dialogAdd"
          :driver="driver"
          :drivers.sync="drivers"
          :totalItems.sync="options.totalItems"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :snackbar.sync="snackbar"
          :update="update"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-data-table
        :headers="headers"
        :items="drivers"
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
              >Danh sách lái xe</v-toolbar-title
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
        <template v-slot:item.geolocation="{ item }">
          {{
            item.location && item.location.latitude
              ? item.location.latitude + ";"
              : ""
          }}
          {{
            item.location && item.location.longtitude
              ? item.location.longitude
              : ""
          }}
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IDriver } from "@/entity/driver";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";
import DeleteDriver from "./components/DeleteDriver.vue";
import CreateDriver from "./components/CreateDriver.vue";
import { getDriversByForwarder } from "@/api/driver";

@Component({
  components: {
    CreateDriver,
    DeleteDriver,
    Snackbar
  }
})
export default class Driver extends Vue {
  drivers: Array<IDriver> = [];
  driver = {} as IDriver;
  dialogAdd = false;
  dialogDel = false;
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
      text: "Tên đăng nhập",
      align: "start",
      sortable: true,
      value: "username"
    },
    { text: "Trạng thái", value: "status" },
    { text: "Email", value: "email" },
    { text: "Số điện thoại", value: "phone" },
    { text: "Tên đầy đủ", value: "fullname" },
    { text: "Số bằng lái", value: "driverLicense" },
    { text: "Vị trí", value: "geolocation" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  openCreateDialog() {
    this.driver = {} as IDriver;
    this.driver.status = "ACTIVE";
    this.driver.roles = ["ROLE_DRIVER"];
    this.update = false;
    this.dialogAdd = true;
  }

  openUpdateDialog(item: IDriver) {
    this.driver = item;
    this.update = true;
    this.dialogAdd = true;
  }

  openDeleteDialog(item: IDriver) {
    this.driver = item;
    this.dialogDel = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    if (val !== oldVal) {
      getDriversByForwarder({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IDriver> = res.data;
          console.log("watch", response);
          this.drivers = response.data;
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
