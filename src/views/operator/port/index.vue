<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách bến cảng
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-btn
        color="primary"
        style="margin-left: 35px;"
        dark
        @click.stop="addPort"
        v-if="$auth.check(['ROLE_ADMIN'])"
      >
        Thêm mới
      </v-btn>
      <v-row justify="center">
        <DeletePort
          :dialogDel.sync="dialogDel"
          :checkSuccess.sync="checkSuccess"
          :success.sync="success"
          :name="name"
        />
      </v-row>
      <v-row justify="center">
        <CreatePort
          :port.sync="port"
          :title="title"
          :dialogAdd.sync="dialogAdd"
          :checkSuccess.sync="checkSuccess"
          :checkAdd="checkAdd"
          :checkUpdate="checkUpdate"
          :success.sync="success"
          :readonly="readonly"
        />
      </v-row>
      <v-alert
        v-model="checkSuccess"
        dismissible
        close-icon="mdi-delete"
        type="success"
      >
        {{ success }}
      </v-alert>
      <v-data-table
        :headers="headers"
        :items="ports"
        :search="search"
        item-key="nameCode"
        :options.sync="options"
        :server-items-length="totalPorts"
        :loading="loading"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item.action="{ item }">
          <v-menu :loading="item.createloading" :disabled="item.createloading">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="secondary" dark v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="viewDetail(item)">
                <v-list-item-title>Xem chi tiết</v-list-item-title>
              </v-list-item>
              <v-list-item @click="update(item)">
                <v-list-item-title>Cập nhập</v-list-item-title>
              </v-list-item>
              <v-list-item @click="delPort(item)">
                <v-list-item-title>Xóa</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, PropSync, Watch, Vue } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import data from "../port/data";
import { Port } from "../port/port";
import DeletePort from "./components/DeletePort.vue";
import CreatePort from "./components/CreatePort.vue";

@Component({
  name: "PortManagement",
  components: {
    DeletePort,
    CreatePort
  }
})
export default class PortManagement extends Vue {
  @PropSync("layout") layoutSync!: object;

  port: Port = {
    fullname: "",
    nameCode: "",
    address: ""
  };
  success = "";
  checkSuccess = false;
  dialogAdd = false;
  dialogDel = false;
  checkAdd = false;
  checkUpdate = false;
  title = "";
  name = "";
  search = "";
  readonly = false;
  totalPorts = 0;
  ports = [] as Array<Port>;
  loading = true;
  options = {} as any;
  headers = [
    {
      text: "Tên bến cảng",
      align: "start",
      sortable: true,
      value: "fullname"
    },
    { text: "Mã bến cảng", value: "nameCode" },
    { text: "Địa chỉ", value: "address" },
    {
      text: "Hành động",
      value: "action"
    }
  ];
  async created() {
    console.log(1);
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }
  @Watch("options", { deep: true })
  getOptions() {
    this.getDataFromApi().then((data: any) => {
      this.ports = data.items;
      this.totalPorts = data.total;
    });
  }
  async mounted() {
    this.getDataFromApi().then((data: any) => {
      this.ports = data.items;
      this.totalPorts = data.total;
    });
  }
  public getDataFromApi() {
    console.log(this.options);
    this.loading = true;
    return new Promise((resolve, reject) => {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let items = this.getPorts();
      const total = items.length;

      if (sortBy.length === 1 && sortDesc.length === 1) {
        items = items.sort((a: any, b: any) => {
          const sortA = a[sortBy[0]];
          const sortB = b[sortBy[0]];

          if (sortDesc[0]) {
            if (sortA < sortB) return 1;
            if (sortA > sortB) return -1;
            return 0;
          } else {
            if (sortA < sortB) return -1;
            if (sortA > sortB) return 1;
            return 0;
          }
        });
      }

      if (itemsPerPage > 0) {
        items = items.slice((page - 1) * itemsPerPage, page * itemsPerPage);
      }

      setTimeout(() => {
        this.loading = false;
        resolve({
          items,
          total
        });
      }, 1000);
    });
  }
  public getPorts(): Array<Port> {
    return data;
  }
  public viewDetail(item: Port) {
    this.port = item;
    this.checkAdd = false;
    this.checkUpdate = false;
    this.title = "Thông tin bến cảng";
    this.readonly = true;
    this.dialogAdd = true;
  }
  public update(item: Port) {
    this.port = item;
    this.checkAdd = false;
    this.checkUpdate = true;
    this.title = "Cập nhập bến cảng";
    this.readonly = false;
    this.dialogAdd = true;
  }
  public delPort(item: Port) {
    this.name = item.fullname;
    this.dialogDel = true;
  }
  public addPort() {
    this.title = "Thêm mới bến cảng";
    this.port = {
      fullname: "",
      nameCode: "",
      address: ""
    };
    this.checkAdd = true;
    this.checkUpdate = false;
    this.readonly = false;
    this.dialogAdd = true;
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
