<template>
  <v-dialog
    v-model="dialogEditSync"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogEditSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Cập nhập</v-toolbar-title>
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
              :headers="headers"
              :items="[biddingDocument.outbound]"
              item-key="id"
              :hide-default-footer="true"
              class="elevation-1 my-1"
            >
              <!--  -->
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Danh sách hàng xuất</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
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
            </v-data-table>
            <v-btn
              color="primary"
              @click="stepper = 2"
              :disabled="isEmptyObject(biddingDocumentLocal.outbound)"
              >Tiếp tục</v-btn
            >
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable"
            >Chi tiết đấu thầu</v-stepper-step
          >

          <v-stepper-content step="2">
            <v-form ref="billOfLadingForm" v-model="valid" lazy-validation>
              <v-layout row
                ><v-layout col
                  ><v-flex xs7>
                    <v-menu
                      ref="bidOpeningPicker"
                      v-model="bidOpeningPicker"
                      :close-on-content-click="false"
                      :return-value.sync="bidOpening"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="bidOpening"
                          label="Thời gian mở thầu"
                          prepend-icon="event_available"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                          :rules="[required('bid opening')]"
                        ></v-text-field>
                      </template>
                    </v-menu> </v-flex
                  ><v-flex xs3>
                    <v-text-field
                      label="Giờ mở thầu"
                      name="timeOpening"
                      type="time"
                      v-model="timeOpening"
                    ></v-text-field> </v-flex
                ></v-layout>
                <!-- Bid Closing --><v-layout col
                  ><v-flex xs9>
                    <v-menu
                      ref="bidClosingPicker"
                      v-model="bidClosingPicker"
                      :close-on-content-click="false"
                      :return-value.sync="bidClosing"
                      transition="scale-transition"
                      offset-y
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="bidClosing"
                          label="Thời gian đóng thầu"
                          prepend-icon="event_busy"
                          v-bind="attrs"
                          v-on="on"
                          :rules="[required('bid closing')]"
                        ></v-text-field>
                      </template>
                      <v-date-picker v-model="bidClosing" no-title scrollable>
                        <v-spacer></v-spacer>
                        <v-btn
                          text
                          color="primary"
                          @click="bidClosingPicker = false"
                          >Cancel</v-btn
                        >
                        <v-btn
                          text
                          color="primary"
                          @click="$refs.bidClosingPicker.save(bidClosing)"
                          >OK</v-btn
                        >
                      </v-date-picker>
                    </v-menu></v-flex
                  ><v-flex xs3>
                    <v-text-field
                      label="Giờ đóng thầu"
                      name="timeClosing"
                      type="time"
                      v-model="timeClosing"
                    ></v-text-field> </v-flex></v-layout
              ></v-layout>
              <v-layout row
                ><v-layout col
                  ><v-flex xs10>
                    <v-text-field
                      v-model="biddingDocumentLocal.bidPackagePrice"
                      :hint="
                        currencyFormatter(
                          biddingDocumentLocal.bidPackagePrice,
                          biddingDocumentLocal.currencyOfPayment
                        )
                      "
                      prepend-icon="money"
                      :rules="[required('bid package price')]"
                      type="number"
                      label="Giá gói thầu"
                    ></v-text-field> </v-flex></v-layout
                ><v-layout col
                  ><v-flex xs10>
                    <v-text-field
                      v-model="biddingDocumentLocal.bidFloorPrice"
                      :hint="
                        currencyFormatter(
                          biddingDocumentLocal.bidFloorPrice,
                          biddingDocumentLocal.currencyOfPayment
                        )
                      "
                      prepend-icon="local_atm"
                      :rules="[
                        required('bid floor price'),
                        maxNumber(
                          'bid floor price',
                          parseInt(biddingDocumentLocal.bidPackagePrice)
                        )
                      ]"
                      type="number"
                      label="Giá sàn"
                    ></v-text-field
                  ></v-flex>
                  <v-flex xs2>
                    <v-select
                      v-model="biddingDocumentLocal.currencyOfPayment"
                      prepend-icon="strikethrough_s"
                      :items="currencyOfPayments"
                      :rules="[required('currency')]"
                      label="Loại tiền tệ"
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-layout>
              <v-checkbox
                v-model="biddingDocumentLocal.isMultipleAward"
                label="Cho phép nhiều nhà thầu cùng thắng"
              ></v-checkbox>
              <v-btn
                color="primary"
                @click="updateBiddingDocument()"
                :disabled="!valid"
                >Lưu và Tiếp tục</v-btn
              >
              <v-btn text @click="stepper = 1">Quay lại</v-btn>
            </v-form>
          </v-stepper-content>
          <!-- FINISH -->
          <v-stepper-step step="3">Hoàn thành</v-stepper-step>
          <v-stepper-content step="3">
            <v-form ref="finishForm">
              <v-text-field
                v-model="biddingDocumentLocal.discount"
                type="text"
                prepend-icon="loyalty"
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
                @click="updateBiddingDocument()"
                :disabled="!checkbox"
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
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IBiddingDocument } from "@/entity/bidding-document";
import FormValidate from "@/mixin/form-validate";
import Utils from "@/mixin/utils";
import { updateBiddingDocument } from "@/api/bidding-document";
import { IOutbound } from "@/entity/outbound";
import { addTimeToDate } from "@/utils/tool";

