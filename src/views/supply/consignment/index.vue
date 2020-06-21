<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách hàng
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
          style="width: 210px; height: 130px;"
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
        @click.stop="addConsignment"
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
        Xóa hàng
      </v-btn>
      <v-row justify="center">
        <v-dialog v-model="dialogDelSingle" persistent max-width="600px">
          <v-card>
            <v-toolbar color="primary" light flat>
              <v-toolbar-title
                ><span class="headline" style="color:white;">Xóa hàng</span>
                <v-btn
                  icon
                  dark
                  @click="dialogDelSingle = false"
                  style="margin-left:419px;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-title
              >
            </v-toolbar>

            <v-card-text>
              <v-form>
                <v-container>
                  <span style="color: black; font-size:22px;"
                    >Bạn có chắc chắn muốn xóa mặt hàng này?</span
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
                ><span class="headline" style="color:white;">Xóa hàng</span>
                <v-btn
                  icon
                  dark
                  @click="dialogDel = false"
                  style="margin-left:419px;"
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-title
              >
            </v-toolbar>

            <v-card-text>
              <v-form>
                <v-container>
                  <span style="color: black; font-size:22px;"
                    >Bạn có chắc chắn muốn xóa những hàng này?</span
                  >
                  <div class="line"></div>
                  <v-list>
                    <v-list-item v-for="(item, i) in selected" :key="i">
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.bookNo"
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
                        label="Mã hàng"
                        name="bookNo"
                        prepend-icon="mdi-account"
                        type="text"
                        v-model="bookNo"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Người liên hệ"
                        name="PIC"
                        prepend-icon="mdi-lock"
                        type="text"
                        v-model="PIC"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
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
                        :readonly="readonly"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            :readonly="readonly"
                            v-model="packingTime"
                            label="Thời gian đóng hàng"
                            prepend-icon="event"
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-if="!readonly"
                          v-model="packingTime"
                          no-title
                          @input="date1 = false"
                          :readonly="readonly"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Nơi đóng hàng"
                        name="packingStation"
                        prepend-icon="mdi-lock"
                        type="text"
                        v-model="packingStation"
                        :readonly="readonly"
                      ></v-text-field>
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
                            v-model="layTime"
                            label="Thời gian làm hàng"
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
                          v-model="layTime"
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
                            v-model="cutOfTime"
                            label="Thời gian tàu chạy"
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
                          v-model="cutOfTime"
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
                      <v-select
                        :items="yesno"
                        attach
                        label="FCL"
                        chips
                        v-model="FCL"
                        :readonly="readonly"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-select
                        :items="type"
                        attach
                        label="Loại hàng"
                        multiple
                        chips
                        v-model="categories"
                        :readonly="readonly"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Khối lượng(tấn)"
                        name="UOM"
                        prepend-icon="mdi-lock"
                        type="number"
                        v-model="UOM"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Trọng lượng"
                        name="payload"
                        prepend-icon="mdi-lock"
                        type="number"
                        v-model="payload"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Bến cảng"
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
                @click="updateConsignment()"
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
        :items="consignments"
        :search="search"
        item-key="bookNo"
        show-select
        :options.sync="options"
        :server-items-length="totalConsignments"
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
              <v-list-item @click="delConsignment(item)">
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
import { Consignment } from "./consignment";

