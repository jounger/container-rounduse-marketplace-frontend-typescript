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
                <v-switch v-model="selectedOutbound" :value="item"></v-switch>
              </template>
            </v-data-table>
            <v-btn
              color="primary"
              @click="
                stepper = 2;
                valid = false;
              "
              :disabled="!selectedOutbound"
              >Tiếp tục</v-btn
            >
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable"
            >Chi tiết đấu thầu</v-stepper-step
          >

          <v-stepper-content step="2">
            <v-form ref="billOfLadingForm" v-model="valid" validation>
              <v-row
                ><v-col cols="12" md="6">
                  <DatetimePicker
                    :datetime="biddingDocumentLocal.bidOpening"
                    :return-value.sync="biddingDocumentLocal.bidOpening"
                    dateicon="event_available"
                    datelabel="Ngày mở thầu"
                    timelabel="Giờ mở thầu"
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
                    :rules="[required('bid package price')]"
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
                      required('bid floor price'),
                      maxNumber(
                        'bid floor price',
                        parseInt(biddingDocumentLocal.bidPackagePrice)
                      )
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
                @click="createBiddingDocument()"
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
import { Component, Vue, PropSync } from "vue-property-decorator";
import { IBiddingDocument } from "@/entity/bidding-document";
import { IOutbound } from "@/entity/outbound";
import FormValidate from "@/mixin/form-validate";
import Utils from "@/mixin/utils";
import { isEmptyObject, addTimeToDate, getErrorMessage } from "@/utils/tool";
import { createBiddingDocument } from "@/api/bidding-document";
import { getOutboundByMerchant } from "@/api/outbound";
import { PaginationResponse } from "@/api/payload";
import DatetimePicker from "@/components/DatetimePicker.vue";
import snackbar from "@/store/modules/snackbar";

@Component({
  mixins: [FormValidate, Utils],
  components: {
    DatetimePicker
  }
})
export default class CreateBiddingDocument extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("biddingDocuments", { type: Array })
  biddingDocumentsSync!: Array<IBiddingDocument>;
  @PropSync("outbound", { type: Object })
  outboundSync?: IOutbound;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;

  dateInit = addTimeToDate(new Date().toString());
  biddingDocumentLocal = {
    offeree: this.$auth.user().username,
    outbound: -1 as number,
    discount: "",
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
  editable = false;
  stepper = 1;
  valid = true;
  // API list
  currencyOfPayments: Array<string> = [];
  unitOfMeasurements: Array<string> = [];

  // Outbound form
  outbounds: Array<IOutbound> = [];
  selectedOutbound = null as IOutbound | null;
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
      text: "Chọn hàng xuất",
      value: "actions"
    }
  ];

  // BiddingDocument
  async createBiddingDocument() {
    // TODO: API create biddingDocument
    if (this.selectedOutbound && this.selectedOutbound.id) {
      this.biddingDocumentLocal.outbound = this.selectedOutbound.id as number;
    }
    console.log(this.biddingDocumentLocal);
    const _biddingDocument = await createBiddingDocument(
      this.biddingDocumentLocal
    )
      .then(res => {
        console.log(res.data);
        const response: IBiddingDocument = res.data;
        snackbar.setSnackbar({
          text: "Thêm mới thành công HSMT: " + response.id,
          color: "success"
        });
        return response;
      })
      .catch(err => {
        console.log(err);
        snackbar.setSnackbar({
          text: getErrorMessage(err),
          color: "error"
        });
        return null;
      });
    if (_biddingDocument) {
      this.biddingDocumentsSync.unshift(_biddingDocument);
      this.totalItemsSync += 1;

      if (this.outboundSync) {
        this.outboundSync.status = "BIDDING";
      }
    }
    snackbar.setDisplay(true);
  }

  async created() {
    // TODO: API get Outbound
    if (this.outboundSync && !isEmptyObject(this.outboundSync)) {
      this.outbounds.push(this.outboundSync);
      this.selectedOutbound = this.outboundSync;
      this.outboundOptions.totalItems = 1;
      this.loading = false;
    } else {
      const _outbound = await getOutboundByMerchant({
        page: this.outboundOptions.page - 1,
        limit: this.outboundOptions.itemsPerPage,
        status: "CREATED"
      })
        .then(res => {
          const response: PaginationResponse<IOutbound> = res.data;
          console.log("response", response);
          return response;
        })
        .catch(err => console.log(err));
      this.loading = false;
      if (_outbound) {
        this.outbounds = _outbound.data;
        this.outboundOptions.totalItems = _outbound.totalElements;
      }
    }
    // TODO: API get other info
    this.currencyOfPayments = ["VND", "USD"];
    this.unitOfMeasurements = ["KG", "Ton"];
  }
}
</script>
