<template>
  <v-content>
    <v-container class="d-flex justify-space-around align-start">
      <!-- OUTOUNBD -->
      <v-card class="order-0 flex-grow-0 mx-auto mr-5 my-12" max-width="300">
        <v-row justify="center">
          <ConfirmBid
            v-if="dialogConfirm"
            :dialogConfirm.sync="dialogConfirm"
            :biddingDocument.sync="biddingDocument"
            :message.sync="message"
            :snackbar.sync="snackbar"
            :status="status"
            :bid="bid"
          />
        </v-row>
        <v-img height="150" src="@/assets/images/biddingdocument.jpg"></v-img>

        <v-card-title>Hồ sơ Mời thầu</v-card-title>

        <v-card-text>
          <v-row align="center" class="mx-0">
            <div class="grey--text mr-4">{{ biddingDocument.offeree }}</div>
            <v-rating
              :value="4.5"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>

            <div class="grey--text ml-4">4.5 (413)</div>
          </v-row>

          <v-list dense>
            <v-subheader>Thong tin HSMT</v-subheader>
            <v-list-item-group color="primary">
              <v-list-item @click="check()">
                <v-list-item-icon>
                  <v-icon>mdi-flag</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{
                    "Giá gói thầu: " +
                      biddingDocument.bidPackagePrice +
                      biddingDocument.currencyOfPayment
                  }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{
                      "Giá sàn: " +
                        biddingDocument.bidFloorPrice +
                        biddingDocument.currencyOfPayment
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>

          <v-list dense>
            <v-subheader>Thong tin Hàng Xuất</v-subheader>
            <v-list-item-group color="primary">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-flag</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{
                    "Booking No.: " +
                      biddingDocument.outbound.booking.bookingNumber
                  }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{
                      "Cảng bốc hàng: " +
                        biddingDocument.outbound.booking.portOfLoading
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-flag</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{
                    "Hãng tàu: " + biddingDocument.outbound.shippingLine
                  }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{
                      "Số lượng: " +
                        biddingDocument.outbound.booking.unit +
                        " x " +
                        biddingDocument.outbound.containerType
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-flag</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{
                    "Đóng tại: " + biddingDocument.outbound.packingStation
                  }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{
                      "Thời gian: " +
                        formatDatetime(biddingDocument.outbound.packingTime)
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>mdi-flag</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{
                    "Mô tả: " + biddingDocument.outbound.goodsDescription
                  }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{
                      "Khối lượng: " +
                        biddingDocument.outbound.payload +
                        biddingDocument.outbound.unitOfMeasurement
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-title>Thời gian dự thầu</v-card-title>

        <v-card-text>
          <v-chip-group
            v-model="selection"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip
              >Mở thầu: {{ formatDatetime(biddingDocument.bidOpening) }}</v-chip
            >

            <v-chip
              >Đóng thầu:
              {{ formatDatetime(biddingDocument.bidClosing) }}</v-chip
            >
          </v-chip-group>
        </v-card-text>
      </v-card>
      <!-- BIDDING -->
      <v-card class="order-1 flex-grow-1 mx-auto my-12">
        <Snackbar :text="message" :snackbar.sync="snackbar" />
        <v-card-title>Thông tin đấu thầu</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-flag</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{
                      "Giá dẫn đầu: " +
                        biddingDocument.priceLeadership +
                        biddingDocument.currencyOfPayment
                    }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{
                        "Giá sàn: " +
                          biddingDocument.bidFloorPrice +
                          biddingDocument.currencyOfPayment
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-flag</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{
                      "Đóng thầu: " + formatDatetime(biddingDocument.bidClosing)
                    }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{
                        new Date(this.biddingDocument.bidClosing).getTime() -
                          new Date() >
                        0
                          ? "Còn lại: " +
                            Math.floor(
                              (new Date(
                                this.biddingDocument.bidClosing
                              ).getTime() -
                                new Date()) /
                                3600000
                            ) +
                            " giờ"
                          : "Đã hết hạn"
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>mdi-flag</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{
                      "Số lượng tham gia: " + options.totalItems
                    }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{
                        biddingDocument.isMultipleAward == true
                          ? "Nhiều thầu thắng"
                          : "Một thầu thắng"
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider class="mx-1"></v-divider>

        <v-card-title>Danh sách HSDT</v-card-title>

        <!-- TODO: table bids -->
        <v-data-table
          :headers="bidHeaders"
          :items="bids"
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          show-expand
          @click:row="clicked"
          item-key="id"
          :loading="loading"
          :options.sync="options"
          :server-items-length="options.totalItems"
          :footer-props="{
            'items-per-page-options': options.itemsPerPageItems
          }"
          :actions-append="options.page"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn
              class="ma-1"
              x-small
              tile
              outlined
              color="success"
              @click.stop="openAcceptBid(item)"
              v-if="item.status == 'PENDING'"
            >
              <v-icon left>library_add_check </v-icon>Đồng ý
            </v-btn>
            <v-btn
              class="ma-1"
              x-small
              tile
              outlined
              color="error"
              @click.stop="openRejectBid(item)"
              v-if="item.status == 'PENDING'"
            >
              <v-icon left>remove_circle</v-icon>Từ chối
            </v-btn>
            <span style="color: red;" v-if="item.status == 'REJECTED'">{{
              item.status
            }}</span>
            <span style="color: green;" v-if="item.status == 'ACCEPTED'">{{
              item.status
            }}</span>
          </template>

          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length" class="px-0">
              <v-data-table
                :headers="containerHeaders"
                :items="item.containers"
                :hide-default-footer="true"
                dark
                dense
              >
              </v-data-table>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import FormValidate from "@/mixin/form-validate";
import Utils from "@/mixin/utils";
import { IBiddingDocument } from "@/entity/bidding-document";
import { IBid } from "@/entity/bid";
import { getBiddingDocument } from "@/api/bidding-document";
import { getBidsByBiddingDocument } from "@/api/bid";
import { PaginationResponse } from "@/api/payload";
import ConfirmBid from "./ConfirmBid.vue";
import Snackbar from "@/components/Snackbar.vue";

@Component({
  mixins: [FormValidate, Utils],
  components: {
    ConfirmBid,
    Snackbar
  }
})
export default class DetailBiddingDocument extends Vue {
  biddingDocument = {
    id: 0,
    offeree: "",
    outbound: {
      id: 0,
      shippingLine: "",
      containerType: "",
      status: "",
      goodsDescription: "",
      packingTime: "",
      packingStation: "",
      payload: 0,
      unitOfMeasurement: "",
      booking: {
        bookingNumber: "",
        unit: 0,
        cutOffTime: "",
        isFcl: true,
        portOfLoading: ""
      }
    },
    bids: [] as Array<IBid>,
    bidDiscountCode: "",
    isMultipleAward: true,
    bidOpening: "",
    bidClosing: "",
    dateOfDecision: "",
    currencyOfPayment: "",
    bidPackagePrice: 0,
    bidFloorPrice: 0,
    priceLeadership: 0
  } as IBiddingDocument;
  loading = false;
  selection = 1;
  status = false;
  dialogConfirm = false;
  bid = {} as IBid;
  expanded: Array<IBid> = [];
  singleExpand = true;
  message = "";
  snackbar = false;
  options = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
    totalItems: 10,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  bids = [] as Array<IBid>;
  bidHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    { text: "Cont qty", value: "containers.length" },
    { text: "Giá thầu", value: "bidPrice" },
    { text: "Ngày thầu", value: "bidDate" },
    { text: "Hiệu lực", value: "bidValidityPeriod" },
    { text: "", value: "actions", sortable: false }
  ];

  containerHeaders = [
    {
      text: "Container No.",
      align: "start",
      sortable: false,
      value: "containerNumber"
    },
    { text: "Biển kiểm sát", value: "licensePlate" },
    { text: "Tài xế", value: "driver" },
    { text: "Rơ mọt", value: "trailer" },
    { text: "Đầu kéo", value: "tractor" }
  ];

  openAcceptBid(item: IBid) {
    this.bid = item;
    console.log(this.biddingDocument);
    this.status = true;
    this.dialogConfirm = true;
  }
  openRejectBid(item: IBid) {
    this.bid = item;
    this.status = false;
    this.dialogConfirm = true;
  }
  clicked(value: IBid) {
    console.log(value);
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded.splice(0, this.expanded.length);
      } else {
        this.expanded.splice(0, this.expanded.length);
        this.expanded.push(value);
      }
    } else {
      const index = this.expanded.findIndex(x => x.id === value.id);
      if (index === -1) {
        this.expanded.push(value);
      } else {
        this.expanded.splice(index, 1);
      }
    }
  }
  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    const biddingDocumentId = parseInt(this.$route.params.id);
    if (val !== oldVal) {
      getBidsByBiddingDocument(biddingDocumentId, {
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IBid> = res.data;
          console.log("watch", this.options);
          this.bids = response.data;
          this.options.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
  created() {
    // TODO: API get Bidding Document
    console.log(this.$route.params.id);
    const biddingDocumentId = parseInt(this.$route.params.id);
    getBiddingDocument(biddingDocumentId)
      .then(res => {
        const response = res.data;
        this.biddingDocument = response;
      })
      .catch(err => {
        console.log(err);
      })
      .finally();
  }
  check() {
    console.log(
      new Date().getTime() - new Date(this.biddingDocument.bidClosing).getTime()
    );
  }
}
</script>
