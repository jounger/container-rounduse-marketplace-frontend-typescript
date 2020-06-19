<template>
  <v-content>
    <v-card>
      <v-card-title>
        Danh sách Hồ sơ mời thầu
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
        @click.stop="addBiddingDocument"
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
        Xóa Hồ sơ
      </v-btn>
      <v-row justify="center">
        <v-dialog v-model="dialogDelSingle" persistent max-width="600px">
          <v-card>
            <v-toolbar color="primary" light flat>
              <v-toolbar-title
                ><span class="headline" style="color:white;">Xóa Hồ sơ</span>
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
                    >Bạn có chắc chắn muốn xóa Hồ sơ mời thầu này?</span
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
                ><span class="headline" style="color:white;">Xóa Hồ sơ</span>
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
                    >Bạn có chắc chắn muốn xóa những Hồ sơ mời thầu này?</span
                  >
                  <div class="line"></div>
                  <v-list>
                    <v-list-item v-for="(item, i) in selected" :key="i">
                      <v-list-item-content>
                        <v-list-item-title
                          v-text="item.consignment"
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
                <v-layout col v-if="checkDetail">
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Bên mời thầu"
                        name="offeree"
                        prepend-icon="mdi-lock"
                        type="number"
                        v-model="offeree"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-list>
                        <v-list-item>
                          <v-list-item-title
                            >Danh sách Hồ sơ dự thầu</v-list-item-title
                          >
                          <v-list-item-subtitle
                            ><v-btn>Xem</v-btn></v-list-item-subtitle
                          >
                        </v-list-item>
                      </v-list>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-select
                        :items="currencies"
                        prepend-icon="mdi-lock"
                        attach
                        label="Loại tiền tệ"
                        chips
                        v-model="currencyOfPayment"
                        :readonly="readonly"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-select
                        :items="consignments"
                        prepend-icon="mdi-lock"
                        attach
                        label="Chọn hàng"
                        chips
                        v-model="consignment"
                        :readonly="readonly"
                      ></v-select>
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
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="bidOpening"
                            label="Thời gian mở thầu"
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
                          v-model="bidOpening"
                          no-title
                          @input="date1 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                  </v-layout>
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
                            v-model="bidClosing"
                            label="Thời gian đóng thầu"
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
                          v-model="bidClosing"
                          no-title
                          @input="date2 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs6>
                      <v-select
                        :items="discounts"
                        prepend-icon="mdi-lock"
                        attach
                        label="Mã giảm giá"
                        chips
                        v-model="bidDiscountCode"
                        :readonly="readonly"
                      ></v-select>
                    </v-flex>
                  </v-layout>
                  <v-layout row style="margin-left:-120px;">
                    <v-flex xs8>
                      <v-text-field
                        label="Bước thầu"
                        name="bidStep"
                        prepend-icon="mdi-lock"
                        type="number"
                        v-model="bidStep"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Giá gọi thầu"
                        name="bidPackagePrice"
                        prepend-icon="mdi-lock"
                        type="number"
                        v-model="bidPackagePrice"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Giá sàn"
                        name="bidFloorPrice"
                        prepend-icon="mdi-lock"
                        type="text"
                        v-model="bidFloorPrice"
                        :readonly="readonly"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col v-if="checkDetail">
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
                            v-model="createdAt"
                            label="Ngày tạo"
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
                          v-model="createdAt"
                          no-title
                          @input="date3 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs8>
                      <v-menu
                        ref="date4"
                        v-model="date4"
                        :close-on-content-click="false"
                        transition="scale-transition"
                        offset-y
                        max-width="290px"
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="updatedAt"
                            label="Ngày cập nhập"
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
                          v-model="updatedAt"
                          no-title
                          @input="date4 = false"
                        ></v-date-picker>
                      </v-menu>
                    </v-flex>
                  </v-layout>
                </v-layout>
                <v-layout col v-if="checkDetail">
                  <v-layout row>
                    <v-flex xs8>
                      <v-text-field
                        label="Giá dẫn đầu"
                        name="priceLeadership"
                        prepend-icon="mdi-lock"
                        type="number"
                        v-model="priceLeadership"
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
                @click="updateBiddingDocument()"
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
        :items="biddingDocuments"
        :search="search"
        item-key="consignment"
        show-select
        :options.sync="options"
        :server-items-length="totalBiddingDocuments"
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
              <v-list-item @click="delBiddingDocument(item)">
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
import Dialog from "@/components/Dialog.vue";
import NavLayout from "@/layouts/NavLayout.vue";
import { UserEntity } from "@/store/definitions/user";
@Component({
  name: "BiddingDocumentManagement",
  components: {
    Dialog
  }
})
export default class BiddingDocumentManagement extends Vue {
  @PropSync("layout") layoutSync!: object;
  selected = [] as Array<any>;
  title = "";
  date1 = false;
  date2 = false;
  date3 = false;
  date4 = false;
  readonly = false;
  checkAdd = false;
  checkUpdate = false;
  checkDetail = false;
  bids = [] as Array<any>;
  offeree = null;
  consignment = null;
  consignments = ["A01", "A02", "A03", "A04", "A05", "A06"];
  bidOpening = "";
  bidClosing = "";
  currencyOfPayment = "";
  currencies = ["USD", "EURO", "VND"];
  bidPackagePrice = null;
  bidFloorPrice = null;
  bidStep = null;
  bidDiscountCode = "";
  discounts = ["Sasuke", "Naruto", "Luffy"];
  priceLeadership = null;
  createdAt = "";
  updatedAt = "";
  items = [
    {
      name: "HSMT đã tạo",
      content: "53",
      icon: "mdi-domain"
    },
    {
      name: "HSMT đang thầu",
      content: "75",
      icon: "mdi-dialpad"
    },
    {
      name: "HSMT thành công",
      content: "18",
      icon: "mdi-call-split"
    },
    {
      name: "HSMT thất bại",
      content: "6",
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
  totalBiddingDocuments = 0;
  biddingDocuments = [] as Array<any>;
  loading = true;
  options = {} as any;
  headers = [
    {
      text: "Hàng thầu",
      align: "start",
      sortable: true,
      value: "consignment"
    },
    { text: "Bên mời thầu", value: "offeree" },
    { text: "Thời gian mở thầu", value: "bidOpening" },
    { text: "Thời gian đóng thầu", value: "bidClosing" },
    { text: "Loại tiền tệ", value: "currencyOfPayment" },
    { text: "Mã giảm giá", value: "bidDiscountCode" },
    { text: "Bước thầu", value: "bidStep" },
    { text: "Giá gọi thầu", value: "bidPackagePrice" },
    { text: "Giá sàn", value: "bidFloorPrice" },
    { text: "Ngày tạo", value: "createdAt" },
    { text: "Ngày cập nhập", value: "updatedAt" },
    { text: "Hồ sơ dự thầu", value: "hsdt" },
    { text: "Giá dẫn đầu", value: "priceLeadership" },
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
      this.biddingDocuments = data.items;
      this.totalBiddingDocuments = data.total;
    });
  }
  async mounted() {
    this.getDataFromApi().then((data: any) => {
      this.biddingDocuments = data.items;
      this.totalBiddingDocuments = data.total;
    });
  }
  public getDataFromApi() {
    console.log(this.options);
    this.loading = true;
    return new Promise((resolve, reject) => {
      const { sortBy, sortDesc, page, itemsPerPage } = this.options;

      let items = this.getContainers();
      const total = items.length;

      if (sortBy.length === 1 && sortDesc.length === 1) {
        items = items.sort((a: Array<any>, b: Array<any>) => {
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
  public getContainers(): Array<any> {
    return [
      {
        consignment: "A01",
        offeree: "Admin",
        bidOpening: "2020-06-18",
        bidClosing: "2020-06-22",
        currencyOfPayment: "VND",
        bidDiscountCode: "Sasuke",
        bidStep: 1,
        bidPackagePrice: 10000000,
        bidFloorPrice: 50000000,
        createdAt: "2020-06-18",
        updatedAt: "2020-06-18",
        priceLeadership: 20000000,
        bids: [
          {
            bidder: "forwarder1",
            container: "Xe to 01",
            bidPrice: 50000000,
            currentBidPrice: 20000000,
            bidDate: "2020-06-18",
            bidValidityPeriod: "2020-06-19",
            status: "PENDING",
            createdAt: "2020-06-18",
            updatedAt: "2020-06-18"
          },
          {
            bidder: "forwarder2",
            container: "Xe to 02",
            bidPrice: 40000000,
            currentBidPrice: 20000000,
            bidDate: "2020-06-18",
            bidValidityPeriod: "2020-06-19",
            status: "PENDING",
            createdAt: "2020-06-18",
            updatedAt: "2020-06-18"
          },
          {
            bidder: "forwarder3",
            container: "Xe to 03",
            bidPrice: 20000000,
            currentBidPrice: 20000000,
            bidDate: "2020-06-18",
            bidValidityPeriod: "2020-06-19",
            status: "PENDING",
            createdAt: "2020-06-18",
            updatedAt: "2020-06-18"
          },
        ]
      },
      {
        consignment: "A02",
        offeree: "Admin",
        bidOpening: "2020-06-18",
        bidClosing: "2020-06-22",
        currencyOfPayment: "VND",
        bidDiscountCode: "Sasuke",
        bidStep: 1,
        bidPackagePrice: 10000000,
        bidFloorPrice: 50000000,
        createdAt: "2020-06-18",
        updatedAt: "2020-06-18",
        priceLeadership: 20000000,
        bids: [
          {
            bidder: "forwarder1",
            container: "Xe to 01",
            bidPrice: 50000000,
            currentBidPrice: 20000000,
            bidDate: "2020-06-18",
            bidValidityPeriod: "2020-06-19",
            status: "PENDING",
            createdAt: "2020-06-18",
            updatedAt: "2020-06-18"
          },
          {
            bidder: "forwarder2",
            container: "Xe to 02",
            bidPrice: 40000000,
            currentBidPrice: 20000000,
            bidDate: "2020-06-18",
            bidValidityPeriod: "2020-06-19",
            status: "PENDING",
            createdAt: "2020-06-18",
            updatedAt: "2020-06-18"
          },
          {
            bidder: "forwarder3",
            container: "Xe to 03",
            bidPrice: 20000000,
            currentBidPrice: 20000000,
            bidDate: "2020-06-18",
            bidValidityPeriod: "2020-06-19",
            status: "PENDING",
            createdAt: "2020-06-18",
            updatedAt: "2020-06-18"
          },
        ]
      },
      {
        consignment: "A03",
        offeree: "Admin",
        bidOpening: "2020-06-18",
        bidClosing: "2020-06-22",
        currencyOfPayment: "VND",
        bidDiscountCode: "Sasuke",
        bidStep: 1,
        bidPackagePrice: 10000000,
        bidFloorPrice: 50000000,
        createdAt: "2020-06-18",
        updatedAt: "2020-06-18",
        priceLeadership: 20000000,
        bids: [
          {
            bidder: "forwarder1",
            container: "Xe to 01",
            bidPrice: 50000000,
            currentBidPrice: 20000000,
            bidDate: "2020-06-18",
            bidValidityPeriod: "2020-06-19",
            status: "PENDING",
            createdAt: "2020-06-18",
            updatedAt: "2020-06-18"
          },
          {
            bidder: "forwarder2",
            container: "Xe to 02",
            bidPrice: 40000000,
            currentBidPrice: 20000000,
            bidDate: "2020-06-18",
            bidValidityPeriod: "2020-06-19",
            status: "PENDING",
            createdAt: "2020-06-18",
            updatedAt: "2020-06-18"
          },
          {
            bidder: "forwarder3",
            container: "Xe to 03",
            bidPrice: 20000000,
            currentBidPrice: 20000000,
            bidDate: "2020-06-18",
            bidValidityPeriod: "2020-06-19",
            status: "PENDING",
            createdAt: "2020-06-18",
            updatedAt: "2020-06-18"
          },
        ]
      },
      {
        consignment: "A04",
        offeree: "Admin",
        bidOpening: "2020-06-18",
        bidClosing: "2020-06-22",
        currencyOfPayment: "VND",
        bidDiscountCode: "Sasuke",
        bidStep: 1,
        bidPackagePrice: 10000000,
        bidFloorPrice: 50000000,
        createdAt: "2020-06-18",
        updatedAt: "2020-06-18",
        priceLeadership: 20000000,
        bids: [
          {
            bidder: "forwarder1",
            container: "Xe to 01",
            bidPrice: 50000000,
            currentBidPrice: 20000000,
            bidDate: "2020-06-18",
            bidValidityPeriod: "2020-06-19",
            status: "PENDING",
            createdAt: "2020-06-18",
            updatedAt: "2020-06-18"
          },
          {
            bidder: "forwarder2",
            container: "Xe to 02",
            bidPrice: 40000000,
            currentBidPrice: 20000000,
            bidDate: "2020-06-18",
            bidValidityPeriod: "2020-06-19",
            status: "PENDING",
            createdAt: "2020-06-18",
            updatedAt: "2020-06-18"
          },
          {
            bidder: "forwarder3",
            container: "Xe to 03",
            bidPrice: 20000000,
            currentBidPrice: 20000000,
            bidDate: "2020-06-18",
            bidValidityPeriod: "2020-06-19",
            status: "PENDING",
            createdAt: "2020-06-18",
            updatedAt: "2020-06-18"
          },
        ]
      },
      {
        consignment: "A05",
        offeree: "Admin",
        bidOpening: "2020-06-18",
        bidClosing: "2020-06-22",
        currencyOfPayment: "VND",
        bidDiscountCode: "Sasuke",
        bidStep: 1,
        bidPackagePrice: 10000000,
        bidFloorPrice: 50000000,
        createdAt: "2020-06-18",
        updatedAt: "2020-06-18",
        priceLeadership: 20000000,
        bids: [
          {
            bidder: "forwarder1",
            container: "Xe to 01",
            bidPrice: 50000000,
            currentBidPrice: 20000000,
            bidDate: "2020-06-18",
            bidValidityPeriod: "2020-06-19",
            status: "PENDING",
            createdAt: "2020-06-18",
            updatedAt: "2020-06-18"
          },
          {
            bidder: "forwarder2",
            container: "Xe to 02",
            bidPrice: 40000000,
            currentBidPrice: 20000000,
            bidDate: "2020-06-18",
            bidValidityPeriod: "2020-06-19",
            status: "PENDING",
            createdAt: "2020-06-18",
            updatedAt: "2020-06-18"
          },
          {
            bidder: "forwarder3",
            container: "Xe to 03",
            bidPrice: 20000000,
            currentBidPrice: 20000000,
            bidDate: "2020-06-18",
            bidValidityPeriod: "2020-06-19",
            status: "PENDING",
            createdAt: "2020-06-18",
            updatedAt: "2020-06-18"
          },
        ]
      },
      {
        consignment: "A06",
        offeree: "Admin",
        bidOpening: "2020-06-18",
        bidClosing: "2020-06-22",
        currencyOfPayment: "VND",
        bidDiscountCode: "Sasuke",
        bidStep: 1,
        bidPackagePrice: 10000000,
        bidFloorPrice: 50000000,
        createdAt: "2020-06-18",
        updatedAt: "2020-06-18",
        priceLeadership: 20000000,
        bids: [
          {
            bidder: "forwarder1",
            container: "Xe to 01",
            bidPrice: 50000000,
            currentBidPrice: 20000000,
            bidDate: "2020-06-18",
            bidValidityPeriod: "2020-06-19",
            status: "PENDING",
            createdAt: "2020-06-18",
            updatedAt: "2020-06-18"
          },
          {
            bidder: "forwarder2",
            container: "Xe to 02",
            bidPrice: 40000000,
            currentBidPrice: 20000000,
            bidDate: "2020-06-18",
            bidValidityPeriod: "2020-06-19",
            status: "PENDING",
            createdAt: "2020-06-18",
            updatedAt: "2020-06-18"
          },
          {
            bidder: "forwarder3",
            container: "Xe to 03",
            bidPrice: 20000000,
            currentBidPrice: 20000000,
            bidDate: "2020-06-18",
            bidValidityPeriod: "2020-06-19",
            status: "PENDING",
            createdAt: "2020-06-18",
            updatedAt: "2020-06-18"
          },
        ]
      },
    ];
  }
  public add() {
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
  public addBiddingDocument() {
    this.bidOpening = "";
    this.bidClosing = "";
    this.currencyOfPayment = "";
    this.bidDiscountCode = "";
    this.bidStep = null;
    this.bidPackagePrice = null;
    this.bidFloorPrice = null;
    this.title = "Thêm mới Hồ sơ mời thầu";
    this.checkAdd = true;
    this.checkUpdate = false;
    this.checkDetail = false;
    this.readonly = false;
    this.dialogAdd = true;
  }
  public viewDetail(item: any) {
    this.consignment = item.consignment;
    this.offeree = item.offeree;
    this.bidOpening = item.bidOpening;
    this.bidClosing = item.bidClosing;

    this.currencyOfPayment = item.currencyOfPayment;
    this.bidDiscountCode = item.bidDiscountCode;
    this.bidStep = item.bidStep;
    this.bidPackagePrice = item.bidPackagePrice;
    this.bidFloorPrice = item.bidFloorPrice;
    this.createdAt = item.createdAt;
    this.updatedAt = item.updatedAt;
    this.priceLeadership = item.priceLeadership;
    this.bids = item.bids;
    this.checkAdd = false;
    this.checkUpdate = false;
    this.checkDetail = true;
    this.title = "Thông tin Hồ sơ mời thầu";
    this.readonly = true;
    console.log(this.offeree);
    this.dialogAdd = true;
  }
  public update(item: any) {
    this.bidOpening = item.bidOpening;
    this.bidClosing = item.bidClosing;
    this.currencyOfPayment = item.currencyOfPayment;
    this.bidDiscountCode = item.bidDiscountCode;
    this.bidStep = item.bidStep;
    this.bidPackagePrice = item.bidPackagePrice;
    this.bidFloorPrice = item.bidFloorPrice;
    this.checkAdd = false;
    this.checkUpdate = true;
    this.checkDetail = false;
    this.title = "Cập nhập Hồ sơ mời thầu";
    this.readonly = false;
    this.dialogAdd = true;
  }
  public delBiddingDocument(item: any) {
    this.name = item.containerNumber;
    this.dialogDelSingle = true;
  }
  public delSingle(name: string) {
    this.biddingDocuments = this.biddingDocuments.filter(
      item => item.consignment != name
    );
    this.success = "Xóa thành công";
    this.dialogDelSingle = false;
    this.checkSuccess = true;
  }
  public cancelDelSingle() {
    this.name = "";
    this.dialogDelSingle = false;
  }
  public updateBiddingDocument() {
    this.success = "Cập nhập thành công!";
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
