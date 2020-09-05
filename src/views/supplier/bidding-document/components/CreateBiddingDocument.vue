<template>
  <v-dialog
    v-model="dialogAddSync"
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogAddSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Thêm mới Hồ sơ mời thầu</v-toolbar-title>
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
              :headers="outboundHeaders"
              :items="outbounds"
              item-key="id"
              :loading="loading"
              :options.sync="options"
              :server-items-length="serverSideOptions.totalItems"
              :footer-props="{
                'items-per-page-outboundOptions':
                  serverSideOptions.itemsPerPageItems
              }"
              :actions-append="options.page"
              no-data-text="Danh sách hàng xuất rỗng."
              disable-sort
              class="elevation-0"
            >
              <template v-slot:top>
                <v-toolbar flat color="white">
                  <v-toolbar-title>Danh sách hàng xuất</v-toolbar-title>
                </v-toolbar>
              </template>
              <template v-slot:item.packingTime="{ item }">
                {{ formatDatetime(item.packingTime) }}
              </template>
              <template v-slot:item.cutOffTime="{ item }">
                {{ formatDatetime(item.booking.cutOffTime) }}
              </template>
              <template v-slot:item.status="{ item }">
                <ChipStatus :status="item.status" />
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
              <template v-slot:item.actions="{ item }">
                <v-switch v-model="selectedOutbound" :value="item"></v-switch>
              </template>
            </v-data-table>
            <v-btn
              color="primary"
              @click="stepper = 2"
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
                    type="number"
                    label="Giá sàn"
                  ></v-text-field
                ></v-col>
                <v-col cols="12" md="2">
                  <v-select
                    v-model="biddingDocumentLocal.currencyOfPayment"
                    prepend-icon="strikethrough_s"
                    :items="currenciesOfPayment"
                    :rules="[required('loại tiền tệ')]"
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
              <v-checkbox
                v-model="autoSendCheckbox"
                label="Tự động gửi thư mời thầu cho các chủ xe"
                disabled
              ></v-checkbox>
              <v-checkbox
                v-model="checkbox"
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
import { Component, Vue, PropSync, Watch } from "vue-property-decorator";
import { IBiddingDocument } from "@/entity/bidding-document";
import { IOutbound } from "@/entity/outbound";
import FormValidate from "@/mixin/form-validate";
import Utils from "@/mixin/utils";
import { isEmptyObject, addTimeToDate, addMinutesToDate } from "@/utils/tool";
import { createBiddingDocument } from "@/api/bidding-document";
import { getOutboundByMerchant } from "@/api/outbound";
import { DataOptions } from "vuetify";
import DatetimePicker from "@/components/DatetimePicker.vue";
import ChipStatus from "@/components/ChipStatus.vue";

@Component({
  mixins: [FormValidate, Utils],
  components: {
    DatetimePicker,
    ChipStatus
  }
})
export default class CreateBiddingDocument extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("biddingDocuments", { type: Array })
  biddingDocumentsSync?: Array<IBiddingDocument>;
  @PropSync("outbound", { type: Object })
  outboundSync?: IOutbound;
  @PropSync("totalItems", { type: Number }) totalItemsSync?: number;

  dateInit = addTimeToDate(new Date().toString());
  biddingDocumentLocal = {
    offeree: this.$auth.user().username,
    outbound: -1 as number,
    isMultipleAward: false,
    bidOpening: this.dateInit,
    bidClosing: addMinutesToDate(this.dateInit, 720),
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
  currenciesOfPayment: Array<string> = [];

  // Outbound form
  outbounds: Array<IOutbound> = [];
  selectedOutbound = null as IOutbound | null;
  loading = false;
  options = {
    page: 1,
    itemsPerPage: 10
  } as DataOptions;
  serverSideOptions = {
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
    { text: "Booking No.", value: "booking.number" },
    { text: "Hãng tàu", value: "shippingLine.companyName" },
    { text: "Số cont", value: "unit" },
    { text: "Khối lượng hàng", value: "grossWeight" },
    { text: "Thời gian đóng hàng", value: "packingTime" },
    { text: "Nơi đóng hàng", value: "packingStation" },
    { text: "Thời gian Cut-off", value: "cutOffTime" },
    { text: "Cảng đóng hàng", value: "booking.portOfLoading.fullname" },
    { text: "FCL", value: "fcl" },
    { text: "Trạng thái", value: "status" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  // BiddingDocument
  async createBiddingDocument() {
    if (this.selectedOutbound && this.selectedOutbound.id) {
      this.biddingDocumentLocal.outbound = this.selectedOutbound.id as number;
    }
    const _res = await createBiddingDocument(this.biddingDocumentLocal);
    if (_res.data) {
      const _biddingDocument = _res.data.data;
      if (typeof this.biddingDocumentsSync != "undefined") {
        this.biddingDocumentsSync.unshift(_biddingDocument);
      }
      if (typeof this.totalItemsSync != "undefined") this.totalItemsSync += 1;

      if (this.outboundSync) {
        this.outboundSync.status = "BIDDING";
      }
      this.dialogAddSync = false;
    }
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      if (this.outboundSync && !isEmptyObject(this.outboundSync)) {
        this.outbounds.push(this.outboundSync);
        this.selectedOutbound = this.outboundSync;
        this.serverSideOptions.totalItems = 1;
        this.loading = false;
      } else {
        const _res = await getOutboundByMerchant({
          page: val.page - 1,
          limit: val.itemsPerPage,
          status: "CREATED"
        });
        if (_res.data) {
          const _outbounds = _res.data.data;
          this.outbounds = _outbounds;
          this.serverSideOptions.totalItems = _res.data.totalElements;
        }
        this.loading = false;
      }
      this.loading = false;
    }
  }

  created() {
    this.currenciesOfPayment = ["VND", "USD"];
  }
}
</script>
