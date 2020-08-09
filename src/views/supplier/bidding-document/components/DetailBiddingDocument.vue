<template>
  <v-content>
    <v-row justify="center">
      <CreateReport
        v-if="dialogReport"
        :dialogAdd.sync="dialogReport"
        :biddingDocument.sync="biddingDocument"
      />
    </v-row>
    <CreateCombined
      v-if="bid"
      :dialogAdd.sync="dialogAddCombined"
      :numberWinner.sync="numberWinner"
      :isMultipleAward="biddingDocument.isMultipleAward"
      :bid="bid"
    />
    <CreateBid
      v-if="dialogBid"
      :biddingDocument.sync="biddingDocument"
      :dialogAdd.sync="dialogBid"
      :bids.sync="bids"
      :totalItems.sync="serverSideOptions.totalItems"
    />
    <v-container
      class="d-flex justify-space-around align-start"
      v-if="biddingDocument"
    >
      <!-- OUTOUNBD -->
      <v-card class="order-0 flex-grow-0 mx-auto mr-5 my-5" max-width="330">
        <v-img height="100" src="@/assets/images/biddingdocument.jpg"></v-img>
        <v-card-title>Hồ sơ Mời thầu</v-card-title>
        <v-card-text>
          <SupplierRating :supplier="biddingDocument.merchant" />

          <v-list dense>
            <v-subheader>Thong tin HSMT</v-subheader>
            <v-list-item-group color="primary">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>monetization_on</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{
                    "Giá gói thầu: " +
                      currencyFormatter(
                        biddingDocument.bidPackagePrice,
                        biddingDocument.currencyOfPayment
                      )
                  }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{
                      "Giá sàn: " +
                        currencyFormatter(
                          biddingDocument.bidFloorPrice,
                          biddingDocument.currencyOfPayment
                        )
                    }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>date_range</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{
                    "Mở thầu: " + formatDatetime(biddingDocument.bidOpening)
                  }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{
                      "Đóng thầu: " + formatDatetime(biddingDocument.bidClosing)
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
                  <v-icon>child_friendly</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{
                    "Mã Booking: " + biddingDocument.outbound.booking.number
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
                  <v-icon>description</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{
                    "Mô tả: " + biddingDocument.outbound.goodsDescription
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
      <!-- BIDDING -->
      <v-card class="order-1 flex-grow-1 mx-auto my-5">
        <v-card-title
          >Thông tin đấu thầu
          <v-spacer></v-spacer>
          <v-tooltip
            left
            v-if="
              $auth.user().roles && $auth.user().roles[0] == 'ROLE_FORWARDER'
            "
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="openReportDialog()" icon v-bind="attrs" v-on="on">
                <v-icon large color="red">report</v-icon>
              </v-btn>
            </template>
            <span>Báo cáo HSMT</span>
          </v-tooltip>
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="4">
              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>attach_money</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{
                      "Giá dẫn đầu: " +
                        currencyFormatter(
                          biddingDocument.priceLeadership,
                          biddingDocument.currencyOfPayment
                        )
                    }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{
                        "Giá sàn: " +
                          currencyFormatter(
                            biddingDocument.bidFloorPrice,
                            biddingDocument.currencyOfPayment
                          )
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" sm="6" md="4">
              <v-list dense>
                <v-list-item v-if="biddingDocument.status == 'BIDDING'">
                  <v-list-item-icon>
                    <v-icon>date_range</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Đóng thầu</v-list-item-title>
                    <v-list-item-title>{{
                      formatDatetime(biddingDocument.bidClosing)
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
                <v-list-item v-if="biddingDocument.status == 'CANCELED'">
                  <v-list-item-icon>
                    <v-icon>mood_bad</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title style="color:red;"
                      >Thầu đã hủy</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="biddingDocument.status == 'COMBINED'">
                  <v-list-item-icon>
                    <v-icon>mood</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title style="color:green;"
                      >Thầu thành công</v-list-item-title
                    >
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="4"
              v-if="$auth.user().roles[0] == 'ROLE_MERCHANT'"
            >
              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>people</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{
                      "Số lượng tham gia: " + serverSideOptions.totalItems
                    }}</v-list-item-title>
                    <v-list-item-subtitle>
                      Số thầu thắng:
                      {{
                        numberWinner +
                          "/" +
                          biddingDocument.outbound.booking.unit
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              md="4"
              v-if="$auth.user().roles[0] == 'ROLE_FORWARDER'"
            >
              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>people</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>{{
                      biddingDocument.isMultipleAward
                        ? "Nhiều thầu thắng"
                        : "Một thầu thắng"
                    }}</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
          </v-row>
        </v-card-text>

        <v-divider class="mx-1"></v-divider>

        <v-card-title
          >Danh sách HSDT<v-spacer></v-spacer>
          <v-btn
            color="primary"
            dark
            class="mb-2"
            @click="openCreateBidDialog()"
            v-if="
              $auth.user().roles[0] == 'ROLE_FORWARDER' && this.bids.length == 0
            "
          >
            Thêm mới
          </v-btn></v-card-title
        >

        <!-- TODO: table bids -->
        <v-data-table
          :headers="bidHeaders"
          :items="bids"
          :single-expand="singleExpand"
          :expanded.sync="expanded"
          :show-expand="biddingDocument.isMultipleAward ? true : false"
          @click:row="clicked"
          item-key="id"
          :loading="loading"
          :options.sync="options"
          :server-items-length="serverSideOptions.totalItems"
          :footer-props="{
            'items-per-page-options': serverSideOptions.itemsPerPageItems
          }"
          :actions-append="options.page"
          no-data-text="Danh sách Hồ sơ dự thầu rỗng."
          disable-sort
          class="elevation-0"
        >
          <template v-slot:item.bidDate="{ item }">
            {{ formatDatetime(item.bidDate) }}
          </template>
          <template v-slot:item.bidPrice="{ item }">
            {{ currencyFormatter(item.bidPrice) }}
          </template>
          <template v-slot:item.bidValidityPeriod="{ item }">
            {{ formatDatetime(item.bidValidityPeriod) }}
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn
              class="ma-1"
              x-small
              tile
              outlined
              color="success"
              @click.stop="openConfirmBid(item, true)"
              v-if="
                item.status == 'PENDING' &&
                  $auth.user().roles &&
                  $auth.user().roles[0] == 'ROLE_MERCHANT'
              "
            >
              <v-icon left>library_add_check </v-icon>Đồng ý
            </v-btn>
            <v-btn
              class="ma-1"
              x-small
              tile
              outlined
              color="error"
              @click.stop="openConfirmBid(item, false)"
              v-if="
                item.status == 'PENDING' &&
                  $auth.user().roles &&
                  $auth.user().roles[0] == 'ROLE_MERCHANT'
              "
            >
              <v-icon left>remove_circle</v-icon>Từ chối
            </v-btn>
            <span style="color: red;" v-if="item.status == 'REJECTED'">{{
              item.status
            }}</span>
            <span style="color: green;" v-if="item.status == 'ACCEPTED'">{{
              item.status
            }}</span>
            <span
              style="color: yellowgreen;"
              v-if="
                item.status == 'PENDING' &&
                  $auth.user().roles[0] == 'ROLE_FORWARDER'
              "
              >{{ item.status }}</span
            >
          </template>

          <template
            v-slot:expanded-item="{ headers }"
            v-if="biddingDocument.isMultipleAward"
          >
            <td :colspan="headers.length" class="px-0">
              <v-data-table
                v-if="bid"
                :headers="containerHeaders"
                :items="bid.containers"
                :loading="loading"
                :options.sync="containerOptions"
                :server-items-length="containerServerSideOptions.totalItems"
                :footer-props="{
                  'items-per-page-options':
                    containerServerSideOptions.itemsPerPageItems
                }"
                :actions-append="containerOptions.page"
                v-model="containerSelected"
                show-select
                disable-sort
                dark
                dense
              >
              </v-data-table>
              <v-data-table
                v-if="bid && !biddingDocument.isMultipleAward"
                :headers="containerHeaders"
                :items="bid.containers"
                :loading="loading"
                :options.sync="containerOptions"
                :server-items-length="containerServerSideOptions.totalItems"
                :footer-props="{
                  'items-per-page-options':
                    containerServerSideOptions.itemsPerPageItems
                }"
                :actions-append="containerOptions.page"
                disable-sort
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
import CreateReport from "../../report/components/CreateReport.vue";
import CreateBid from "../../bid/components/CreateBid.vue";
import { DataOptions } from "vuetify";
import { IContainer } from "@/entity/container";
import SupplierRating from "./SupplierRating.vue";
import { getContainersByBid } from "@/api/container";
import CreateCombined from "../../combined/components/CreateCombined.vue";
import {
  getBidsByBiddingDocument,
  getBidByBiddingDocumentAndForwarder
} from "@/api/bid";

@Component({
  mixins: [FormValidate, Utils],
  components: {
    CreateCombined,
    CreateBid,
    CreateReport,
    SupplierRating
  }
})
export default class DetailBiddingDocument extends Vue {
  biddingDocument = null as IBiddingDocument | null;
  loading = false;
  containerSelected = [] as Array<IContainer>;
  isAccept = false;
  dialogAddCombined = false;
  dialogReport = false;
  dialogBid = false;
  bid = null as IBid | null;
  expanded: Array<IBid> = [];
  singleExpand = true;
  numberWinner = 0;
  options = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  containerOptions = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  containerServerSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  bids: Array<IBid> = [];
  bidHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    { text: "Đối tác", value: "bidder" },
    { text: "Cont qty", value: "containers.length" },
    { text: "Giá thầu", value: "bidPrice" },
    { text: "Ngày thầu", value: "bidDate" },
    { text: "Hành động", value: "actions", sortable: false }
  ];

  containerHeaders = [
    {
      text: "Container No.",
      align: "start",
      sortable: false,
      value: "containerNumber",
      class: "primary"
    },
    { text: "Tài xế", value: "driver", class: "primary" },
    {
      text: "Rơ moóc",
      value: "trailer.licensePlate",
      class: "primary"
    },
    {
      text: "Đầu kéo",
      value: "tractor.licensePlate",
      class: "primary"
    }
  ];

  openConfirmBid(item: IBid, accept: boolean) {
    this.bid = item;
    this.isAccept = accept;
    this.dialogAddCombined = true;
  }

  clicked(value: IBid) {
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded.splice(0, this.expanded.length);
        this.containerSelected = [];
        this.bid = {} as IBid;
      } else {
        if (this.expanded.length > 0) {
          this.expanded.splice(0, this.expanded.length);
          this.expanded.push(value);
          this.containerSelected = value.containers as Array<IContainer>;
          this.bid = value;
          this.onContainerOptionsChange(this.containerOptions);
        } else {
          this.expanded.push(value);
          this.containerSelected = value.containers as Array<IContainer>;
          this.bid = value;
        }
      }
    } else {
      const index = this.expanded.findIndex(x => x.id === value.id);
      if (index === -1) {
        this.expanded.push(value);
        // this.containerSelected.concat(value.containers as Array<IContainer>);
      } else {
        this.expanded.splice(index, 1);
      }
    }
  }
  @Watch("getRouterId")
  async onGetRouterIdChange() {
    const _biddingDocument = await getBiddingDocument(
      parseInt(this.getRouterId)
    );
    this.biddingDocument = _biddingDocument.data.data;
  }
  @Watch("containerOptions")
  async onContainerOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      if (this.bid && this.bid.id) {
        const _containers = await getContainersByBid(this.bid.id, {
          page: val.page - 1,
          limit: val.itemsPerPage
        });
        if (_containers.data) {
          this.containerServerSideOptions.totalItems =
            _containers.data.totalElements;
          this.bid.containers = _containers.data.data;
        }
      }
      this.loading = false;
    }
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val !== "undefined") {
      this.loading = true;
      if (this.biddingDocument && this.$auth.user().roles) {
        if (this.$auth.user().roles[0] == "ROLE_MERCHANT") {
          const _bid = await getBidsByBiddingDocument(
            this.biddingDocument.id as number,
            {
              page: this.options.page - 1,
              limit: this.options.itemsPerPage
            }
          );
          if (_bid.data) {
            this.bids = _bid.data.data;
            this.numberWinner = this.bids.filter(
              (x: IBid) => x.status == "ACCEPTED"
            ).length;
            this.serverSideOptions.totalItems = _bid.data.totalElements;
          }
        } else if (this.$auth.user().roles[0] == "ROLE_FORWARDER") {
          const _bid = await getBidByBiddingDocumentAndForwarder(
            this.biddingDocument.id as number
          );
          if (_bid.data) {
            this.bids.splice(0, this.bids.length, _bid.data);
            this.serverSideOptions.totalItems = 1;
          }
        }
      }
      this.loading = false;
    }
  }
  get getRouterId() {
    return this.$route.params.id;
  }

  async created() {
    // TODO: API get Bidding Document
    const _biddingDocument = await getBiddingDocument(
      parseInt(this.getRouterId)
    );
    if (_biddingDocument.data) this.biddingDocument = _biddingDocument.data;
  }
  openReportDialog() {
    this.dialogReport = true;
  }
  openCreateBidDialog() {
    this.dialogBid = true;
  }
}
</script>
