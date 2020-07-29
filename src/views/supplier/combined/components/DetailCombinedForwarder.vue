<template>
  <v-content>
    <CreateEvidence
      v-if="dialogAdd"
      :dialogAdd.sync="dialogAdd"
      :evidences.sync="evidences"
      :checkValid.sync="checkValid"
      :totalItems.sync="evidenceServerSideOptions.totalItems"
      :contract="combined.contract"
    />
    <DetailEvidence
      v-if="dialogDetail"
      :dialogDetail.sync="dialogDetail"
      :evidences.sync="evidences"
      :checkValid.sync="checkValid"
      :finalEvidence="finalEvidence"
      :evidence="evidence"
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
                <v-row justify="center"> </v-row>
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
                          "Bên chủ hàng: " + biddingDocument.merchant
                        }}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{ "Bên chủ xe: " + $auth.user().username }}
                        </v-list-item-subtitle>
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
                          v-if="!getValid"
                          v-bind="attrs"
                          v-on="on"
                          >report_problem</v-icon
                        >
                      </template>
                      <span>Chứng cứ của bạn gửi chưa được xác nhận.</span>
                    </v-tooltip>
                  </v-subheader>
                  <v-list-item-group color="primary">
                    <v-list-item v-if="evidences.length == 0">
                      <v-list-item-icon>
                        <v-icon>monetization_on</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>
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
                        </v-list-item-title>
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
                    disable-sort
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
                    <template v-slot:item.isValid="{ item }">
                      {{ item.isValid ? "Đã xác nhận" : "Chưa xác nhận" }}
                    </template>
                  </v-data-table>
                </v-list>
              </v-card>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-card>
      <!-- BIDDING -->
      <v-card class="order-1 flex-grow-1 mx-auto my-1" v-if="combined">
        <v-card-title>Thông tin Hồ sơ trúng thầu</v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
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
            <v-col cols="12" sm="6">
              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>date_range</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Ngày chốt thầu</v-list-item-title
                    ><v-list-item-subtitle>{{
                      formatDatetime(combined.bid.dateOfDecision)
                    }}</v-list-item-subtitle>
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
          :items="combined.bid.containers"
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
import { Component, Vue, Watch } from "vue-property-decorator";
import Utils from "@/mixin/utils";
import { IBiddingDocument } from "@/entity/bidding-document";
import { IBid } from "@/entity/bid";
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
import SupplierRating from "../../bidding-document/components/SupplierRating.vue";

@Component({
  mixins: [Utils],
  components: {
    CreateEvidence,
    DetailEvidence,
    SupplierRating
  }
})
export default class DetailCombinedForwarder extends Vue {
  biddingDocument = null as IBiddingDocument | null;
  evidence = null as IEvidence | null;
  evidences: Array<IEvidence> = [];
  inbound = null as IInbound | null;
  update = false;
  dialogAdd = false;
  containers: Array<IContainer> = [];
  dialogDetail = false;
  checkValid = false;
  finalEvidence = false;
  combined = null as ICombined | null;
  combineds: Array<ICombined> = [];
  selectedContainer = null as IContainer | null;
  loading = false;
  stepper = 1;
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
    this.onEvidenceOptionsChange(this.evidenceOptions);
  }

  @Watch("options")
  onOptionsChange(val: DataOptions) {
    if (typeof val !== "undefined") {
      if (this.combined) {
        this.loading = true;
        this.containers = [] as Array<IContainer>;
        const bid = this.combined.bid as IBid;
        const start = (val.page - 1) * val.itemsPerPage;
        let end = start + val.itemsPerPage - 1;
        if (end > bid.containers.length - 1) {
          end = bid.containers.length - 1;
        }
        for (let i = start; i <= end; i++) {
          this.containers.push(bid.containers[i] as IContainer);
        }

        this.loading = false;
      }
    }
  }

  get getValid() {
    return this.checkValid;
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
        const response: IBiddingDocument = res.data;
        console.log(response);
        return response;
      })
      .catch(err => {
        console.log(err);
        return null;
      });
    this.biddingDocument = _biddingDocument;
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
  openCreateEvidence() {
    this.dialogAdd = true;
  }
  openDetailEvidence(item: IEvidence) {
    this.finalEvidence = false;
    this.evidence = item;
    const index = this.evidences.findIndex((x: IEvidence) => x.id == item.id);
    if (index == 0) {
      this.finalEvidence = true;
    }
    this.dialogDetail = true;
  }
  @Watch("evidenceOptions")
  async onEvidenceOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      if (
        this.combined &&
        this.combined.contract &&
        this.combined.contract.id
      ) {
        const _evidence = await getEvidencesByContract(
          this.combined.contract.id,
          {
            page: val.page - 1,
            limit: val.itemsPerPage
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
