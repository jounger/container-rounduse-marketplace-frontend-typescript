<template>
  <v-dialog
    v-model="dialogEditSync"
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogEditSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Cập nhật</v-toolbar-title>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-list three-line subheader>
        <v-stepper v-model="stepper" vertical class="elevation-0">
          <v-stepper-step :complete="stepper > 1" step="1" :editable="editable">
            Chọn hàng xuất đấu thầu
            <small>Thông tin bắt buộc</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-data-table
              :headers="headers"
              :items="[biddingDocument.outbound]"
              item-key="id"
              no-data-text="Danh sách hàng xuất nhận được rỗng."
              disable-sort
              class="elevation-0"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Danh sách hàng xuất</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-spacer></v-spacer>
                </v-toolbar>
              </template>
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
                {{ item.booking.unit + " x " + item.containerType.name }}
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
              <v-row
                ><v-col cols="12" md="6">
                  <DatetimePicker
                    :datetime="biddingDocumentLocal.bidOpening"
                    :return-value.sync="biddingDocumentLocal.bidOpening"
                    dateicon="event_available"
                    datelabel="Ngày mở thầu"
                    timelabel="Giờ mở thầu"
                    disabled
                  />
                </v-col>
                <!-- Bid Closing -->
                <v-col cols="12" md="6">
                  <DatetimePicker
                    :datetime="biddingDocumentLocal.bidClosing"
                    :return-value.sync="biddingDocumentLocal.bidClosing"
                    dateicon="event_busy"
                    datelabel="Ngày đóng thầu"
                    timelabel="Giờ đóng thầu"
                  /> </v-col
              ></v-row>
              <v-row
                ><v-col cols="12" md="6">
                  <v-text-field
                    v-model="biddingDocumentLocal.bidPackagePrice"
                    :hint="
                      currencyFormatter(
                        biddingDocumentLocal.bidPackagePrice,
                        biddingDocumentLocal.currencyOfPayment
                      )
                    "
                    prepend-icon="money"
                    :rules="[
                      required('giá gói thầu'),
                      minNumber('Giá gói thầu', 0)
                    ]"
                    type="number"
                    label="Giá gói thầu"
                  ></v-text-field> </v-col
                ><v-col cols="12" md="4">
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
                      required('giá sản'),
                      maxNumber(
                        'Giá sàn',
                        parseInt(biddingDocumentLocal.bidPackagePrice)
                      ),
                      minNumber('Giá sàn', 0)
                    ]"
                    type="number"
                    label="Giá sàn"
                  ></v-text-field
                ></v-col>
                <v-col cols="12" md="2">
                  <v-select
                    v-model="biddingDocumentLocal.currencyOfPayment"
                    prepend-icon="strikethrough_s"
                    :items="currencyOfPayments"
                    :rules="[required('currency')]"
                    label="Loại tiền tệ"
                  ></v-select>
                </v-col>
              </v-row>
              <v-checkbox
                v-model="biddingDocumentLocal.isMultipleAward"
                label="Cho phép nhiều nhà thầu cùng thắng"
                readonly
              ></v-checkbox>
              <v-btn
                color="primary"
                @click="updateBiddingDocument()"
                :disabled="!valid"
                >Lưu và Hoàn tất</v-btn
              >
              <v-btn text @click="stepper = 1">Quay lại</v-btn>
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
import { editBiddingDocument } from "@/api/bidding-document";
import { IOutbound } from "@/entity/outbound";
import { addTimeToDate } from "@/utils/tool";
import DatetimePicker from "@/components/DatetimePicker.vue";

@Component({
  mixins: [FormValidate, Utils],
  components: {
    DatetimePicker
  }
})
export default class UpdateBiddingDocument extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @Prop(Object) biddingDocument!: IBiddingDocument;
  @PropSync("biddingDocuments", { type: Array })
  biddingDocumentsSync!: Array<IBiddingDocument>;

  dateInit = addTimeToDate(new Date().toString());
  biddingDocumentLocal = {
    offeree: this.$auth.user().username,
    outbound: -1 as number,
    isMultipleAward: false,
    bidOpening: this.dateInit,
    bidClosing: this.dateInit,
    dateOfDecision: this.dateInit,
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
  // API list
  currencyOfPayments: Array<string> = [];
  unitOfMeasurements: Array<string> = [];
  outbound = [] as Array<IOutbound>;
  // Outbound form
  headers = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    { text: "Booking No.", value: "booking.number" },
    { text: "Hãng tàu", value: "shippingLine.companyName" },
    { text: "Trạng thái", value: "status" },
    { text: "Thời gian đóng hàng", value: "packingTime" },
    { text: "Thời gian tàu chạy", value: "cutOffTime" },
    { text: "Nơi đóng hàng", value: "packingStation" },
    { text: "Cảng đóng hàng", value: "booking.portOfLoading.fullname" },
    { text: "Khối lượng hàng", value: "grossWeight" },
    { text: "Số cont", value: "unit" },
    { text: "FCL", value: "fcl" }
  ];

  created() {
    this.biddingDocumentLocal = Object.assign({}, this.biddingDocument);
    if (
      typeof this.biddingDocument.outbound != "number" &&
      typeof this.biddingDocument.outbound.id != "undefined"
    ) {
      this.biddingDocumentLocal.outbound = this.biddingDocument.outbound.id;
    }
  }

  async updateBiddingDocument() {
    if (this.biddingDocumentLocal) {
      const _res = await editBiddingDocument(
        this.biddingDocumentLocal.id as number,
        this.biddingDocumentLocal
      );
      if (_res.data) {
        const _biddingDocument = _res.data.data;
        const index = this.biddingDocumentsSync.findIndex(
          x => x.id === _biddingDocument.id
        );
        this.biddingDocumentsSync.splice(index, 1, _biddingDocument);
        this.dialogEditSync = false;
      }
    }
  }

  mounted() {
    this.currencyOfPayments = ["VND", "USD"];
    this.unitOfMeasurements = ["KG"];
  }
}
</script>
