<template>
  <v-dialog
    v-model="dialogAddSync"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogAddSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Thêm mới</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialogAddSync = false">Save</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-list three-line subheader>
        <v-stepper v-model="stepper" vertical>
          <v-stepper-step :complete="stepper > 1" step="1" :editable="editable">
            Chọn hàng xuất đấu thầu
            <small>Thông tin bắt buộc</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-data-table
              :headers="outboundHeaders"
              :items="outbounds"
              item-key="id"
              :loading="loading"
              :options.sync="outboundOptions"
              :server-items-length="outboundOptions.totalItems"
              :footer-props="{
                'items-per-page-outboundOptions':
                  outboundOptions.itemsPerPageItems
              }"
              :actions-append="outboundOptions.page"
              class="elevation-1 my-1"
            >
              <!--  -->
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Danh sách hàng xuất</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" dark class="mb-2" to="/outbound">
                    Thêm mới
                  </v-btn>
                </v-toolbar>
              </template>
              <!--  -->
              <template v-slot:item.packingTime="{ item }">
                {{ formatDatetime(item.packingTime) }}
              </template>
              <template v-slot:item.cutOffTime="{ item }">
                {{ formatDatetime(item.booking.cutOffTime) }}
              </template>
              <template v-slot:item.grossWeight="{ item }">
                {{ item.grossWeight + "" + item.unitOfMeasurement }}
              </template>
              <template v-slot:item.fcl="{ item }">
                {{ item.booking.isFcl ? "Có" : "Không" }}
              </template>
              <template v-slot:item.unit="{ item }">
                {{ item.booking.unit + " x " + item.containerType }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  class="ma-2"
                  tile
                  outlined
                  color="success"
                  @click="selectOutbound(item)"
                >
                  <v-icon left>mdi-pencil</v-icon>
                  {{
                    selectedOutbound && selectedOutbound.id === item.id
                      ? "Bỏ"
                      : "Chọn"
                  }}
                </v-btn>
              </template>
            </v-data-table>
            <v-btn
              color="primary"
              @click="
                !isEmptyObject(selectedOutbound) ? (stepper = 2) : (stepper = 1)
              "
              :disabled="isEmptyObject(selectedOutbound)"
              >Tiếp tục</v-btn
            >
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable"
            >Chi tiết đấu thầu</v-stepper-step
          >

          <v-stepper-content step="2">
            <v-form ref="billOfLadingForm" v-model="valid" validation>
              <v-menu
                ref="datePickerMenu"
                v-model="datePickerMenu"
                :close-on-content-click="false"
                :return-value.sync="biddingDocumentLocal.bidOpening"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="biddingDocumentLocal.bidOpening"
                    label="Thời gian mở thầu"
                    prepend-icon="event"
                    v-bind="attrs"
                    v-on="on"
                    :rules="[required('bid opening')]"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="biddingDocumentLocal.bidOpening"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="datePickerMenu = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    text
                    color="primary"
                    @click="
                      $refs.datePickerMenu.save(biddingDocumentLocal.bidOpening)
                    "
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>
              <!-- Bid Closing -->
              <v-menu
                ref="datePickerMenu2"
                v-model="datePickerMenu2"
                :close-on-content-click="false"
                :return-value.sync="biddingDocumentLocal.bidClosing"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="biddingDocumentLocal.bidClosing"
                    label="Thời gian đóng thầu"
                    prepend-icon="event"
                    v-bind="attrs"
                    v-on="on"
                    :rules="[required('bid closing')]"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="biddingDocumentLocal.bidClosing"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="datePickerMenu2 = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    text
                    color="primary"
                    @click="
                      $refs.datePickerMenu2.save(
                        biddingDocumentLocal.bidClosing
                      )
                    "
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>
              <v-select
                v-model="biddingDocumentLocal.currencyOfPayment"
                :items="currencyOfPayments"
                :rules="[required('currency')]"
                label="Đồng tiền thanh toán"
              ></v-select>
              <v-text-field
                v-model="biddingDocumentLocal.bidPackagePrice"
                :rules="[required('bid package price')]"
                type="number"
                label="Giá gói thầu"
              ></v-text-field>
              <v-text-field
                v-model="biddingDocumentLocal.bidFloorPrice"
                :rules="[
                  required('bid floor price'),
                  maxNumber(
                    'bid floor price',
                    biddingDocumentLocal.bidPackagePrice
                  )
                ]"
                type="number"
                label="Giá sàn"
              ></v-text-field>
              <v-checkbox
                v-model="biddingDocumentLocal.isMultipleAward"
                label="Cho phép nhiều nhà thầu cùng thắng"
              ></v-checkbox>
              <v-btn color="primary" @click="stepper = 3" :disabled="!valid"
                >Tiếp tục</v-btn
              >
              <v-btn text @click="stepper = 1">Quay lại</v-btn>
            </v-form>
          </v-stepper-content>
          <!-- FINISH -->
          <v-stepper-step step="3">Hoàn thành</v-stepper-step>
          <v-stepper-content step="3">
            <v-form ref="finishForm" v-model="valid" lazy-validation>
              <v-text-field
                v-model="biddingDocumentLocal.bidDiscountCode"
                prepend-icon="event"
                label="Mã giảm giá"
              ></v-text-field>
              <v-checkbox
                v-model="autoSendCheckbox"
                label="Tự động gửi thư mời thầu"
              ></v-checkbox>
              <v-checkbox
                v-model="checkbox"
                :rules="[required('agree term')]"
                label="Bạn đồng ý rằng tất cả các thông tin đưa lên đều là chính xác."
              ></v-checkbox>
              <v-btn
                color="primary"
                @click="createBiddingDocument()"
                :disabled="!valid"
                >Hoàn tất</v-btn
              >
              <v-btn text @click="stepper = 2">Quay lại</v-btn>
            </v-form>
          </v-stepper-content>
        </v-stepper>
      </v-list>
      <!-- END CONTENT -->
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { IBiddingDocument } from "@/entity/bidding-document";
import { IOutbound } from "@/entity/outbound";
import FormValidate from "@/mixin/form-validate";
import Utils from "@/mixin/utils";
import { isEmptyObject, addTimeToDate } from "@/utils/tool";
import { createBiddingDocument } from "@/api/bidding-document";
import { getOutboundByMerchant } from "@/api/outbound";
import { PaginationResponse } from "@/api/payload";

