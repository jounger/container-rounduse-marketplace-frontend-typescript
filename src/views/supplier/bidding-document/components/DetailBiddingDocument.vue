<template>
  <v-container fluid>
    <v-card
      class="d-flex justify-space-around align-start elevation-0"
      v-if="biddingDocument"
      width="100%"
    >
      <!-- OUTOUNBD -->
      <v-card class="order-0 flex-grow-0 mx-auto mr-5" max-width="400" tile>
        <v-img
          height="100"
          max-width="400"
          src="@/assets/images/background-cover.jpg"
        ></v-img>
        <v-card-title>Hồ sơ mời thầu (HSMT): #{{ getRouterId }}</v-card-title>
        <v-card-text>
          Chủ hàng xuất:
          <SupplierRating :supplier="biddingDocument.offeree" />

          <v-list dense>
            <v-subheader>Thông tin HSMT</v-subheader>
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
            <v-list-item>
              <v-list-item-icon>
                <v-icon>lock</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  >Nhiều thầu thắng:
                  {{
                    biddingDocument.isMultipleAward ? "Đúng" : "Không"
                  }}</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-list dense>
            <v-subheader>Thông tin Hàng Xuất</v-subheader>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>import_export</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  "Mã hàng xuất: " + biddingDocument.outbound.code
                }}</v-list-item-title>
                <v-list-item-subtitle
                  >{{
                    "Khối lượng: " +
                      biddingDocument.outbound.grossWeight +
                      biddingDocument.outbound.unitOfMeasurement
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
                  "Hãng tàu: " +
                    biddingDocument.outbound.shippingLine.companyName
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    "Số lượng Cont: " +
                      biddingDocument.outbound.booking.unit +
                      " x " +
                      biddingDocument.outbound.containerType.name
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
                  "Đóng hàng tại: " + biddingDocument.outbound.packingStation
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
                <v-icon>home_work</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{
                    "Cảng bốc hàng: " +
                      biddingDocument.outbound.booking.portOfLoading.fullname
                  }}</v-list-item-title
                >
                <v-list-item-subtitle>
                  {{ "Mô tả: " + biddingDocument.outbound.goodsDescription }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
      <v-card class="order-1 flex-grow-1 mx-auto">
        <v-card-title
          ><div class="text-h4 text-no-wrap font-weight-bold">
            Giá dẫn đầu:
            {{
              currencyFormatter(
                biddingDocument.priceLeadership,
                biddingDocument.currencyOfPayment
              )
            }}
            <v-icon color="success" large>check_circle_outline</v-icon>
          </div>
          <v-spacer></v-spacer>
          <v-tooltip left v-if="$auth.check('ROLE_FORWARDER')">
            <template v-slot:activator="{ on, attrs }">
              <v-btn @click="openReportDialog()" icon v-bind="attrs" v-on="on">
                <v-icon large color="red">report</v-icon>
              </v-btn>
            </template>
            <span>Báo cáo HSMT</span>
          </v-tooltip>
        </v-card-title>
        <v-card-subtitle class="text-h7 text-no-wrap font-weight-bold"
          >Mã hồ sơ mời thầu: #{{ getRouterId }}</v-card-subtitle
        >
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6">
              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>attach_money</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      >Tham gia: {{ serverSideOptions.totalItems }} chủ
                      xe</v-list-item-title
                    >
                    <v-list-item-subtitle>
                      Số thầu thắng:
                      {{ numberWinner + "/" + serverSideOptions.totalItems }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-col>
            <v-col cols="12" sm="6">
              <v-list dense>
                <v-list-item v-if="biddingDocument.status == 'BIDDING'">
                  <v-list-item-icon>
                    <v-icon>date_range</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      >{{
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
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="biddingDocument.status == 'EXPIRED'">
                  <v-list-item-icon>
                    <v-icon>mood_bad</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Thầu đã hết hạn</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item v-if="biddingDocument.status == 'CANCELED'">
                  <v-list-item-icon>
                    <v-icon>mood_bad</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title style="color:red;"
                      >Thầu đã bị hủy</v-list-item-title
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
            v-if="$auth.check('ROLE_FORWARDER') && bids.length < 1"
          >
            Thêm mới
          </v-btn></v-card-title
        >
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
          :server-items-length="serverSideOptions.totalItems"
          :footer-props="{
            'items-per-page-options': serverSideOptions.itemsPerPageItems
          }"
          :actions-append="options.page"
          no-data-text="Danh sách Hồ sơ dự thầu rỗng."
          disable-sort
          class="elevation-0"
          :hide-default-footer="$auth.check('ROLE_FORWARDER')"
        >
          <template v-slot:item.bidder.fullname="{ item }">
            <div>{{ item.bidder.fullname }}</div>
            <small>SĐT: {{ item.bidder.phone }}</small>
          </template>
          <template v-slot:item.bidDate="{ item }">
            <div>{{ formatDatetime(item.bidDate) }}</div>
            <small>Hiệu lực: {{ formatDatetime(item.validityPeriod) }}</small>
          </template>
          <template v-slot:item.bidPrice="{ item }">
            {{ currencyFormatter(item.bidPrice) }}
          </template>
          <template v-slot:item.status="{ item }">
            <ChipStatus :status="item.status" />
          </template>
          <template v-slot:item.actions="{ item }">
            <div
              v-if="item.status == 'PENDING' && $auth.check('ROLE_MERCHANT')"
            >
              <v-btn
                class="ma-1"
                x-small
                tile
                outlined
                color="success"
                @click.stop="openConfirmBid(item, true)"
                :disabled="isDisableConfirm(item)"
              >
                <v-icon left dense>library_add_check </v-icon>Đồng ý
              </v-btn>
              <v-btn
                class="ma-1"
                x-small
                tile
                outlined
                color="error"
                @click.stop="openConfirmBid(item, false)"
              >
                <v-icon left dense>remove_circle</v-icon>Từ chối
              </v-btn>
            </div>
            <div
              v-if="
                ['PENDING', 'EXPIRED', 'CANCELED'].includes(item.status) &&
                  $auth.check('ROLE_FORWARDER')
              "
            >
              <v-btn
                class="ma-1"
                tile
                outlined
                color="success"
                @click.stop="openEditBidDialog(item)"
                :disabled="isFreezing(item)"
                x-small
              >
                <v-icon left small>edit</v-icon> Sửa
              </v-btn>
              <v-btn
                class="ma-1"
                tile
                outlined
                color="error"
                :disabled="isFreezing(item)"
                @click.stop="openCancelBidDialog(item)"
                x-small
              >
                <v-icon left small>close</v-icon> Hủy
              </v-btn>
            </div>
          </template>

          <template v-slot:expanded-item="{ headers }">
            <td :colspan="headers.length" class="px-0" v-if="loading == false">
              <v-data-table
                v-if="biddingDocument.isMultipleAward"
                :headers="containerHeaders"
                :items="containers"
                item-key="id"
                :loading="loading"
                :options.sync="containerOptions"
                :server-items-length="containerServerSideOptions.totalItems"
                :footer-props="{
                  'items-per-page-options':
                    containerServerSideOptions.itemsPerPageItems
                }"
                :actions-append="containerOptions.page"
                v-model="containerSelected"
                :show-select="
                  $auth.check('ROLE_MERCHANT') &&
                    bid &&
                    ['PENDING'].includes(bid.status)
                "
                @item-selected="selectContainer"
                disable-sort
                dense
              >
                <template v-slot:header.data-table-select> </template>
                <template v-slot:item.status="{ item }">
                  <ChipStatus :status="item.status" :sub="true" />
                </template>
              </v-data-table>
              <v-data-table
                v-else
                :headers="containerHeaders"
                :items="containers"
                item-key="id"
                :loading="loading"
                :options.sync="containerOptions"
                :server-items-length="containerServerSideOptions.totalItems"
                :footer-props="{
                  'items-per-page-options':
                    containerServerSideOptions.itemsPerPageItems
                }"
                :actions-append="containerOptions.page"
                :show-select="biddingDocument.isMultipleAward"
                disable-sort
                dense
              >
                <template v-slot:item.status="{ item }">
                  <ChipStatus :status="item.status" :sub="true" />
                </template>
              </v-data-table>
            </td>
          </template>
        </v-data-table>
      </v-card>
    </v-card>
    <v-row justify="center">
      <CreateReport
        v-if="dialogReport"
        :dialogAdd.sync="dialogReport"
        :biddingDocument.sync="biddingDocument"
      />
      <ConfirmBid
        v-if="dialogRejectBid"
        :dialogConfirm.sync="dialogRejectBid"
        :bids.sync="bids"
        :isAccept="false"
        :bid="bid"
      />
      <CancelBid
        v-if="dialogCancelBid"
        :dialogCancel.sync="dialogCancelBid"
        :bid="bid"
        :bids.sync="bids"
      />
    </v-row>
    <UpdateBid
      v-if="dialogEditBid"
      :bid="bid"
      :bids.sync="bids"
      :biddingDocument="biddingDocument"
      :dialogEdit.sync="dialogEditBid"
    />
    <CreateCombined
      v-if="bid && dialogAddCombined"
      :dialogAdd.sync="dialogAddCombined"
      :numberWinner.sync="numberWinner"
      :isMultipleAward="biddingDocument.isMultipleAward"
      :bid.sync="bid"
    />
    <CreateBid
      v-if="dialogBid"
      :biddingDocument.sync="biddingDocument"
      :dialogAdd.sync="dialogBid"
      :bids.sync="bids"
      :totalItems.sync="serverSideOptions.totalItems"
    />
  </v-container>
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
import { getBidsByBiddingDocument } from "@/api/bid";
import ConfirmBid from "./ConfirmBid.vue";
import ChipStatus from "@/components/ChipStatus.vue";
import UpdateBid from "../../bid/components/UpdateBid.vue";
import CancelBid from "../../bid/components/CancelBid.vue";

@Component({
  mixins: [FormValidate, Utils],
  components: {
    CreateCombined,
    CreateBid,
    UpdateBid,
    CancelBid,
    CreateReport,
    SupplierRating,
    ConfirmBid,
    ChipStatus
  }
})
export default class DetailBiddingDocument extends Vue {
  biddingDocument = null as IBiddingDocument | null;
  loading = false;
  containers = [] as Array<IContainer>;
  containerSelected = [] as Array<IContainer>;
  dialogAddCombined = false;
  dialogRejectBid = false;
  dialogReport = false;
  dialogBid = false;
  dialogEditBid = false;
  dialogCancelBid = false;
  bid = null as IBid | null;
  expanded: Array<IBid> = [];
  singleExpand = true;
  numberWinner = 0;
  options = {
    page: 1,
    itemsPerPage: 10
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  containerOptions = {
    page: 1,
    itemsPerPage: 10
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
    { text: "Bên gửi thầu", value: "bidder.companyName" },
    { text: "Người đại diện", value: "bidder.fullname" },
    { text: "Ngày thầu", value: "bidDate" },
    { text: "Giá gửi thầu", value: "bidPrice" },
    { text: "Trạng thái", value: "status" },
    { text: "Hành động", value: "actions" }
  ];

  containerHeaders = [
    {
      text: "Container No.",
      align: "start",
      sortable: false,
      value: "number",
      class: "tertiary"
    },
    { text: "Lái xe", value: "driver.fullname", class: "tertiary" },
    { text: "SĐT liên hệ", value: "driver.phone", class: "tertiary" },
    {
      text: "Rơ moóc",
      value: "trailer.licensePlate",
      class: "tertiary"
    },
    {
      text: "Đầu kéo",
      value: "tractor.licensePlate",
      class: "tertiary"
    },
    { text: "Trạng thái", value: "status", class: "tertiary" }
  ];

  isDisableConfirm(item: IBid) {
    if (this.biddingDocument) {
      if (this.biddingDocument.isMultipleAward) {
        if (this.bid == null) return true;
        if (this.bid.id != item.id) return true;
        const _containers = this.bid.containers as IContainer[];
        return _containers.filter(x => x.isSelected).length <= 0;
      }
      return false;
    }
    return true;
  }

  openConfirmBid(item: IBid, accept: boolean) {
    this.bid = item;
    if (accept) this.dialogAddCombined = true;
    else this.dialogRejectBid = true;
  }

  isFreezing(item: IBid) {
    const _freezeTime = item.freezeTime
      ? new Date(item.freezeTime)
      : new Date();
    const _isFreezing = new Date(_freezeTime).getTime() - new Date().getTime();
    return _isFreezing > 0 ? true : false;
  }

  openEditBidDialog(item: IBid) {
    if (this.isFreezing(item) == false) {
      this.bid = item;
      this.dialogEditBid = true;
    }
  }

  openCancelBidDialog(item: IBid) {
    if (this.isFreezing(item) == false) {
      this.bid = item;
      this.dialogCancelBid = true;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectContainer(select: any) {
    select.item.isSelected = select.value;
    if (this.bid) {
      const _container = this.bid.containers as IContainer[];
      const index = _container.findIndex(
        (x: IContainer) => x.id === select.item.id
      );
      if (select.value == false && index != -1) {
        this.bid.containers.splice(index, 1);
      } else if (select.value && index == -1) {
        this.bid.containers.push(select.item);
      } else if (select.value && index != -1) {
        this.bid.containers.splice(index, 1, select.item);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // selectAllContainer(select: any) {
  //   const _items = select.items as IContainer[];
  //   _items.forEach(x => (x.isSelected = select.value));
  //   if (this.bid) {
  //     this.bid.containers.splice(0, this.bid.containers.length, ..._items);
  //   }
  // }

  async clicked(value: IBid) {
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded = [];
        this.bid = null;
      } else {
        if (this.expanded.length > 0) {
          this.expanded = [];
          this.bid = null;
        }
        this.expanded.push(value);
        this.bid = value;
        await this.loadMoreContainers({
          ...this.containerOptions,
          page: 1
        });
      }
    }
  }

  @Watch("getRouterId", { immediate: true })
  async onGetRouterIdChange() {
    const _res = await getBiddingDocument(this.getRouterId);
    if (_res.data) {
      const _biddingDocument = _res.data;
      this.biddingDocument = _biddingDocument;
    }
  }

  async loadMoreContainers(val: DataOptions) {
    if (this.bid) {
      this.loading = true;
      const _res = await getContainersByBid(this.bid.id as number, {
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _containers = _res.data.data;
        this.containers = _containers;
        this.containerServerSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }

  @Watch("containerOptions", { deep: true })
  async onContainerOptionsChange(val: DataOptions, oldVal: DataOptions) {
    if (typeof val != "undefined" && val.page != oldVal.page) {
      await this.loadMoreContainers(val);
    }
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val !== "undefined" && this.biddingDocument) {
      this.loading = true;
      // GET TOTAL BIDS
      const _res = await getBidsByBiddingDocument(
        this.biddingDocument.id as number,
        {
          page: val.page - 1,
          limit: val.itemsPerPage
        }
      );
      if (_res.data) {
        const _bids = _res.data.data;
        this.bids = _bids;
        this.serverSideOptions.totalItems = _res.data.totalElements;
        if (this.$auth.check("ROLE_FORWARDER")) {
          this.bid = _bids[0];
          this.expanded.push(_bids[0]);
          await this.loadMoreContainers({
            ...this.containerOptions,
            page: 1
          });
        }
      }
      // COUNT NUM OF ACCEPTED BIDS
      if (this.$auth.check("ROLE_MERCHANT")) {
        const _res_ = await getBidsByBiddingDocument(
          this.biddingDocument.id as number,
          {
            page: val.page - 1,
            limit: val.itemsPerPage,
            status: "ACCEPTED"
          }
        );
        if (_res_.data) {
          this.numberWinner = _res_.data.totalElements;
        }
      }
      this.loading = false;
    }
  }

  get getRouterId() {
    const biddingDocumentId = this.$route.params.id;
    if (biddingDocumentId) return parseInt(biddingDocumentId);
    return -1;
  }

  openReportDialog() {
    this.dialogReport = true;
  }

  openCreateBidDialog() {
    this.dialogBid = true;
  }
}
</script>
