<template>
  <v-content>
    <v-card class="ma-5">
      <v-row justify="center">
        <DeletePort
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :totalItems.sync="serverSideOptions.totalItems"
          :port="port"
          :ports.sync="ports"
        />
      </v-row>
      <v-row justify="center">
        <CreatePort
          :totalItems.sync="serverSideOptions.totalItems"
          :port="port"
          :ports.sync="ports"
          :dialogAdd.sync="dialogAdd"
        />
        <UpdatePort
          :port="port"
          :ports.sync="ports"
          :dialogEdit.sync="dialogEdit"
        />
      </v-row>
      <v-data-table
        :headers="headers"
        :items="ports"
        item-key="id"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
        no-data-text="Danh sách cảng rỗng."
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title style="font-weight:bold; font-size: 25px;"
              >Danh sách cảng</v-toolbar-title
            >
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" @click="dialogAdd = true"
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
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IPort } from "@/entity/port";
import CreatePort from "./components/CreatePort.vue";
import UpdatePort from "./components/UpdatePort.vue";
import DeletePort from "./components/DeletePort.vue";
import { getPorts } from "@/api/port";
import { DataOptions } from "vuetify";

@Component({
  components: {
    CreatePort,
    UpdatePort,
    DeletePort
  }
})
export default class Port extends Vue {
  ports: Array<IPort> = [];
  port = null as IPort | null;
  dialogAdd = false;
  dialogEdit = false;
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
      text: "Mã code",
      value: "nameCode"
    },
    { text: "Tên cảng", value: "fullname" },
    { text: "Địa chỉ", value: "address" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  openUpdateDialog(item: IPort) {
    this.port = item;
    this.dialogEdit = true;
  }

  openDeleteDialog(item: IPort) {
    this.port = item;
    this.dialogDel = true;
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getPorts({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _ports = _res.data.data;
        this.ports = _ports;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