@Component({
  mixins: [FormValidate, Utils]
})
export default class CreateBiddingDocument extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("biddingDocuments", { type: Array })
  biddingDocumentsSync!: Array<IBiddingDocument>;
  @PropSync("outbound", { type: Object })
  outboundSync?: IOutbound;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  dateInit = new Date().toISOString().substr(0, 10);
  biddingDocumentLocal = {
    offeree: this.$auth.user().username,
    outbound: -1 as number,
    bidDiscountCode: "",
    isMultipleAward: false,
    bidOpening: this.dateInit,
    bidClosing: this.dateInit,
    dateOfDecision: this.dateInit,
    currencyOfPayment: "VND",
    bidPackagePrice: 0,
    bidFloorPrice: 0,
    priceLeadership: 0
  } as IBiddingDocument;
  // Form validate
  autoSendCheckbox = true;
  checkbox = false;
  editable = false;
  stepper = 1;
  valid = true;
  // API list
  currencyOfPayments: Array<string> = [];
  unitOfMeasurements: Array<string> = [];

  // biddingDocumentLocal form
  datePickerMenu = false;
  datePickerMenu2 = false;

  // Outbound form
  outbounds: Array<IOutbound> = [];
  selectedOutbound = {} as IOutbound;
  loading = false;
  outboundOptions = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  outboundHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    { text: "Booking No.", value: "booking.bookingNumber" },
    { text: "Hãng tàu", value: "shippingLine" },
    { text: "Trạng thái", value: "status" },
    { text: "Thời gian đóng hàng", value: "packingTime" },
    { text: "Thời gian tàu chạy", value: "cutOffTime" },
    { text: "Nơi đóng hàng", value: "packingStation" },
    { text: "Cảng đóng hàng", value: "booking.portOfLoading" },
    { text: "Khối lượng hàng", value: "grossWeight" },
    { text: "Số cont", value: "unit" },
    { text: "FCL", value: "fcl" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  selectOutbound(item: IOutbound) {
    if (this.selectedOutbound && this.selectedOutbound.id === item.id) {
      // unselected item
      this.selectedOutbound = {} as IOutbound;
    } else {
      // select item
      if (item.id) {
        this.selectedOutbound = item;
      }
    }
  }

  // BiddingDocument
  createBiddingDocument() {
    // TODO: API create biddingDocument
    this.biddingDocumentLocal.bidOpening = addTimeToDate(
      this.biddingDocumentLocal.bidOpening
    );
    this.biddingDocumentLocal.bidClosing = addTimeToDate(
      this.biddingDocumentLocal.bidClosing
    );
    this.biddingDocumentLocal.outbound = this.selectedOutbound.id as number;
    console.log(this.biddingDocumentLocal);
    createBiddingDocument(this.biddingDocumentLocal)
      .then(res => {
        console.log(res.data);
        const response: IBiddingDocument = res.data;
        this.messageSync = "Thêm mới thành công HSMT: " + response.id;
        if (typeof this.biddingDocumentsSync != "undefined") {
          this.biddingDocumentsSync.unshift(response);
        }
      })
      .catch(err => {
        console.log(err);
        this.messageSync = "Đã có lỗi xảy ra";
      })
      .finally(() => (this.snackbarSync = true));
  }

  mounted() {
    // TODO: API get Outbound
    if (this.outboundSync && !isEmptyObject(this.outboundSync)) {
      this.outbounds.push(this.outboundSync);
      this.selectOutbound(this.outboundSync);
    } else {
      getOutboundByMerchant(this.$auth.user().id, {
        page: this.outboundOptions.page - 1,
        limit: this.outboundOptions.itemsPerPage,
        status: "CREATED"
      })
        .then(res => {
          const response: PaginationResponse<IOutbound> = res.data;
          console.log("response", response);
          this.outbounds = response.data;
          this.outboundOptions.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }

    this.outboundOptions.totalItems = 10;
    this.loading = false;
    //
    this.currencyOfPayments = ["VND", "USD"];
    this.unitOfMeasurements = ["KG", "Ton"];
  }
}
</script>
