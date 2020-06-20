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
      <v-btn
        color="red"
        style="margin-left: 20px;"
        dark
        @click.stop="dialogDel = true"
        v-if="selected.length > 0 && $auth.check(['ROLE_ADMIN'])"
      >
        Xóa bến cảng
      </v-btn>
      <v-row justify="center">
        <v-dialog v-model="dialogDelSingle" persistent max-width="600px">
          <v-card>
            <v-toolbar color="primary" light flat>
              <v-toolbar-title
                ><span class="headline" style="color:white;">Xóa bến cảng</span>
                <v-btn
                  icon
                  dark
                  @click="dialogDelSingle = false"
                  style="margin-left:374px;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-title
              >
            </v-toolbar>

            <v-card-text>
              <v-form>
                <v-container>
                  <span style="color: black; font-size:22px;"
                    >Bạn có chắc chắn muốn xóa bến cảng này?</span
                  >
                  <div class="line"></div>
                  <v-list>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title>{{ name }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-container>
                <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions style="margin-left: 205px;">
              <v-btn @click="cancelDelSingle()">Hủy</v-btn>
              <v-btn @click="delSingle(name)" color="red">Xóa</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="dialogDel" persistent max-width="600px">
          <v-card>
            <v-toolbar color="primary" light flat>
              <v-toolbar-title
                ><span class="headline" style="color:white;">Xóa bến cảng</span>
                <v-btn
                  icon
                  dark
                  @click="dialogDel = false"
                  style="margin-left:374px;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-title
              >
            </v-toolbar>

            <v-card-text>
              <v-form>
                <v-container>
                  <span style="color: black; font-size:22px;"
                    >Bạn có chắc chắn muốn xóa những bến cảng này?</span
                  >
                  <div class="line"></div>
                  <v-list>
                    <v-list-item v-for="(item, i) in selected" :key="i">
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.fullname"
                        ></v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-container>
                <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions style="margin-left: 205px;">
              <v-btn @click="cancelDel()">Hủy</v-btn>
              <v-btn @click="del()" color="red">Xóa</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row justify="center">
        <v-dialog v-model="dialogAdd" persistent max-width="600px">
          <v-card style="height: 420px;">
            <v-toolbar color="primary" light flat>
              <v-toolbar-title
                ><span class="headline" style="color:white;">{{ title }}</span>
                <v-btn
                  icon
                  dark
                  @click="dialogAdd = false"
                  style="margin-left:308px;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-title
              >
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-layout row>
                  <v-flex xs9>
                    <v-text-field
                      label="Tên bến cảng"
                      name="fullname"
                      prepend-icon="mdi-account"
                      type="text"
                      v-model="fullname"
                      :readonly="readonly"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs9>
                    <v-text-field
                      label="Mã bến cảng"
                      name="nameCode"
                      prepend-icon="mdi-account"
                      type="text"
                      v-model="nameCode"
                      :readonly="readonly"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs9>
                    <v-text-field
                      label="Địa chỉ"
                      name="address"
                      prepend-icon="mdi-account"
                      type="text"
                      v-model="address"
                      :readonly="readonly"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions style="margin-top: 65px;">
              <v-spacer></v-spacer>
              <v-btn @click="cancel()">Trở về</v-btn>
              <v-btn @click="submit()" color="primary" v-if="checkAdd"
                >Thêm mới</v-btn
              >
              <v-btn @click="updatePort()" color="primary" v-if="checkUpdate"
                >Cập nhập</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
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
        v-model="selected"
        :headers="headers"
        :items="ports"
        :search="search"
        item-key="nameCode"
        show-select
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

@Component({
  name: "PortManagement"
})
export default class PortManagement extends Vue {
  @PropSync("layout") layoutSync!: object;
  selected = [] as Array<Port>;
  fullname = "";
  nameCode = "";
  address = "";
  success = "";
  checkSuccess = false;
  dialogAdd = false;
  dialogDel = false;
  dialogDelSingle = false;
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
  public submit() {
    this.success = "Thêm mới thành công!";
    this.checkSuccess = true;
    this.dialogAdd = false;
  }
  public cancel() {
    this.checkAdd = false;
    this.checkUpdate = false;
    this.readonly = false;
    this.dialogAdd = false;
  }
  public viewDetail(item: Port) {
    this.fullname = item.fullname;
    this.nameCode = item.nameCode;
    this.address = item.address;
    this.checkAdd = false;
    this.checkUpdate = false;
    this.title = "Thông tin bến cảng";
    this.readonly = true;
    this.dialogAdd = true;
  }
  public update(item: Port) {
    this.fullname = item.fullname;
    this.nameCode = item.nameCode;
    this.address = item.address;
    this.checkAdd = false;
    this.checkUpdate = true;
    this.title = "Cập nhập bến cảng";
    this.readonly = false;
    this.dialogAdd = true;
  }
  public delPort(item: Port) {
    this.name = item.fullname;
    this.dialogDelSingle = true;
  }
  public delSingle(name: string) {
    this.ports = this.ports.filter((port: Port) => port.fullname != name);
    this.success = "Xóa thành công";
    this.checkSuccess = true;
    this.dialogDelSingle = false;
  }
  public cancelDelSingle() {
    this.name = "";
    this.dialogDelSingle = false;
  }
  public addPort() {
    this.title = "Thêm mới bến cảng";
    this.fullname = "";
    this.nameCode = "";
    this.address = "";
    this.checkAdd = true;
    this.checkUpdate = false;
    this.readonly = false;
    this.dialogAdd = true;
  }
  public updatePort() {
    this.success = "Cập nhập thành công";
    this.checkSuccess = true;
    this.dialogAdd = false;
  }
  public del() {
    this.success = "Xóa thành công!";
    this.checkSuccess = true;
    console.log(this.selected);
    this.dialogDel = false;
  }
  public cancelDel() {
    this.dialogDel = false;
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
