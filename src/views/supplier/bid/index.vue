<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="biddingDocuments"
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
        no-data-text="Danh sách HSMT đã tham gia rỗng."
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Danh sách Hồ sơ dự thầu</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              dark
              class="mb-2"
              @click="openCreateDialog()"
            >
              Thêm mới
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item.bidOpening="{ item }">
          {{ formatDatetime(item.bidOpening) }}
        </template>
        <template v-slot:item.bidClosing="{ item }">
          {{ formatDatetime(item.bidClosing) }}
        </template>
        <template v-slot:item.bidPackagePrice="{ item }">
          {{ currencyFormatter(item.bidPackagePrice) }}
        </template>
        <template v-slot:item.bidFloorPrice="{ item }">
          {{ currencyFormatter(item.bidFloorPrice) }}
        </template>
        <template v-slot:item.isMultipleAward="{ item }">
          {{ item.isMultipleAward ? "Đúng" : "Không" }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            class="ma-1"
            tile
            outlined
            color="info"
            @click.stop="openBiddingDocumentDetail(item)"
            small
          >
            <v-icon left dense>remove_red_eye</v-icon> Chi tiết
          </v-btn>
        </template>
        <!-- Show Bids expened -->
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length" class="px-0" v-if="loading == false">
            <v-data-table
              :headers="bidHeaders"
              :items="bids"
              :loading="loading"
              no-data-text="Danh sách Hồ sơ dự thầu rỗng."
              :options.sync="bidOptions"
              :server-items-length="bidServerSideOptions.totalItems"
              :footer-props="{
                'items-per-page-options': bidServerSideOptions.itemsPerPageItems
              }"
              :hide-default-footer="$auth.check('ROLE_FORWARDER')"
              disable-sort
              dense
            >
              <template v-slot:item.bidDate="{ item }">
                {{ formatDatetime(item.bidDate) }}
              </template>
              <template v-slot:item.validityPeriod="{ item }">
                {{ formatDatetime(item.validityPeriod) }}
              </template>
              <template v-slot:item.freezeTime="{ item }">
                {{ formatDatetime(item.freezeTime) }}
              </template>
              <template v-slot:item.status="{ item }">
                <ChipStatus :status="item.status" :sub="true" />
              </template>
              <template v-slot:item.actions="{ item }">
                <div
                  v-if="
                    ['PENDING', 'EXPIRED', 'CANCELED'].includes(item.status)
                  "
                >
                  <v-btn
                    class="ma-1"
                    tile
                    outlined
                    color="success"
                    :disabled="isFreezing(item)"
                    @click.stop="openEditDialog(item)"
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
                    @click.stop="openCancelDialog(item)"
                    x-small
                  >
                    <v-icon left small>close</v-icon> Hủy
                  </v-btn>
                </div>
              </template>
              <template v-slot:item.bidPrice="{ item }">
                {{ currencyFormatter(item.bidPrice) }}
              </template>
            </v-data-table>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <CreateBid
      v-if="dialogAdd"
      :biddingDocument.sync="biddingDocument"
      :bids.sync="bids"
      :dialogAdd.sync="dialogAdd"
      :totalItems.sync="serverSideOptions.totalItems"
    />
    <UpdateBid
      v-if="dialogEdit"
      :bid="bid"
      :bids.sync="bids"
      :biddingDocument="biddingDocument"
      :dialogEdit.sync="dialogEdit"
    />
    <v-row justify="center">
      <CancelBid
        v-if="dialogCancel"
        :dialogCancel.sync="dialogCancel"
        :bid="bid"
        :bids.sync="bids"
      />
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IBid } from "@/entity/bid";
import { IBiddingDocument } from "@/entity/bidding-document";
import CreateBid from "./components/CreateBid.vue";
import { getBiddingDocuments } from "@/api/bidding-document";
import Utils from "@/mixin/utils";
import UpdateBid from "./components/UpdateBid.vue";
import CancelBid from "./components/CancelBid.vue";
import { DataOptions } from "vuetify";
import { getBidsByBiddingDocument } from "@/api/bid";
import ChipStatus from "@/components/ChipStatus.vue";

@Component({
  mixins: [Utils],
  components: {
    CreateBid,
    UpdateBid,
    CancelBid,
    ChipStatus
  }
})
export default class Bid extends Vue {
  biddingDocuments: Array<IBiddingDocument> = [];
  biddingDocument = null as IBiddingDocument | null;
  bids: Array<IBid> = [];
  bid = null as IBid | null;
  expanded: Array<IBiddingDocument> = [];
  singleExpand = true;
  dialogAdd = false;
  dialogEdit = false;
  dialogCancel = false;
  loading = true;
  options = {
    page: 1,
    itemsPerPage: 10
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  bidOptions = {
    page: 1,
    itemsPerPage: 10
  } as DataOptions;
  bidServerSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  headers = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    { text: "Hãng tàu", value: "outbound.shippingLine.companyName" },
    { text: "Loại cont", value: "outbound.containerType.name" },
    { text: "Giá gói thầu", value: "bidPackagePrice" },
    { text: "Giá sàn", value: "bidFloorPrice" },
    { text: "Ngày mở thầu", value: "bidOpening" },
    { text: "Ngày đóng thầu", value: "bidClosing" },
    { text: "Nhiều thầu thắng", value: "isMultipleAward" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  bidHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id",
      class: "tertiary"
    },
    {
      text: "Số lượng Cont",
      value: "containers.length",
      class: "tertiary"
    },
    { text: "Giá thầu", value: "bidPrice", class: "tertiary" },
    { text: "Ngày gửi thầu", value: "bidDate", class: "tertiary" },
    {
      text: "Hiệu lực HSDT tới",
      value: "validityPeriod",
      class: "tertiary"
    },
    { text: "Khóa chỉnh sửa tới", value: "freezeTime", class: "tertiary" },
    { text: "Trạng thái", value: "status", class: "tertiary" },
    { text: "Hành động", value: "actions" }
  ];

  openBiddingDocumentDetail(value: IBiddingDocument) {
    this.$router.push({
      path: `/bidding-document/${value.id}`
    });
  }

  async loadMoreBids(val: DataOptions) {
    if (this.biddingDocument) {
      this.loading = true;
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
        this.bidServerSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }

  async clicked(value: IBiddingDocument) {
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded = [];
        this.biddingDocument = null;
      } else {
        if (this.expanded.length > 0) this.expanded = [];
        this.expanded.push(value);
        this.biddingDocument = value;
        await this.loadMoreBids({
          ...this.bidOptions,
          page: 1
        });
      }
    }
  }

  openCreateDialog() {
    this.biddingDocument = null;
    this.dialogAdd = true;
  }

  isFreezing(item: IBid) {
    const _freezeTime = item.freezeTime
      ? new Date(item.freezeTime)
      : new Date();
    const _isFreezing = new Date(_freezeTime).getTime() - new Date().getTime();
    return _isFreezing > 0 ? true : false;
  }

  openEditDialog(item: IBid) {
    if (this.isFreezing(item) == false) {
      this.bid = item;
      this.dialogEdit = true;
    }
  }

  openCancelDialog(item: IBid) {
    if (this.isFreezing(item) == false) {
      this.bid = item;
      this.dialogCancel = true;
    }
  }

  @Watch("bidOptions")
  async onBidOptionsChange(val: DataOptions, oldVal: DataOptions) {
    if (typeof val != "undefined" && val.page != oldVal.page) {
      await this.loadMoreBids(val);
    }
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getBiddingDocuments({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _biddingDocuments = _res.data.data;
        this.biddingDocuments = _biddingDocuments;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
