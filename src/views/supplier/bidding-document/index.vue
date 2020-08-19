<template>
  <v-container fluid>
    <v-row justify="center">
      <DeleteBiddingDocument
        v-if="dialogDel"
        :dialogDel.sync="dialogDel"
        :biddingDocument="biddingDocument"
        :biddingDocuments.sync="biddingDocuments"
        :totalItems.sync="serverSideOptions.totalItems"
      />
    </v-row>
    <v-row justify="center">
      <CancelBiddingDocument
        v-if="dialogCancel"
        :dialogCancel.sync="dialogCancel"
        :biddingDocument="biddingDocument"
        :biddingDocuments.sync="biddingDocuments"
      />
    </v-row>
    <CreateBiddingDocument
      v-if="dialogAdd"
      :biddingDocuments.sync="biddingDocuments"
      :outbounds.sync="outbounds"
      :dialogAdd.sync="dialogAdd"
      :totalItems.sync="serverSideOptions.totalItems"
    />
    <UpdateBiddingDocument
      v-if="dialogEdit"
      :biddingDocument="biddingDocument"
      :biddingDocuments.sync="biddingDocuments"
      :dialogEdit.sync="dialogEdit"
    />

    <v-card>
      <v-data-table
        :headers="headers"
        :items="biddingDocuments"
        item-key="id"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
        no-data-text="Danh sách HSMT rỗng."
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Danh sách đấu thầu</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" @click="dialogAdd = true">
              Thêm mới
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item.unit="{ item }">
          {{
            item.outbound.booking.unit +
              " x " +
              item.outbound.containerType.name
          }}
        </template>
        <template v-slot:item.status="{ item }">
          <ChipStatus :status="item.status" />
        </template>
        <template v-slot:item.actions="{ item }">
          <v-menu :close-on-click="true">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" icon outlined v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item
                @click.stop="openEditDialog(item)"
                v-if="item.status == 'BIDDING'"
              >
                <v-list-item-icon>
                  <v-icon small>edit</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Chỉnh sửa</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click.stop="openDetailDialog(item)">
                <v-list-item-icon>
                  <v-icon small>remove_red_eye</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xem chi tiết</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click.stop="openCancelDialog(item)"
                v-if="item.status == 'BIDDING'"
              >
                <v-list-item-icon>
                  <v-icon small>cancel_presentation</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Hủy bỏ</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click.stop="openDeleteDialog(item)"
                v-if="item.status != 'COMBINED'"
              >
                <v-list-item-icon>
                  <v-icon small>delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xóa</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
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
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IBiddingDocument } from "@/entity/bidding-document";
import CreateBiddingDocument from "./components/CreateBiddingDocument.vue";
import UpdateBiddingDocument from "./components/UpdateBiddingDocument.vue";
import { IOutbound } from "@/entity/outbound";
import { getBiddingDocuments } from "@/api/bidding-document";
import DeleteBiddingDocument from "./components/DeleteBiddingDocument.vue";
import CancelBiddingDocument from "./components/CancelBiddingDocument.vue";
import Utils from "@/mixin/utils";
import { getContainerTypes } from "@/api/container-type";
import { IContainerType } from "@/entity/container-type";
import { DataOptions } from "vuetify";
import { getPorts } from "@/api/port";
import { getShippingLines } from "@/api/shipping-line";
import { IShippingLine } from "@/entity/shipping-line";
import { IPort } from "@/entity/port";
import { addTimeToDate } from "@/utils/tool";
import ChipStatus from "@/components/ChipStatus.vue";

@Component({
  mixins: [Utils],
  components: {
    CreateBiddingDocument,
    UpdateBiddingDocument,
    DeleteBiddingDocument,
    CancelBiddingDocument,
    ChipStatus
  }
})
export default class BiddingDocument extends Vue {
  biddingDocuments: Array<IBiddingDocument> = [];
  biddingDocument = null as IBiddingDocument | null;
  outbounds: Array<IOutbound> = [];
  dialogAdd = false;
  dialogEdit = false;
  dialogCancel = false;
  dialogDel = false;
  moreOptions = false;
  shippingLineSearch = "";
  containerTypeSearch = "";
  bookingNumberSearch = "";
  statusSearch = "";
  minBidPackagePrice = "";
  maxBidPackagePrice = "";
  isMultipleAwardSearch = false;
  bidOpeningSearch = "";
  bidClosingSearch = "";
  search = "";
  // API list
  ports: Array<IPort> = [];
  shippingLines: Array<IShippingLine> = [];
  containerTypes: Array<IContainerType> = [];
  status: Array<string> = [];
  loading = true;
  dateInit = addTimeToDate(new Date().toString());
  options = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
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
    { text: "Mã hàng xuất", value: "outbound.code" },
    { text: "Hãng tàu", value: "outbound.shippingLine.companyName" },
    { text: "Số cont", value: "unit" },
    { text: "Giá gói thầu", value: "bidPackagePrice" },
    { text: "Đóng thầu", value: "bidClosing" },
    { text: "Nhiều thầu thắng", value: "isMultipleAward" },
    { text: "Trạng thái", value: "status" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  openEditDialog(item: IBiddingDocument) {
    this.biddingDocument = item;
    this.dialogEdit = true;
  }

  openCancelDialog(item: IBiddingDocument) {
    this.biddingDocument = item;
    this.dialogCancel = true;
  }

  openDeleteDialog(item: IBiddingDocument) {
    this.biddingDocument = item;
    this.dialogDel = true;
  }

  openDetailDialog(item: IBiddingDocument) {
    this.$router.push({ path: `/bidding-document/${item.id}` });
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

  async created() {
    this.status = ["BIDDING", "COMBINED", "CANCELED"];
    // API GET Ports
    const _ports = await getPorts({
      page: 0,
      limit: 100
    });
    this.ports = _ports.data.data || [];
    // API GET Shipping Line
    const _shippingLines = await getShippingLines({
      page: 0,
      limit: 100
    });
    this.shippingLines = _shippingLines.data.data || [];
    // API GET Container Type
    const _containerTypes = await getContainerTypes({
      page: 0,
      limit: 100
    });
    this.containerTypes = _containerTypes.data.data || [];
  }

  get portsToString() {
    return this.ports.map(x => x.nameCode);
  }
  get shippingLinesToString() {
    return this.shippingLines.map(x => x.companyCode);
  }
  get containerTypesToString() {
    return this.containerTypes.map(x => x.name);
  }
}
</script>
