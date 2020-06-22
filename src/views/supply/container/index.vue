<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách IContainer
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-card
        class="d-flex flex-row mb-6"
        color="lighten-2"
        flat
        tile
        style="margin-left: 20px;"
      >
        <v-card
          v-for="n in items"
          :key="n.name"
          class="pa-2"
          outlined
          tile
          style="width: 240px; height: 130px;"
        >
          <v-card-title>{{ n.name }}</v-card-title>
          <v-list-item two-line :class="'px-0'">
            <v-btn icon>
              <v-icon>{{ n.icon }}</v-icon>
            </v-btn>

            <v-list-item-content style="margin-left: 40px;">
              <v-list-item-title class="title" style="margin-left: 5px;">{{
                n.content
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-card>
      </v-card>
      <v-btn
        color="primary"
        style="margin-left: 35px;"
        dark
        @click.stop="addIContainer"
      >
        Thêm mới
      </v-btn>
      <v-btn
        color="red"
        style="margin-left: 20px;"
        dark
        @click.stop="dialogDel = true"
        v-if="selected.length > 0"
      >
        Xóa IContainer
      </v-btn>
      <v-row justify="center">
        <v-dialog v-model="dialogDelSingle" persistent max-width="600px">
          <v-card>
            <v-toolbar color="primary" light flat>
              <v-toolbar-title
                ><span class="headline" style="color:white;"
                  >Xóa IContainer</span
                >
                <v-btn
                  icon
                  dark
                  @click="dialogDelSingle = false"
                  style="margin-left:369px;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-title
              >
            </v-toolbar>

            <v-card-text>
              <v-form>
                <v-container>
                  <span style="color: black; font-size:22px;"
                    >Bạn có chắc chắn muốn xóa IContainer này?</span
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
                ><span class="headline" style="color:white;"
                  >Xóa IContainer</span
                >
                <v-btn
                  icon
                  dark
                  @click="dialogDel = false"
                  style="margin-left:369px;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-title
              >
            </v-toolbar>

            <v-card-text>
              <v-form>
                <v-container>
                  <span style="color: black; font-size:22px;"
                    >Bạn có chắc chắn muốn xóa những IContainer này?</span
                  >
                  <div class="line"></div>
                  <v-list>
                    <v-list-item v-for="(item, i) in selected" :key="i">
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.containerNumber"
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
          <v-card>
            <v-toolbar color="primary" light flat>
              <v-toolbar-title
                ><span class="headline" style="color:white;">{{ title }}</span>
                <v-btn icon dark @click="cancel()" style="margin-left:336px;">
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-title
              >
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Mã IContainer"
                        name="containerNumber"
                        prepend-icon="mdi-account"
                        type="text"
                        v-model="containerNumber"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Rơ mooc"
                        name="containerTrailer"
                        prepend-icon="mdi-lock"
                        type="text"
                        v-model="containerTrailer"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Đầu kéo"
                        name="containerTractor"
                        prepend-icon="mdi-lock"
                        type="text"
                        v-model="containerTractor"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Hóa đơn vận tải"
                        name="blNumber"
                        prepend-icon="mdi-lock"
                        type="text"
                        v-model="blNumber"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs10>
                      <v-select
                        :items="drivers"
                        prepend-icon="mdi-lock"
                        attach
                        label="Lái xe"
                        chips
                        v-model="driver"
                        :readonly="readonly"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Biển số xe"
                        name="licensePlate"
                        prepend-icon="mdi-lock"
                        type="text"
                        v-model="licensePlate"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-menu
                        ref="date1"
                        v-model="date1"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="emptyTime"
                            label="Thời gian có vỏ rỗng"
                            hint="YYYY/MM/DD"
                            persistent-hint
                            prepend-icon="event"
                            v-bind="attrs"
                            v-on="on"
                            :readonly="readonly"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-if="!readonly"
                          v-model="emptyTime"
                          no-title
                          @input="date1 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-menu
                        ref="date2"
                        v-model="date2"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="pickUpTime"
                            label="Thời gian kéo vỏ từ ICD"
                            hint="YYYY/MM/DD"
                            persistent-hint
                            prepend-icon="event"
                            v-bind="attrs"
                            v-on="on"
                            :readonly="readonly"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-if="!readonly"
                          v-model="pickUpTime"
                          no-title
                          @input="date2 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-menu
                        ref="date3"
                        v-model="date3"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="freeTime"
                            label="Thời gian miễn phí sử dụng"
                            hint="YYYY/MM/DD"
                            persistent-hint
                            prepend-icon="event"
                            v-bind="attrs"
                            v-on="on"
                            :readonly="readonly"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-if="!readonly"
                          v-model="freeTime"
                          no-title
                          @input="date3 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Nơi trả vỏ"
                        name="returnStation"
                        prepend-icon="mdi-lock"
                        type="text"
                        v-model="returnStation"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Cảng lấy hàng"
                        name="port"
                        prepend-icon="mdi-lock"
                        type="text"
                        v-model="port"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="cancel()">Trở về</v-btn>
              <v-btn @click="add()" color="primary" v-if="checkAdd"
                >Thêm mới</v-btn
              >
              <v-btn
                @click="updateIContainer()"
                color="primary"
                v-if="checkUpdate"
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
        :items="containers"
        :search="search"
        item-key="containerNumber"
        show-select
        :options.sync="options"
        :server-items-length="totalIContainers"
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
              <v-list-item @click="delIContainer(item)">
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
import data from "./data";
import { IContainer } from "@/entity/container";

@Component
export default class Consignment extends Vue {
  @PropSync("layout") layoutSync!: object;
  selected: Array<IContainer> | null = null;
  title = "";
  date1 = false;
  date2 = false;
  date3 = false;
  readonly = false;
  checkAdd = false;
  checkUpdate = false;
  driver = [] as Array<string>;
  containerTrailer = "";
  containerTractor = "";
  containerNumber = "";
  blNumber = "";
  licensePlate = "";
  emptyTime = "";
  pickUpTime = "";
  returnStation = "";
  freeTime = "";
  port = "";
  drivers = ["Duy", "An", "Quyền", "Minh", "Dương"];
  items = [
    {
      name: "Tổng số IContainer",
      content: "53",
      icon: "mdi-domain"
    },
    {
      name: "Tổng số Driver",
      content: "75",
      icon: "mdi-dialpad"
    },
    {
      name: "IContainer rỗng",
      content: "18",
      icon: "mdi-call-split"
    },
    {
      name: "IContainer đang chạy",
      content: "6",
      icon: "mdi-arrow-up-bold-box-outline"
    },
    {
      name: "IContainer đang thầu",
      content: "8",
      icon: "mdi-arrow-up-bold-box-outline"
    }
  ];
  success = "";
  name = "";
  checkSuccess = false;
  dialogAdd = false;
  dialogDel = false;
  dialogDelSingle = false;
  search = "";
  totalIContainers = 0;
  containers: Array<IContainer> | null = null;
  loading = true;
  options = {} as any;
  headers = [
    {
      text: "Mã IContainer",
      align: "start",
      sortable: true,
      value: "containerNumber"
    },
    { text: "Rơ mooc", value: "containerTrailer" },
    { text: "Đầu kéo", value: "containerTractor" },
    { text: "Hóa đơn vận tải", value: "blNumber" },
    { text: "Lái xe", value: "driver" },
    { text: "Biển số xe", value: "licensePlate" },
    { text: "Thời gian có vỏ rỗng", value: "emptyTime" },
    { text: "Thời gian kéo vỏ từ ICD", value: "pickUpTime" },
    { text: "Nơi trả vỏ", value: "returnStation" },
    { text: "Thời gian miễn phí sử dụng", value: "freeTime" },
    { text: "Cảng lấy hàng", value: "port" },
    {
      text: "Hành động",
      value: "action"
    }
  ];
  async created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }
  @Watch("options", { deep: true })
  getOptions() {
    this.getDataFromApi().then((data: any) => {
      this.containers = data.items;
      this.totalIContainers = data.total;
    });
  }
  async mounted() {
    this.getDataFromApi().then((data: any) => {
      this.containers = data.items;
      this.totalIContainers = data.total;
    });
  }
  public getDataFromApi() {
    console.log(this.options);
    this.loading = true;
    return new Promise((resolve, reject) => {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let items = this.getIContainers();
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
  public getIContainers(): Array<IContainer> {
    return data;
  }
  public submit() {
    this.success = "Thêm mới thành công!";
    this.checkSuccess = true;
    this.dialogAdd = false;
  }
  public cancel() {
    this.dialogAdd = false;
  }
  public del() {
    this.success = "Xóa thành công!";
    this.checkSuccess = true;
    this.dialogDel = false;
  }
  public cancelDel() {
    this.checkAdd = false;
    this.checkUpdate = false;
    this.readonly = false;
    this.dialogDel = false;
  }
  public addIContainer() {
    this.containerNumber = "";
    this.containerTrailer = "";
    this.containerTractor = "";
    this.blNumber = "";
    this.driver = [];
    this.licensePlate = "";
    this.emptyTime = "";
    this.pickUpTime = "";
    this.returnStation = "";
    this.freeTime = "";
    this.port = "";
    this.title = "Thêm mới hàng";
    this.checkAdd = true;
    this.checkUpdate = false;
    this.readonly = false;
    this.dialogAdd = true;
  }
  public viewDetail(item: IContainer) {
    this.containerNumber = item.containerNumber;
    this.containerTrailer = item.containerTrailer;
    this.containerTractor = item.containerTractor;
    this.blNumber = item.blNumber;

    this.driver = item.driver;
    this.licensePlate = item.licensePlate;
    this.emptyTime = item.emptyTime;
    this.pickUpTime = item.pickUpTime;
    this.returnStation = item.returnStation;
    this.freeTime = item.freeTime;
    this.port = item.port;
    this.checkAdd = false;
    this.checkUpdate = false;
    this.title = "Thông tin hàng";
    this.readonly = true;
    this.dialogAdd = true;
  }
  public update(item: IContainer) {
    this.containerNumber = item.containerNumber;
    this.containerTrailer = item.containerTrailer;
    this.containerTractor = item.containerTractor;
    this.blNumber = item.blNumber;
    this.driver = item.driver;
    this.licensePlate = item.licensePlate;
    this.emptyTime = item.emptyTime;
    this.pickUpTime = item.pickUpTime;
    this.returnStation = item.returnStation;
    this.freeTime = item.freeTime;
    this.port = item.port;
    this.checkAdd = false;
    this.checkUpdate = true;
    this.title = "Cập nhập hàng";
    this.readonly = false;
    this.dialogAdd = true;
  }
  public delIContainer(item: IContainer) {
    this.name = item.containerNumber;
    this.dialogDelSingle = true;
  }
  public delSingle(name: string) {
    this.success = "Xóa thành công";
    this.dialogDelSingle = false;
    this.checkSuccess = true;
  }
  public cancelDelSingle() {
    this.name = "";
    this.dialogDelSingle = false;
  }
  public updateIContainer() {
    this.success = "Cập nhập thành công!";
    this.checkSuccess = true;
    this.dialogAdd = false;
  }
  public add() {
    this.success = "Thêm mới thành công!";
    this.checkSuccess = true;
    this.dialogAdd = false;
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
