<template>
  <v-container fluid>
    <v-card>
      <CreateBid
        v-if="dialogAdd"
        :biddingDocument="biddingDocument"
        :dialogAdd.sync="dialogAdd"
        :biddingNotification="biddingNotification"
        :biddingNotifications.sync="biddingNotifications"
      />
      <ConfirmBid
        v-if="dialogConfirm"
        :dialogConfirm.sync="dialogConfirm"
        :biddingNotifications.sync="biddingNotifications"
        :totalItems.sync="serverSideOptions.totalItems"
        :biddingNotification="biddingNotification"
      />
      <v-data-table
        :headers="headers"
        :items="biddingNotifications"
        item-key="id"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
        no-data-text="Danh sách HSMT nhận được rỗng."
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>HSMT nhận được</v-toolbar-title>
          </v-toolbar>
        </template>
        <template v-slot:item.unit="{ item }">
          {{
            item.relatedResource.outbound.booking.unit +
              " x " +
              item.relatedResource.outbound.containerType.name
          }}
        </template>
        <template v-slot:item.detail="{ item }">
          <v-btn
            class="ma-1"
            tile
            outlined
            color="info"
            :to="`/bidding-document/${item.relatedResource.id}`"
            small
          >
            <v-icon left dense>remove_red_eye</v-icon> Chi tiết
          </v-btn>
        </template>
        <template v-slot:item.actions="{ item }">
          <div
            v-if="
              ['BIDDING'].includes(item.relatedResource.status) &&
                item.isHide == false
            "
          >
            <v-btn
              class="ma-1"
              tile
              outlined
              color="success"
              @click.stop="openAddDialog(item)"
              x-small
            >
              <v-icon left dense>add</v-icon> Đồng ý
            </v-btn>
            <v-btn
              class="ma-1"
              tile
              outlined
              color="error"
              @click.stop="openConfirmDialog(item)"
              x-small
            >
              <v-icon left dense>clear</v-icon> Từ chối
            </v-btn>
          </div>
        </template>
        <template v-slot:item.bidOpening="{ item }">
          {{ formatDatetime(item.relatedResource.bidOpening) }}
        </template>
        <template v-slot:item.isMultipleAward="{ item }">
          {{ item.relatedResource.isMultipleAward ? "Đúng" : "Không" }}
        </template>
        <template v-slot:item.bidClosing="{ item }">
          {{ formatDatetime(item.relatedResource.bidClosing) }}
        </template>
        <template v-slot:item.relatedResource.bidPackagePrice="{ item }">
          {{ currencyFormatter(item.relatedResource.bidPackagePrice) }}
        </template>
        <template v-slot:item.relatedResource.bidFloorPrice="{ item }">
          {{ currencyFormatter(item.relatedResource.bidFloorPrice) }}
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IBiddingDocument } from "@/entity/bidding-document";
import CreateBid from "./CreateBid.vue";
import { IBiddingNotification } from "@/entity/notification";
import { getBiddingNotifications } from "@/api/notification";
import Utils from "@/mixin/utils";
import { DataOptions } from "vuetify";
import ConfirmBid from "./ConfirmBid.vue";

@Component({
  mixins: [Utils],
  components: {
    CreateBid,
    ConfirmBid
  }
})
export default class InvitedNotify extends Vue {
  biddingNotifications: Array<IBiddingNotification> = [];
  biddingNotification = null as IBiddingNotification | null;
  biddingDocument = null as IBiddingDocument | null;
  dialogAdd = false;
  dialogConfirm = false;
  loading = true;
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
      value: "relatedResource.id"
    },
    {
      text: "Bên gửi HSMT",
      value: "relatedResource.offeree.companyName"
    },
    {
      text: "Hãng tàu",
      value: "relatedResource.outbound.shippingLine.companyName"
    },
    { text: "Số cont", value: "unit" },
    { text: "Giá gói thầu", value: "relatedResource.bidPackagePrice" },
    { text: "Giá sàn", value: "relatedResource.bidFloorPrice" },
    { text: "Mở thầu", value: "bidOpening" },
    { text: "Đóng thầu", value: "bidClosing" },
    { text: "Nhiều thầu thắng", value: "isMultipleAward" },
    { text: "Chi tiết HSDT", value: "detail" },
    { text: "Hành động", value: "actions" }
  ];

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
    { text: "Hiệu lực", value: "validityPeriod" },
    { text: "Hành động", value: "actions" }
  ];

  openAddDialog(item: IBiddingNotification) {
    this.biddingDocument = item.relatedResource as IBiddingDocument;
    this.biddingNotification = item;
    this.dialogAdd = true;
  }

  openConfirmDialog(item: IBiddingNotification) {
    this.biddingNotification = item;
    this.biddingDocument = item.relatedResource as IBiddingDocument;
    this.dialogConfirm = true;
  }

  @Watch("options", { deep: true })
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getBiddingNotifications({
        page: val.page - 1,
        limit: val.itemsPerPage,
        status: "BIDDING_INVITED"
      });
      if (_res.data) {
        const _biddingNotifications = _res.data.data as IBiddingNotification[];
        this.biddingNotifications = _biddingNotifications;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
