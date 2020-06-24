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
      <v-btn
        color="primary"
        style="margin-left: 35px; margin-bottom: 10px;"
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
        id="mytable"
        v-model="selected"
        :headers="headers"
        :items="outbounds"
        :search="search"
        item-key="bookNo"
        :options.sync="options"
        :server-items-length="totalConsignments"
        :loading="loading"
        :items-per-page="5"
        class="elevation-1"
      >
        <template v-slot:item.create="{ item }">
          <v-list
            style="margin-top: -110px;
    margin-left: -20px;"
          >
            <v-list-item>
              <v-list-item-title
                ><v-icon>mdi-lock</v-icon
                >{{ item.dateCreated }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-title
                ><v-icon>mdi-lock</v-icon
                >{{ item.timeCreated }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-title
                ><v-icon>mdi-lock</v-icon>{{ item.status }}</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </template>
        <template v-slot:item.request="{ item }">
          <v-list style="margin-left:-20px;">
            <v-list-item>
              <v-list-item-title
                ><v-icon>mdi-lock</v-icon>Hãng tàu:
                {{ item.shippingLine }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-title
                ><v-icon>mdi-lock</v-icon>Loại cont:
                {{ item.containerType }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title
                  ><v-icon>mdi-lock</v-icon>Mooc:
                  {{ item.mooc }}</v-list-item-title
                >
              </v-list-item-content>
              <v-list-item-content style="margin-left:-20px;">
                <v-list-item-title
                  ><v-icon>mdi-lock</v-icon>Đầu kéo:
                  {{ item.trailer }}</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-title
                ><v-icon>mdi-lock</v-icon>Đóng hàng:
                {{ item.packingTime }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-title
                ><v-icon>mdi-lock</v-icon>Nơi đóng:
                {{ item.packingStation }}</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </template>
        <template v-slot:item.detail="{ item }">
          <v-list
            style="margin-top: -110px;
    margin-left: -20px;"
          >
            <v-list-item>
              <v-list-item-title
                ><v-icon>mdi-lock</v-icon>Trọng tải:
                {{ item.payloadWeight }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-title
                ><v-icon>mdi-lock</v-icon>Booking:
                {{ item.bookNo }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-title
                ><v-icon>mdi-lock</v-icon>Cut-off:
                {{ item.cutOffTime }}</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </template>
        <template v-slot:item.contact="{ item }">
          <v-list
            style="margin-top: -110px;
    margin-left: -20px;"
          >
            <v-list-item>
              <v-list-item-title
                ><v-icon>mdi-lock</v-icon>Chủ hàng:
                {{ item.merchant }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-title
                ><v-icon>mdi-lock</v-icon>SĐT:
                {{ item.phone }}</v-list-item-title
              >
            </v-list-item>
            <v-list-item>
              <v-list-item-title
                ><v-icon>mdi-lock</v-icon>Phụ trách:
                {{ item.PIC }}</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </template>
        <template v-slot:item.action="{ item }">
          <v-list style="margin-top: -130px; margin-left: -20px;">
            <v-list-item two-line style="margin-top:-10px;">
              <v-list-item-content>
                <v-list-item-title>
                  <v-btn @click="updateConsignment(item)"
                    >Sửa<v-icon>edit</v-icon></v-btn
                  >
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-content style="margin-left: -25px;">
                <v-list-item-title>
                  <v-btn @click="delConsignment(item)"
                    >Xóa<v-icon>delete</v-icon></v-btn
                  >
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item style="margin-top:-10px;">
              <v-btn color="green">Tìm vỏ<v-icon>search</v-icon></v-btn>
            </v-list-item>
          </v-list>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, PropSync, Watch, Vue } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import { IOutbound } from "@/entity/outbound";
@Component
export default class OutboundNew extends Vue {
  @PropSync("layout") layoutSync!: object;
  selected = [] as Array<any>;
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
  status = "";
  cutOffTime = "";
  payloadWeight = "";
  dateCreated = "";
  timeCreated = "";
  shippingLine = "";
  containerType = "";
  mooc = "";
  trailer = "";
  merchant = "";
  phone = "";
  success = "";
  name = "";
  checkSuccess = false;
  roles = [] as Array<string>;
  dialogAdd = false;
  dialogDel = false;
  dialogDelSingle = false;
  search = "";
  totalConsignments = 0;
  outbounds = [] as Array<any>;
  loading = true;
  options = {} as any;
  headers = [
    {
      text: "Ngày tạo",
      align: "start",
      sortable: false,
      value: "create"
    },
    { text: "Yêu cầu ghép", value: "request", sortable: false },
    { text: "Thông tin hàng", value: "detail", sortable: false },
    { text: "Liên hệ", value: "contact", sortable: false },
    {
      text: "",
      value: "action",
      sortable: false
    }
  ];
  async created() {
    this.layoutSync = NavLayout; // change EmptyLayout to NavLayout.vue
  }
  @Watch("options", { deep: true })
  getOptions() {
    this.getDataFromApi().then((data: any) => {
      this.outbounds = data.items;
      this.totalConsignments = data.total;
    });
  }
  async mounted() {
    this.getDataFromApi().then((data: any) => {
      this.outbounds = data.items;
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
        items = items.sort((a: Array<IOutbound>, b: Array<IOutbound>) => {
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
  public getConsignments(): Array<any> {
    return [
      {
        dateCreated: "2019-12-20",
        timeCreated: "15:03",
        status: "Mới tạo",
        shippingLine: "Maersk",
        containerType: "40HC",
        mooc: "2 giàn",
        trailer: "1 cầu",
        packingTime: "2019-12-20",
        packingStation: "KCN Yên Phong - BN",
        payloadWeight: "12 tấn",
        bookNo: "COSU4512563240",
        cutOffTime: "2019-12-20",
        merchant: "Mr. An",
        phone: "0967390098",
        PIC: "Mr. Nam"
      },
      {
        dateCreated: "2019-12-20",
        timeCreated: "15:03",
        status: "Mới tạo",
        shippingLine: "Maersk",
        containerType: "40HC",
        mooc: "2 giàn",
        trailer: "1 cầu",
        packingTime: "2019-12-20",
        packingStation: "KCN Yên Phong - BN",
        payloadWeight: "12 tấn",
        bookNo: "COSU4512563241",
        cutOffTime: "2019-12-20",
        merchant: "Mr. An",
        phone: "0967390098",
        PIC: "Mr. Nam"
      },
      {
        dateCreated: "2019-12-20",
        timeCreated: "15:03",
        status: "Mới tạo",
        shippingLine: "Maersk",
        containerType: "40HC",
        mooc: "2 giàn",
        trailer: "1 cầu",
        packingTime: "2019-12-20",
        packingStation: "KCN Yên Phong - BN",
        payloadWeight: "12 tấn",
        bookNo: "COSU4512563242",
        cutOffTime: "2019-12-20",
        merchant: "Mr. An",
        phone: "0967390098",
        PIC: "Mr. Nam"
      },
      {
        dateCreated: "2019-12-20",
        timeCreated: "15:03",
        status: "Mới tạo",
        shippingLine: "Maersk",
        containerType: "40HC",
        mooc: "2 giàn",
        trailer: "1 cầu",
        packingTime: "2019-12-20",
        packingStation: "KCN Yên Phong - BN",
        payloadWeight: "12 tấn",
        bookNo: "COSU4512563243",
        cutOffTime: "2019-12-20",
        merchant: "Mr. An",
        phone: "0967390098",
        PIC: "Mr. Nam"
      },
      {
        dateCreated: "2019-12-20",
        timeCreated: "15:03",
        status: "Mới tạo",
        shippingLine: "Maersk",
        containerType: "40HC",
        mooc: "2 giàn",
        trailer: "1 cầu",
        packingTime: "2019-12-20",
        packingStation: "KCN Yên Phong - BN",
        payloadWeight: "12 tấn",
        bookNo: "COSU4512563244",
        cutOffTime: "2019-12-20",
        merchant: "Mr. An",
        phone: "0967390098",
        PIC: "Mr. Nam"
      },
      {
        dateCreated: "2019-12-20",
        timeCreated: "15:03",
        status: "Mới tạo",
        shippingLine: "Maersk",
        containerType: "40HC",
        mooc: "2 giàn",
        trailer: "1 cầu",
        packingTime: "2019-12-20",
        packingStation: "KCN Yên Phong - BN",
        payloadWeight: "12 tấn",
        bookNo: "COSU4512563245",
        cutOffTime: "2019-12-20",
        merchant: "Mr. An",
        phone: "0967390098",
        PIC: "Mr. Nam"
      }
    ];
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
    this.title = "Thêm mới hàng";
    this.checkAdd = true;
    this.checkUpdate = false;
    this.readonly = false;
    this.dialogAdd = true;
  }
  public viewDetail(item: any) {
    this.checkAdd = false;
    this.checkUpdate = false;
    this.title = "Thông tin hàng";
    this.readonly = true;
    this.dialogAdd = true;
  }
  public update(item: any) {
    this.checkAdd = false;
    this.checkUpdate = true;
    this.title = "Cập nhập hàng";
    this.readonly = false;
    this.dialogAdd = true;
  }
  public delConsignment(item: any) {
    this.name = item.bookNo;
    this.dialogDelSingle = true;
  }
  public delSingle(name: string) {
    this.outbounds = this.outbounds.filter(item => item.bookNo != name);
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
#mytable table tr {
  background: white;
}
#mytable table thead tr th {
  background: whitesmoke;
}
</style>
