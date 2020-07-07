<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <DeletePort
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :totalItems.sync="options.totalItems"
          :port="port"
          :ports.sync="ports"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <CreatePort
          v-if="dialogAdd"
          :totalItems.sync="options.totalItems"
          :port="port"
          :ports.sync="ports"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :snackbar.sync="snackbar"
          :update="update"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-data-table
        :headers="headers"
        :items="ports"
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
              >Danh sách bến cảng</v-toolbar-title
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
import { IPort } from "@/entity/port";
import CreatePort from "./components/CreatePort.vue";
import DeletePort from "./components/DeletePort.vue";
import { getPorts } from "@/api/port";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";

@Component({
  components: {
    CreatePort,
    DeletePort,
    Snackbar
  }
})
export default class Port extends Vue {
  ports: Array<IPort> = [];
  port = {} as IPort;
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
      text: "Mã code",
      align: "start",
      sortable: true,
      value: "nameCode"
    },
    { text: "Tên bến cảng", value: "fullname" },
    { text: "Địa chỉ", value: "address" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  openCreateDialog() {
    this.port = {} as IPort;
    this.update = false;
    this.dialogAdd = true;
  }

  openUpdateDialog(item: IPort) {
    this.port = item;
    this.update = true;
    this.dialogAdd = true;
  }

  openDeleteDialog(item: IPort) {
    this.port = item;
    this.dialogDel = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    if (val !== oldVal) {
      getPorts({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IPort> = res.data;
          console.log("watch", this.options);
          this.ports = response.data;
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
