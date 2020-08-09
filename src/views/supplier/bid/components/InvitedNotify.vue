<template>
  <v-content>
    <v-card class="ma-5">
      <CreateBid
        v-if="dialogAdd"
        :biddingDocument.sync="biddingDocument"
        :dialogAdd.sync="dialogAdd"
        :biddingNotification="biddingNotification"
        :biddingNotifications.sync="biddingNotifications"
        :totalItemsBidNo.sync="serverSideOptions.totalItems"
      />
      <ConfirmBid
        v-if="dialogConfirm"
        :dialogConfirm.sync="dialogConfirm"
        :biddingNotifications.sync="biddingNotifications"
        :totalItems.sync="serverSideOptions.totalItems"
        :biddingDocument="biddingDocument"
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
        <template v-slot:item.actions="{ item }">
          <v-btn
            class="ma-1"
            tile
            outlined
            color="success"
            @click.stop="openAddDialog(item)"
            small
          >
            <v-icon left dense>add</v-icon> Đồng ý
          </v-btn>
          <v-btn
            class="ma-1"
            tile
            outlined
            color="error"
            @click.stop="openConfirmDialog(item)"
            small
          >
            <v-icon left dense>clear</v-icon> Từ chối
          </v-btn>
          <v-btn
            class="ma-1"
            tile
            outlined
            color="info"
            @click.stop="openBiddingDocumentDetail(item)"
            small
          >
            <v-icon left dense>details</v-icon> Chi tiết
          </v-btn>
        </template>
        <template v-slot:item.bidOpening="{ item }">
          {{ formatDatetime(item.relatedResource.bidOpening) }}
        </template>
        <template v-slot:item.isMultipleAward="{ item }">
          {{ item.relatedResource.isMultipleAward ? "Có" : "Không" }}
        </template>
        <template v-slot:item.bidClosing="{ item }">
          {{ formatDatetime(item.relatedResource.bidClosing) }}
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IBiddingDocument } from "@/entity/bidding-document";
import CreateBid from "./CreateBid.vue";
import { IBiddingNotification } from "@/entity/bidding-notification";
import { getBiddingNotificationsByUser } from "@/api/notification";
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
  biddingNotification = {} as IBiddingNotification;
  biddingDocument = {} as IBiddingDocument;
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
    { text: "Hãng tàu", value: "relatedResource.outbound.shippingLine" },
    { text: "Loại cont", value: "relatedResource.outbound.containerType" },
    { text: "Giá gói thầu", value: "relatedResource.bidPackagePrice" },
    { text: "Mở thầu", value: "bidOpening" },
    { text: "Đóng thầu", value: "bidClosing" },
    { text: "Nhiều thầu win", value: "isMultipleAward" },
    { text: "Hành động", value: "actions", sortable: false }
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
    { text: "Hiệu lực", value: "bidValidityPeriod" },
    { text: "Hành động", value: "actions", sortable: false }
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
      const _res = await getBiddingNotificationsByUser({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      });
      if (_res.data) {
        const _biddingNotifications = _res.data.data as IBiddingNotification[];
        this.biddingNotifications = _biddingNotifications.filter(
          x => x.action == "ADDED" && x.isHide == false
        );
        this.serverSideOptions.totalItems = _biddingNotifications.filter(
          x => x.action == "ADDED" && x.isHide == false
        ).length;
      }
      this.loading = false;
    }
  }
  openBiddingDocumentDetail(value: IBiddingNotification) {
    this.$router.push({
      path: `/bidding-document/${value.relatedResource.id}`
    });
  }
}
</script>
