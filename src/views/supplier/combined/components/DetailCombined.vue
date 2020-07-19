<template>
  <v-content>
    <Snackbar :text="message" :snackbar.sync="snackbar" />
    <DetailEvidence
      v-if="dialogDetail"
      :dialogDetail.sync="dialogDetail"
      :evidence="evidence"
      :evidences.sync="evidences"
      :message.sync="message"
      :snackbar.sync="snackbar"
    />
    <v-container class="mx-auto mt-5">
      <v-card v-if="combined">
        <v-card-title>
          Thông tin Hồ sơ trúng thầu: {{ "#" + combined.bid.id }}
        </v-card-title>
        <v-card-text>
          <v-stepper :value="stepper" alt-labels class="elevation-0">
            <v-stepper-header>
              <v-stepper-step step="1">Nhận thông tin</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="2">Đang vận chuyển</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="3">Đã giao hàng</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="4">Thanh toán</v-stepper-step>
            </v-stepper-header>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container
      class="d-flex justify-space-around align-start"
      v-if="biddingDocument"
    >
      <!-- OUTOUNBD -->
      <v-card class="order-0 flex-grow-0 mx-auto mr-5 my-1" max-width="500">
        <v-tabs
          background-color="white"
          color="deep-purple accent-4"
          left
          fixed-tabs
        >
          <v-tab>Lịch trình</v-tab>
          <v-tab>HSMT</v-tab>
          <v-tab>Hợp đồng</v-tab>

          <v-tab-item>
            <v-container fluid>
              <v-card class="elevation-0" v-if="combined && inbound">
                <v-row justify="center"> </v-row>
                <v-img
                  height="250"
                  src="@/assets/images/google-maps-directions.jpg"
                ></v-img>

                <v-card-title
                  >Lịch trình container
                  {{ selectedContainer.containerNumber }}:</v-card-title
                >
                <v-card-text>
                  <SupplierRating :supplier="combined.bid.bidder" />

                  <v-stepper value="2" vertical class="elevation-0 pb-0">
                    <v-stepper-step step="1" complete
                      >Cảng lấy cont: {{ inbound.billOfLading.portOfDelivery }}
                      <small class="mt-1"
                        >Thời gian lấy:
                        {{ formatDatetime(inbound.pickupTime) }}</small
                      >
                    </v-stepper-step>
                    <v-stepper-content step="1"></v-stepper-content>
                    <v-stepper-step step="2"
                      >Nơi trả hàng: {{ inbound.returnStation }}
                      <small class="mt-1"
                        >Thời gian trả:
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
                        >Thời gian đóng:
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
                <v-img
                  height="100"
                  src="@/assets/images/biddingdocument.jpg"
                ></v-img>

                <v-card-title>Hồ sơ Mời thầu</v-card-title>

                <v-card-text>
                  <SupplierRating :supplier="biddingDocument.merchant" />

                  <v-list dense>
                    <v-subheader>Thông tin HSMT</v-subheader>
                    <v-list-item-group color="primary">
                      <v-list-item
                        :to="gotoDetailBiddingDocument(biddingDocument)"
                      >
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
                      <v-list-item>
                        <v-list-item-icon>
                          <v-icon>date_range</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>{{
                            "Mở thầu: " +
                              formatDatetime(biddingDocument.bidOpening)
                          }}</v-list-item-title>
                          <v-list-item-subtitle>
                            {{
                              "Đóng thầu: " +
                                formatDatetime(biddingDocument.bidClosing)
                            }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>

                  <v-list dense>
                    <v-subheader>Thông tin Hàng Xuất</v-subheader>
                    <v-list-item-group color="primary">
                      <v-list-item>
                        <v-list-item-icon>
                          <v-icon>child_friendly</v-icon>
                        </v-list-item-icon>
                        <v-list-item-content>
                          <v-list-item-title>{{
                            "Mã Booking: " +
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
              </v-card>
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container fluid>
              <v-card class="elevation-0" v-if="combined">
                <v-img
                  height="100"
                  src="@/assets/images/biddingdocument.jpg"
                ></v-img>

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
                          "Bên chủ hàng: " + $auth.user().username
                        }}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ "Bên chủ xe: " + combined.bid.bidder }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>monetization_on</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title
                          >Yêu cầu hợp đồng :
                          {{
                            combined.contract.required ? "Có" : "Không"
                          }}</v-list-item-title
                        >
                        <v-list-item-subtitle v-if="combined.contract.required">
                          {{
                            "Tiền phạt: " +
                              combined.contract.finesAgainstContractViolation +
                              "%"
                          }}
                        </v-list-item-subtitle>
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
                      <span>Chứng cứ chưa được xác nhận.</span>
                    </v-tooltip>
                  </v-subheader>
                  <v-card-title>Danh sách Chứng cứ</v-card-title>
                  <v-data-table
                    :headers="evidenceHeaders"
                    :items="evidences"
                    item-key="id"
                    :loading="loading"
                    :options.sync="evidenceOptions"
                    :server-items-length="evidenceServerSideOptions.totalItems"
                    :footer-props="{
                      'items-per-page-options':
                        evidenceServerSideOptions.itemsPerPageItems
                    }"
                    :actions-append="evidenceOptions.page"
                    class="elevation-0"
                  >
                    <template v-slot:item.actions="{ item }">
                      <v-btn
                        class="ma-1"
                        x-small
                        tile
                        outlined
                        color="success"
                        @click.stop="openDetailEvidence(item)"
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
        <v-card-title>Hồ sơ trúng thầu</v-card-title>
        <v-data-table
          :headers="bidHeaders"
          :items="combineds"
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          show-expand
          @click:row="clicked"
          item-key="id"
          :loading="loading"
          :options.sync="options"
          :server-items-length="serverSideOptions.totalItems"
          :footer-props="{
            'items-per-page-options': serverSideOptions.itemsPerPageItems
          }"
          :actions-append="options.page"
          disable-sort
          class="elevation-0"
        >
          <template v-slot:item.dateOfDecision="{ item }">
            {{ formatDatetime(item.bid.dateOfDecision) }}
          </template>
          <template v-slot:item.bidPrice="{ item }">
            {{ currencyFormatter(item.bid.bidPrice) }}
          </template>

          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length" class="px-0">
              <v-data-table
                :headers="containerHeaders"
                :items="item.bid.containers"
                :hide-default-footer="true"
                disable-sort
                dark
                dense
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
import Snackbar from "@/components/Snackbar.vue";
import { ICombined } from "@/entity/combined";
import { getCombinedsByBiddingDocument } from "@/api/combined";
import { IEvidence } from "@/entity/evidence";
import { getBiddingDocument } from "@/api/bidding-document";
import { getEvidencesByContract } from "@/api/evidence";
import { PaginationResponse } from "@/api/payload";
import DetailEvidence from "./DetailEvidence.vue";
import { IContainer } from "@/entity/container";
import { IInbound } from "@/entity/inbound";
import { getInboundsByContainer } from "@/api/inbound";
import { DataOptions } from "vuetify";
import SupplierRating from "../../bidding-document/components/SupplierRating.vue";

