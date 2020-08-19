<template>
  <v-container fluid>
    <v-card>
      <v-row justify="center">
        <DeleteDriver
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :totalItems.sync="serverSideOptions.totalItems"
          :driver="driver"
          :drivers.sync="drivers"
        />
      </v-row>
      <v-row justify="center">
        <CreateDriver
          v-if="dialogAdd"
          :driver="driver"
          :drivers.sync="drivers"
          :totalItems.sync="serverSideOptions.totalItems"
          :dialogAdd.sync="dialogAdd"
          :update="update"
        />
      </v-row>
      <v-data-table
        :headers="headers"
        :items="drivers"
        item-key="id"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
        no-data-text="Danh sách Lái xe rỗng."
        disable-sort
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
        <template v-slot:item.status="{ item }">
          <ChipStatus :status="item.status" />
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
                  <v-icon small>mdi-delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xóa bỏ</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
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
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IDriver } from "@/entity/driver";
import DeleteDriver from "./components/DeleteDriver.vue";
import CreateDriver from "./components/CreateDriver.vue";
import { getDriversByForwarder } from "@/api/driver";
import { DataOptions } from "vuetify";
import ChipStatus from "@/components/ChipStatus.vue";

@Component({
  components: {
    CreateDriver,
    DeleteDriver,
    ChipStatus
  }
})
export default class Driver extends Vue {
  drivers: Array<IDriver> = [];
  driver = null as IDriver | null;
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
    { text: "Tên đăng nhập", value: "username" },
    { text: "Tên đầy đủ", value: "fullname" },
    { text: "Email", value: "email" },
    { text: "Số điện thoại", value: "phone" },
    { text: "Số bằng lái", value: "driverLicense" },
    { text: "Trạng thái", value: "status" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  openCreateDialog() {
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

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getDriversByForwarder({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _drivers = _res.data.data;
        this.drivers = _drivers;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