@Component({
  mixins: [FormValidate, Utils]
})
export default class UpdateBiddingDocument extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @PropSync("biddingDocuments", { type: Array })
  biddingDocumentsSync!: Array<IBiddingDocument>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @Prop(Object)
  biddingDocument!: IBiddingDocument;

  dateInit = addTimeToDate(new Date().toString());
  biddingDocumentLocal = {
    offeree: this.$auth.user().username,
    outbound: -1 as number,
    discount: "",
    isMultipleAward: false,
    bidOpening: this.dateInit.slice(0, 10),
    bidClosing: this.dateInit.slice(0, 10),
    dateOfDecision: this.dateInit.slice(0, 10),
    currencyOfPayment: "VND",
    bidPackagePrice: 0,
    bidFloorPrice: 0,
    priceLeadership: 0,
    status: "BIDDING"
  } as IBiddingDocument;
  // Form validate
  autoSendCheckbox = true;
  checkbox = false;
  editable = true;
  stepper = 1;
  valid = true;
  timeOpening = this.dateInit.slice(11, 16);
  timeClosing = this.dateInit.slice(11, 16);
  // API list
  currencyOfPayments: Array<string> = [];
  unitOfMeasurements: Array<string> = [];
  outbound = [] as Array<IOutbound>;
  bidOpening = this.dateInit.slice(0, 10);
  bidClosing = this.dateInit.slice(0, 10);

  // biddingDocument form
  bidOpeningPicker = false;
  bidClosingPicker = false;
  // Outbound form
  headers = [
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
    { text: "FCL", value: "fcl" }
  ];

  created() {
    this.biddingDocumentLocal = Object.assign({}, this.biddingDocument);
    this.bidOpening = this.biddingDocumentLocal.bidOpening.slice(0, 10);
    this.timeOpening = this.biddingDocumentLocal.bidOpening.slice(11, 16);
    this.bidClosing = this.biddingDocumentLocal.bidClosing.slice(0, 10);
    this.timeClosing = this.biddingDocumentLocal.bidClosing.slice(11, 16);
    if (
      typeof this.biddingDocument.outbound != "number" &&
      typeof this.biddingDocument.outbound.id != "undefined"
    ) {
      this.biddingDocumentLocal.outbound = this.biddingDocument.outbound.id;
    }
  }
  // BiddingDocument
  updateBiddingDocument() {
    // TODO: API create biddingDocument
    if (this.biddingDocumentLocal) {
      this.biddingDocumentLocal.bidOpening =
        this.bidOpening + "T" + this.timeOpening;
      this.biddingDocumentLocal.bidClosing =
        this.bidClosing + "T" + this.timeClosing;
      updateBiddingDocument(this.biddingDocumentLocal)
        .then(res => {
          console.log(res.data);
          const response: IBiddingDocument = res.data;
          this.messageSync = "Cập nhập thành công HSMT: " + response.id;
          const index = this.biddingDocumentsSync.findIndex(
            x => x.id === response.id
          );
          this.biddingDocumentsSync.splice(index, 1, response);
          this.stepper = 3;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }

  mounted() {
    //
    this.currencyOfPayments = ["VND", "USD"];
    this.unitOfMeasurements = ["KG", "Ton"];
  }
}
</script>
