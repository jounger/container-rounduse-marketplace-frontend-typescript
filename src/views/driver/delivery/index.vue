<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="shippingInfos"
        :loading="loading"
        item-key="id"
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
        no-data-text="Danh sách lịch sử giao hàng rỗng."
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Danh sách vận đơn</v-toolbar-title>
          </v-toolbar>
        </template>
        <template v-slot:item.outbound.grossWeight="{ item }">
          {{ item.outbound.grossWeight }} {{ item.outbound.unitOfMeasurement }}
        </template>
        <template v-slot:item.outbound.packingTime="{ item }">
          {{ formatDatetime(item.outbound.packingTime) }}
        </template>
        <template v-slot:item.outbound.booking.cutOffTime="{ item }">
          {{ formatDatetime(item.outbound.booking.cutOffTime) }}
        </template>
        <template v-slot:item.status="{ item }">
          <ChipStatus :status="item.status" />
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import Utils from "@/mixin/utils";
import { DataOptions } from "vuetify";
import ChipStatus from "@/components/ChipStatus.vue";
import { getShippingInfosByDriver } from "@/api/shipping-info";
import { IShippingInfo } from "@/entity/shipping-info";

@Component({
  mixins: [Utils],
  components: {
    ChipStatus
  }
})
export default class Delivery extends Vue {
  shippingInfos: Array<IShippingInfo> = [];
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
      value: "id"
    },
    { text: "Khối lượng hàng", value: "outbound.grossWeight" },
    { text: "Loại cont", value: "outbound.containerType.name" },
    { text: "Thời gian đóng hàng", value: "outbound.packingTime" },
    {
      text: "Nơi đóng hàng",
      value: "outbound.packingStation"
    },
    {
      text: "Thời gian Cut-off",
      value: "outbound.booking.cutOffTime"
    },
    {
      text: "Cảng xuất hàng",
      value: "outbound.booking.portOfLoading.fullname"
    },
    {
      text: "Trạng thái",
      value: "status"
    }
  ];

  @Watch("options", { deep: true })
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getShippingInfosByDriver({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _shippingInfos = _res.data.data;
        this.shippingInfos = _shippingInfos;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
