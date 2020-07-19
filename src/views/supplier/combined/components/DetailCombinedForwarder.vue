<template>
  <v-content>
    <v-container class="mx-auto mt-5">
      <v-card>
        <v-card-title>
          Thông tin Hồ sơ trúng thầu: #1
        </v-card-title>
        <v-card-text>
          <v-stepper :value="calcStepper" alt-labels class="elevation-0">
            <v-stepper-header>
              <v-stepper-step step="1">Nhận thông tin</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="2">Đi lấy hàng</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="3">Đang vận chuyển</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="4">Đã giao hàng</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="5">Thanh toán</v-stepper-step>
            </v-stepper-header>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container class="d-flex justify-space-around align-start">
      <!-- OUTOUNBD -->
      <v-card class="order-0 flex-grow-0 mx-auto mr-5 my-1" max-width="500">
        <v-tabs background-color="white" color="deep-purple accent-4" left>
          <v-tab>Lịch trình</v-tab>
          <v-tab>Hàng xuất và HSMT</v-tab>
          <v-tab>Hợp đồng</v-tab>

          <v-tab-item>
            <v-container fluid>
              <v-card class="elevation-0">
                <v-row justify="center"> </v-row>
                <v-img
                  height="250"
                  src="@/assets/images/google-maps-directions.jpg"
                ></v-img>

                <v-card-title>Chi tiết lịch trình container:</v-card-title>

                <v-card-text>
                  <v-row align="center" class="mx-0">
                    <div class="grey--text mr-4">
                      {{ combineds[0] ? combineds[0].bid.bidder : "" }}
                    </div>
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

                  <v-stepper value="2" vertical class="elevation-0 pb-0">
                    <v-stepper-step step="1" complete
                      >Cảng lấy cont: {{ inbound.billOfLading.portOfDelivery }}
                      <small class="mt-1"
                        >Thời gian:
                        {{ formatDatetime(inbound.pickupTime) }}</small
                      >
                    </v-stepper-step>
                    <v-stepper-content step="1"></v-stepper-content>
                    <v-stepper-step step="2"
                      >Nơi trả hàng: {{ inbound.returnStation }}
                      <small class="mt-1"
                        >Thời gian:
                        {{
                          formatDatetime(inbound.billOfLading.freeTime)
                        }}</small
                      ></v-stepper-step
                    >
                    <v-stepper-content step="2"></v-stepper-content>
                    <v-stepper-step step="3"
                      >Nơi đóng hàng:
                      {{ biddingDocument.outbound.packingStation }}
                      <small class="mt-1"
                        >Thời gian:
                        {{
                          formatDatetime(biddingDocument.outbound.packingTime)
                        }}</small
                      ></v-stepper-step
                    >
                    <v-stepper-content step="3"></v-stepper-content>
                    <v-stepper-step step="4"
                      >Cảng bốc hàng:
                      {{ biddingDocument.outbound.booking.portOfLoading }}
                      <small class="mt-1"
                        >Thời gian Cut-off:
                        {{
                          formatDatetime(
                            biddingDocument.outbound.booking.cutOffTime
                          )
                        }}</small
                      ></v-stepper-step
                    >
                  </v-stepper>
                </v-card-text>
              </v-card>
            </v-container>
          </v-tab-item>

          <v-tab-item>
            <v-container fluid>
              <v-card class="elevation-0">
                <v-row justify="center"> </v-row>
                <v-img
                  height="150"
                  src="@/assets/images/biddingdocument.jpg"
                ></v-img>

                <v-card-title>Hồ sơ Mời thầu</v-card-title>

                <v-card-text>
                  <v-row align="center" class="mx-0">
                    <div class="grey--text mr-4">
                      {{ biddingDocument.merchant }}
                    </div>
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
                    <v-subheader>Thông tin HSMT</v-subheader>
                    <v-list-item-group color="primary">
                      <v-list-item :to="gotoDetailBiddingDocument">
                        <v-list-item-icon>
                          <v-icon>monetization_on</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>{{
                            "Tổng thầu: " +
                              totalBidMoney +
                              biddingDocument.currencyOfPayment
                          }}</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ "Tham gia: " + serverSideOptions.totalItems }}
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
                          <v-icon>child_friendly</v-icon>
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
                          <v-icon>directions_boat</v-icon>
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
                          <v-icon>location_on</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>{{
                            "Đóng tại: " +
                              biddingDocument.outbound.packingStation
                          }}</v-list-item-title>
                          <v-list-item-subtitle>
                            {{
                              "Thời gian: " +
                                formatDatetime(
                                  biddingDocument.outbound.packingTime
                                )
                            }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>

                      <v-list-item>
                        <v-list-item-icon>
                          <v-icon>description</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>{{
                            "Mô tả: " +
                              biddingDocument.outbound.goodsDescription
                          }}</v-list-item-title>
                          <v-list-item-subtitle>
                            {{
                              "Khối lượng: " +
                                biddingDocument.outbound.grossWeight +
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
                      >Mở thầu:
                      {{ formatDatetime(biddingDocument.bidOpening) }}</v-chip
                    >

                    <v-chip
                      >Đóng thầu:
                      {{ formatDatetime(biddingDocument.bidClosing) }}</v-chip
                    >
                  </v-chip-group>
                </v-card-text>
              </v-card>
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container fluid>
              <v-card class="elevation-0">
                <CreateEvidence
                  v-if="dialogAdd"
                  :dialogAdd.sync="dialogAdd"
                  :evidences.sync="evidences"
                  :message.sync="message"
                  :snackbar.sync="snackbar"
                  :contract="combined.contract"
                />
                <DetailEvidence
                  v-if="dialogDetail"
                  :dialogDetail.sync="dialogDetail"
                  :evidence="evidence"
                  :evidences.sync="evidences"
                  :message.sync="message"
                  :snackbar.sync="snackbar"
                />
                <v-card-title>Hợp đồng</v-card-title>
                <v-list dense>
                  <v-subheader>Thông tin Hợp đồng</v-subheader>
                  <v-list-item-group color="primary">
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>monetization_on</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          "Bên chủ hàng: " + biddingDocument.merchant
                        }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>monetization_on</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          "Bên chủ xe: " + $auth.user().username
                        }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>monetization_on</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title
                          >Yêu cầu hợp đồng:
                          {{
                            combined.contract.required ? "Có" : "Không"
                          }}</v-list-item-title
                        >
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="combined.contract.required">
                      <v-list-item-icon>
                        <v-icon>monetization_on</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          "% Tiền phạt: " +
                            combined.contract.finesAgainstContractViolation
                        }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                </v-list>
                <v-list dense v-if="combined.contract.required">
                  <v-subheader
                    >Chứng cứ
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          style="color:gold;"
                          v-if="!checkValid"
                          v-bind="attrs"
                          v-on="on"
                          >report_problem</v-icon
                        >
                      </template>
                      <span>Chứng cứ của bạn gửi chưa được xác nhận.</span>
                    </v-tooltip>
                  </v-subheader>
                  <v-list-item-group color="primary">
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>monetization_on</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          "Chứng cứ " + evidence.evidence
                        }}</v-list-item-title>
                        <v-list-item-subtitle v-if="evidences.length == 0">
                          <v-list-item-content>
                            <v-list-item-title
                              ><v-icon style="color:gold;"
                                >report_problem</v-icon
                              >Bạn phải gửi chứng cứ cho hợp đồng này
                            </v-list-item-title>
                            <v-btn
                              color="primary"
                              small
                              @click="openCreateEvidence()"
                              >Gửi</v-btn
                            >
                          </v-list-item-content>
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list-item-group>
                  <v-card-title v-if="evidences.length > 0"
                    >Danh sách Chứng cứ<v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      dark
                      class="mb-2"
                      @click="openCreateEvidence()"
                      >Thêm mới</v-btn
                    ></v-card-title
                  >
                  <v-data-table
                    v-if="evidences.length > 0"
                    :headers="evidenceHeaders"
                    :items="evidences"
                    item-key="id"
                    :loading="loading"
                    :options.sync="options"
                    :server-items-length="serverSideOptions.totalItems"
                    :footer-props="{
                      'items-per-page-options':
                        serverSideOptions.itemsPerPageItems
                    }"
                    :actions-append="options.page"
                    class="elevation-0"
                  >
                    <template v-slot:item.actions="{ item }">
                      <v-btn
                        class="ma-1"
                        x-small
                        tile
                        outlined
                        color="success"
                        @click.stop="viewDetailEvidence(item)"
                      >
                        <v-icon left>library_add_check </v-icon>Chi tiết
                      </v-btn>
                    </template>
                  </v-data-table>
                </v-list>
              </v-card>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-card>
      <!-- BIDDING -->
      <v-card class="order-1 flex-grow-1 mx-auto my-1">
        <Snackbar :text="message" :snackbar.sync="snackbar" />
        <v-card-title>Thông tin Hồ sơ trúng thầu</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>attach_money</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Giá trúng thầu</v-list-item-title>
                    <v-list-item-subtitle>{{
                      currencyFormatter(
                        biddingDocument.priceLeadership,
                        biddingDocument.currencyOfPayment
                      )
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>date_range</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Ngày chốt thầu</v-list-item-title
                    ><v-list-item-subtitle>{{
                      formatDatetime(bid.dateOfDecision)
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>people</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Trạng thái</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ combined.status }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider class="mx-1"></v-divider>

        <v-card-title>Danh sách Container</v-card-title>

        <!-- TODO: table bids -->
        <v-data-table
          :headers="containerHeaders"
          :items="bid.containers"
          item-key="id"
          :loading="loading"
          :options.sync="options"
          :server-items-length="serverSideOptions.totalItems"
          :footer-props="{
            'items-per-page-options': serverSideOptions.itemsPerPageItems
          }"
          :actions-append="options.page"
          class="elevation-0"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn
              class="ma-1"
              x-small
              tile
              outlined
              color="success"
              @click.stop="viewDetailContainer(item)"
            >
              <v-icon left>library_add_check </v-icon>Lịch trình
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Utils from "@/mixin/utils";
import { IBiddingDocument } from "@/entity/bidding-document";
import { IBid } from "@/entity/bid";
import Snackbar from "@/components/Snackbar.vue";
import { ICombined } from "@/entity/combined";
import { getCombinedsByBiddingDocument } from "@/api/combined";
import { IContainer } from "@/entity/container";
import { IEvidence } from "@/entity/evidence";
import { getEvidencesByContract } from "@/api/evidence";
import { PaginationResponse } from "@/api/payload";
import { getBiddingDocument } from "@/api/bidding-document";
import CreateEvidence from "./CreateEvidence.vue";
import DetailEvidence from "./DetailEvidence.vue";
import { IInbound } from "@/entity/inbound";
import { getInboundsByContainer } from "@/api/inbound";
import { DataOptions } from "vuetify";

@Component({
  mixins: [Utils],
  components: {
    Snackbar,
    CreateEvidence,
    DetailEvidence
  }
})
export default class DetailCombinedForwarder extends Vue {
  biddingDocument = {
    offeree: "",
    outbound: {
      goodsDescription: "",
      packingTime: "",
      packingStation: "",
      deliveryTime: "",
      grossWeight: 0,
      unitOfMeasurement: "",
      booking: {
        bookingNumber: "",
        unit: 0,
        cutOffTime: "",
        isFcl: false,
        portOfLoading: ""
      }
    },
    bids: [] as Array<IBid>,
    discount: "",
    isMultipleAward: false,
    bidOpening: "",
    bidClosing: "",
    dateOfDecision: "",
    currencyOfPayment: "",
    bidPackagePrice: 0,
    bidFloorPrice: 0,
    priceLeadership: 0,
    status: "COMBINED"
  } as IBiddingDocument;
  bid = {
    bidder: "",
    containers: [] as Array<IContainer>,
    bidPrice: 0,
    bidDate: "",
    bidValidityPeriod: "",
    dateOfDecision: "",
    status: ""
  } as IBid;
  evidence = {
    sender: this.$auth.user().username,
    evidence: "",
    isValid: false
  } as IEvidence;
  evidences: Array<IEvidence> = [];
  inbound = {
    pickupTime: "",
    emptyTime: "",
    billOfLading: {
      billOfLadingNumber: "",
      unit: 0,
      containers: [] as Array<IContainer>,
      portOfDelivery: "",
      freeTime: ""
    },
    returnStation: ""
  } as IInbound;
  update = false;
  dialogAdd = false;
  bids: Array<IBid> = [];
  containers: Array<IContainer> = [];
  dialogDetail = false;
  checkValid = false;
  combined = {
    bid: this.bid,
    status: "INFO_RECEIVED",
    contract: {
      finesAgainstContractViolation: 0,
      required: true
    }
  } as ICombined;
  combineds: Array<ICombined> = [];
  loading = false;
  selection = 0;
  message = "";
  snackbar = false;
  stepper = 1;
  options = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  containerHeaders = [
    {
      text: "Container No.",
      align: "start",
      sortable: false,
      value: "containerNumber"
    },
    { text: "Tài xế", value: "driver" },
    { text: "Rơ mọt", value: "trailer.licensePlate" },
    { text: "Đầu kéo", value: "tractor.licensePlate" },
    {
      text: "Actions",
      value: "actions",
      sortable: false
    }
  ];
  evidenceHeaders = [
    {
      text: "Evidence No.",
      align: "start",
      sortable: false,
      value: "id"
    },
    { text: "Người gửi", value: "sender" },
    { text: "Hợp lệ", value: "isValid" },
    {
      text: "Actions",
      value: "actions",
      sortable: false
    }
  ];

  get gotoDetailBiddingDocument() {
    return "/bidding-document/" + this.biddingDocument.id;
  }

  get totalBidMoney(): number {
    let total = 0;
    const bids: Array<IBid> = [];
    this.combineds.forEach((combined: ICombined) => {
      bids.push(combined.bid as IBid);
    });
    bids.forEach((bid: IBid) => {
      total += bid.bidPrice as number;
    });
    return total;
  }

  get calcStepper() {
    this.stepper = 1;
    switch (this.combined.status) {
      case "INFO_RECEIVED":
        this.stepper = 1;
        break;
      case "ON_THE_ROAD":
        this.stepper = 2;
        break;
      case "SHIPPING":
        this.stepper = 3;
        break;
      case "DELIVERED":
        this.stepper = 4;
        break;
      case "PAID":
        this.stepper = 5;
        break;
    }
    return this.stepper;
  }

  created() {
    // TODO: Fake data
    const biddingDocumentId = parseInt(this.$route.params.id);
    getBiddingDocument(biddingDocumentId)
      .then(res => {
        const response = res.data;
        this.biddingDocument = response;
        console.log(this.biddingDocument);
        this.serverSideOptions.totalItems = 10;
      })
      .catch(err => {
        console.log(err);
      })
      .finally();
    getCombinedsByBiddingDocument(biddingDocumentId, {
      page: 0,
      limit: 100
    })
      .then(res => {
        console.log(res);
        const response: PaginationResponse<ICombined> = res.data;
        console.log(response.data);
        this.combineds = response.data;
        if (this.combineds.length > 0) {
          this.bid = this.combineds[0].bid as IBid;
          this.combined = this.combineds[0];
          if (this.combined.contract && this.combined.contract.id) {
            getEvidencesByContract(this.combined.contract.id, {
              page: 0,
              limit: 100
            })
              .then(res => {
                const response: PaginationResponse<IEvidence> = res.data;
                this.evidences = response.data;
                if (this.evidences.length > 0) {
                  if (this.evidences[0].isValid == true) {
                    this.checkValid = true;
                  }
                }
              })
              .catch(err => {
                console.log(err);
              })
              .finally();
          }
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally();
  }
  openCreateEvidence() {
    this.update = false;
    this.dialogAdd = true;
  }
  viewDetailEvidence(item: IEvidence) {
    this.evidence = item;
    this.dialogDetail = true;
  }
  viewDetailContainer(item: IContainer) {
    if (item.id) {
      getInboundsByContainer(item.id)
        .then(res => {
          const response = res.data;
          this.inbound = response;
        })
        .catch(err => {
          console.log(err);
        })
        .finally();
    }
  }
}
</script>
