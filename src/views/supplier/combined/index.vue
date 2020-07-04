<template>
  <v-content>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="outbounds"
        item-key="id"
        :loading="loading"
        :options.sync="options"
        :server-items-length="options.totalItems"
        :footer-props="{ 'items-per-page-options': options.itemsPerPageItems }"
        :actions-append="options.page"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Danh sách hàng đã ghép</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" @click="dialogAdd = true">
              Thêm mới
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item.packingTime="{ item }">
          {{ formatDatetime(item.packingTime) }}
        </template>
        <template v-slot:item.cutOffTime="{ item }">
          {{ formatDatetime(item.booking.cutOffTime) }}
        </template>
        <template v-slot:item.grossWeight="{ item }">
          {{ item.grossWeight }} {{ item.unitOfMesurement }}
        </template>
        <template v-slot:item.fcl="{ item }">
          {{ item.booking.isFcl ? "Có" : "Không" }}
        </template>
        <template v-slot:item.unit="{ item }">
          {{ item.booking.unit }} x {{ item.containerType }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn icon dark @click="gotoDetail(item)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { ICombined } from "@/entity/combined";
import { PaginationResponse } from "@/api/payload";
import { getCombinedsByUser } from "@/api/combined";
import { IBiddingDocument } from "@/entity/bidding-document";
import { IOutbound } from "@/entity/outbound";
import Utils from "@/mixin/utils";
import { CombinedData } from "./data";

@Component({
  mixins: [Utils]
})
export default class Combined extends Vue {
  biddingDocuments: Array<IBiddingDocument> = [];
  outbounds: Array<IOutbound> = [];
  combineds: Array<ICombined> = [];
  combined = {} as ICombined;
  search = "";
  loading = true;
  options = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
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
    { text: "Booking No.", value: "booking.bookingNumber" },
    { text: "Hãng tàu", value: "shippingLine" },
    { text: "Trạng thái", value: "status" },
    { text: "Thời gian đóng hàng", value: "packingTime" },
    { text: "Thời gian tàu chạy", value: "cutOffTime" },
    { text: "Nơi đóng hàng", value: "packingStation" },
    { text: "Cảng đóng hàng", value: "booking.portOfLoading" },
    { text: "Khối lượng hàng", value: "payload" },
    { text: "Số cont", value: "unit" },
    { text: "FCL", value: "fcl" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  gotoDetail(item: any) {
    console.log(item);
  }

  reduceData(combineds: Array<ICombined>) {
    this.biddingDocuments = combineds.reduce(function(
      pV: Array<IBiddingDocument>,
      cV: ICombined
    ) {
      pV.push(cV.biddingDocument);
      return pV;
    },
    []);
    this.outbounds = this.biddingDocuments.reduce(function(
      pV: Array<IOutbound>,
      cV: IBiddingDocument
    ) {
      pV.push(cV.outbound as IOutbound);
      return pV;
    },
    []);
  }

  created() {
    // TODO: Fake data
    this.combineds = CombinedData;
    this.reduceData(this.combineds);
    this.options.totalItems = 10;
    this.loading = false;
  }
  /*
  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    console.log(this.$auth.user());
    if (val !== oldVal) {
      getCombinedsByUser({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<ICombined> = res.data;
          this.combineds = response.data;
          this.reduceData(this.combineds);
          this.options.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
  */
}
</script>
<style type="text/css">
.line {
  margin-top: 10px;
  width: 520px;
  border-bottom: 1px solid black;
  position: absolute;
}
</style>