@Component({
  name: "ConsignmentManagement",
  components: {}
})
export default class ConsignmentManagement extends Vue {
  @PropSync("layout") layoutSync!: object;
  selected = [] as Array<Consignment>;
  title = "";
  date1 = false;
  date2 = false;
  date3 = false;
  readonly = false;
  checkAdd = false;
  checkUpdate = false;
  packingTime = "";
  packingStation = "";
  PIC = "";
  bookNo = "";
  layTime = "";
  cutOfTime = "";
  payload = 0 as number;
  UOM = 0 as number | null;
  categories = [] as Array<string>;
  FCL = "";
  port = "";
  type = ["Hard", "Soft"];
  items = [
    {
      name: "Tổng số hàng",
      content: "53",
      icon: "mdi-domain"
    },
    {
      name: "Hàng đang thầu",
      content: "75",
      icon: "mdi-dialpad"
    },
    {
      name: "Đang đợi ghép",
      content: "18",
      icon: "mdi-call-split"
    },
    {
      name: "Ghép thành công",
      content: "6",
      icon: "mdi-arrow-up-bold-box-outline"
    }
  ];
  yesno = ["Có", "Không"];
  success = "";
  name = "";
  checkSuccess = false;
  roles = [] as Array<string>;
  dialogAdd = false;
  dialogDel = false;
  dialogDelSingle = false;
  search = "";
  totalConsignments = 0;
  consignments = [] as Array<Consignment>;
  loading = true;
  options = {} as any;
  headers = [
    {
      text: "Mã hàng",
      align: "start",
      sortable: true,
      value: "bookNo"
    },
    { text: "Người liên hệ", value: "PIC" },
    { text: "Thời gian đóng hàng", value: "packingTime" },
    { text: "Nơi đóng hàng", value: "packingStation" },
    { text: "Thời gian làm hàng", value: "layTime" },
    { text: "Thời gian tàu chạy", value: "cutOfTime" },
    { text: "Trọng lượng", value: "payload" },
    { text: "Khối lượng", value: "UOM" },
    { text: "Loại hàng", value: "categories" },
    { text: "FCL", value: "FCL" },
    { text: "Bến cảng", value: "port" },
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
      this.consignments = data.items;
      this.totalConsignments = data.total;
    });
  }
  async mounted() {
    this.getDataFromApi().then((data: any) => {
      this.consignments = data.items;
      this.totalConsignments = data.total;
    });
  }
  public getDataFromApi() {
    console.log(this.options);
    this.loading = true;
    return new Promise((resolve, reject) => {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let items = this.getConsignments();
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
  public getConsignments(): Array<Consignment> {
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
  public addConsignment() {
    this.bookNo = "";
    this.PIC = "";
    this.packingTime = "";
    this.packingStation = "";
    this.layTime = "";
    this.cutOfTime = "";
    this.FCL = "";
    this.categories = [""];
    this.UOM = null;
    this.port = "";
    this.title = "Thêm mới hàng";
    this.checkAdd = true;
    this.checkUpdate = false;
    this.readonly = false;
    this.dialogAdd = true;
  }
  public viewDetail(item: Consignment) {
    this.bookNo = item.bookNo;
    this.PIC = item.PIC;
    this.packingTime = item.packingTime;
    this.packingStation = item.packingStation;
    this.layTime = item.layTime;
    this.cutOfTime = item.cutOfTime;
    this.FCL = item.FCL;
    this.categories = item.categories;
    this.UOM = item.UOM;
    this.port = item.port;
    this.checkAdd = false;
    this.checkUpdate = false;
    this.title = "Thông tin hàng";
    this.readonly = true;
    this.dialogAdd = true;
  }
  public update(item: Consignment) {
    this.bookNo = item.bookNo;
    this.PIC = item.PIC;
    this.packingTime = item.packingTime;
    this.packingStation = item.packingStation;
    this.layTime = item.layTime;
    this.cutOfTime = item.cutOfTime;
    this.FCL = item.FCL;
    this.categories = item.categories;
    this.UOM = item.UOM;
    this.port = item.port;
    this.checkAdd = false;
    this.checkUpdate = true;
    this.title = "Cập nhập hàng";
    this.readonly = false;
    this.dialogAdd = true;
  }
  public delConsignment(item: Consignment) {
    this.name = item.bookNo;
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
  public updateConsignment() {
    this.success = "Cập nhập thành công!";
    this.checkSuccess = true;
    this.dialogAdd = false;
  }
  public add() {
    console.log(this.packingTime);
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