@Component({
  mixins: [FormValidate, Utils],
  components: {
    Snackbar,
    DetailEvidence,
    SupplierRating
  }
})
export default class DetailCombined extends Vue {
  biddingDocument = null as IBiddingDocument | null;
  combined = null as ICombined | null;
  combineds: Array<ICombined> = [];
  evidence = null as IEvidence | null;
  evidences: Array<IEvidence> = [];
  inbound = null as IInbound | null;
  selectedContainer = null as IContainer | null;
  loading = false;
  stepper = 1;
  message = "";
  snackbar = false;
  dialogDetail = false;
  checkValid = false;
  expanded: Array<ICombined> = [];
  singleExpand = true;
  options = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  // Evidence
  evidenceOptions = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  evidenceServerSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  bidHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "bid.id"
    },
    { text: "Đối tác", value: "bid.bidder" },
    { text: "Cont qty", value: "bid.containers.length" },
    { text: "Giá thầu", value: "bidPrice" },
    { text: "Ngày trúng thầu", value: "dateOfDecision" }
  ];

  containerHeaders = [
    {
      text: "Container No.",
      align: "start",
      sortable: false,
      value: "containerNumber",
      class: "elevation-1 primary"
    },
    { text: "Tài xế", value: "driver", class: "elevation-1 primary" },
    {
      text: "Rơ mọt",
      value: "trailer.licensePlate",
      class: "elevation-1 primary"
    },
    {
      text: "Đầu kéo",
      value: "tractor.licensePlate",
      class: "elevation-1 primary"
    },
    {
      text: "Actions",
      value: "actions",
      sortable: false,
      class: "elevation-1 primary"
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

  gotoDetailBiddingDocument(biddingDocument: IBiddingDocument) {
    return "/bidding-document/" + biddingDocument.id;
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

  clicked(value: ICombined) {
    this.viewDetailCombined(value);
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

  async viewDetailCombined(item: ICombined) {
    switch (item.status) {
      case "INFO_RECEIVED":
        this.stepper = 1;
        break;
      case "SHIPPING":
        this.stepper = 2;
        break;
      case "DELIVERED":
        this.stepper = 3;
        break;
      case "PAID":
        this.stepper = 4;
        break;
    }
    this.combined = item;
    this.viewDetailEvidence(this.combined);
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val !== "undefined") {
      this.loading = true;
      const _combineds = await getCombinedsByBiddingDocument(
        parseInt(this.getRouterId),
        {
          page: this.options.page - 1,
          limit: this.options.itemsPerPage
        }
      )
        .then(res => {
          const response: PaginationResponse<ICombined> = res.data;
          console.log("watch", response);
          return response;
        })
        .catch(err => {
          console.log(err);
          return null;
        });
      this.loading = false;
      if (_combineds) {
        this.combineds = _combineds.data;
        this.serverSideOptions.totalItems = _combineds.totalElements;
        if (this.combineds.length > 0) {
          this.combined = this.combineds[0];
          const _bid = this.combined.bid as IBid;
          this.viewDetailCombined(this.combined);
          if (_bid.containers.length > 0) {
            this.viewDetailContainer(_bid.containers[0] as IContainer);
          }
        }
      }
    }
  }
  get getRouterId() {
    return this.$route.params.id;
  }

  async created() {
    // TODO: Fake data
    const _biddingDocument = await getBiddingDocument(
      parseInt(this.getRouterId)
    )
      .then(res => {
        const response = res.data;
        return response;
      })
      .catch(err => {
        console.log(err);
        return null;
      });
    this.biddingDocument = _biddingDocument;
  }
  openDetailEvidence(item: IEvidence) {
    this.evidence = item;
    this.dialogDetail = true;
  }

  async viewDetailEvidence(item: ICombined) {
    if (item && item.contract) {
      const _evidence = await getEvidencesByContract(
        item.contract.id as number,
        {
          page: this.evidenceOptions.page - 1,
          limit: this.evidenceOptions.itemsPerPage
        }
      )
        .then(res => {
          const response: PaginationResponse<IEvidence> = res.data;
          return response;
        })
        .catch(err => {
          console.log(err);
          return null;
        });
      if (_evidence) {
        this.evidences = _evidence.data;
        this.evidenceServerSideOptions.totalItems = _evidence.totalElements;
        if (this.evidences.length > 0 && this.evidences[0].isValid == true) {
          this.checkValid = true;
        }
      }
    }
  }
  async viewDetailContainer(item: IContainer) {
    const _inbound = await getInboundsByContainer(item.id as number)
      .then(res => {
        const response: IInbound = res.data;
        return response;
      })
      .catch(err => {
        console.log(err);
        return null;
      });
    this.selectedContainer = item;
    this.inbound = _inbound;
  }
}
</script>
