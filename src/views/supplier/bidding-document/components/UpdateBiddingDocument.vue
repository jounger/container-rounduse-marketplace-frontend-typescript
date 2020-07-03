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
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialogEditSync = false">Save</v-btn>
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
              :headers="headers"
              :items="[biddingDocumentSync.outbound]"
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
                {{ item.grossWeight }} {{ item.unitOfMesurement }}
              </template>
              <template v-slot:item.fcl="{ item }">
                {{ item.booking.isFcl ? "Có" : "Không" }}
              </template>
              <template v-slot:item.unit="{ item }">
                {{ item.booking.unit }} x {{ item.containerType }}
              </template>
            </v-data-table>
            <v-btn
              color="primary"
              @click="
                !isEmptyObject(biddingDocumentSync.outbound)
                  ? (stepper = 2)
                  : (stepper = 1)
              "
              :disabled="isEmptyObject(biddingDocumentSync.outbound)"
              >Tiếp tục</v-btn
            >
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable"
            >Chi tiết đấu thầu</v-stepper-step
          >

          <v-stepper-content step="2">
            <v-form ref="billOfLadingForm" v-model="valid" lazy-validation>
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
                      $refs.datePickerMenu.save(biddingDocumentSync.bidOpening)
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
                      $refs.datePickerMenu2.save(biddingDocumentSync.bidClosing)
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
              <v-btn
                color="primary"
                @click="
                  updateBiddingDocument();
                  stepper = 3;
                "
                :disabled="!valid"
                >Lưu và Tiếp tục</v-btn
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
                @click="updateBiddingDocument()"
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
import FormValidate from "@/mixin/form-validate";
import Utils from "@/mixin/utils";
import { updateBiddingDocument } from "@/api/bidding-document";
import { IOutbound } from "@/entity/outbound";
import Outbound from "../../../supply/outbound/index.vue";

@Component({
  mixins: [FormValidate, Utils]
})
export default class UpdateBiddingDocument extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @PropSync("biddingDocument", { type: Object })
  biddingDocumentSync!: IBiddingDocument;
  @PropSync("biddingDocuments", { type: Array })
  biddingDocumentsSync!: Array<IBiddingDocument>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  // Form validate
  autoSendCheckbox = true;
  checkbox = false;
  editable = true;
  stepper = 1;
  valid = true;
  // API list
  currencyOfPayments: Array<string> = [];
  unitOfMesurements: Array<string> = [];
  outbound = [] as Array<IOutbound>;
  // biddingDocumentSync form
  datePickerMenu = false;
  datePickerMenu2 = false;
  biddingDocumentLocal = {} as IBiddingDocument;
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
    this.biddingDocumentLocal = Object.assign({}, this.biddingDocumentSync);
    if (
      typeof this.biddingDocumentSync.outbound != "number" &&
      typeof this.biddingDocumentSync.outbound.id != "undefined"
    ) {
      this.biddingDocumentLocal.outbound = this.biddingDocumentSync.outbound.id;
    }
  }
  // BiddingDocument
  updateBiddingDocument() {
    // TODO: API create biddingDocument
    if (this.biddingDocumentSync) {
      updateBiddingDocument(this.biddingDocumentLocal)
        .then(res => {
          console.log(res.data);
          const response: IBiddingDocument = res.data;
          this.biddingDocumentSync = response;
          this.messageSync =
            "Cập nhập thành công HSMT: " + this.biddingDocumentSync.id;
          const index = this.biddingDocumentsSync.findIndex(
            x => x.id === this.biddingDocumentSync.id
          );
          this.biddingDocumentsSync.splice(index, 1, this.biddingDocumentSync);
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
    this.unitOfMesurements = ["KG", "Ton"];
  }
}
</script>