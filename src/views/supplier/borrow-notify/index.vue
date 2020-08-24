<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="shippingLineNotifications"
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
        no-data-text="Danh sách yêu cầu rỗng."
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Danh sách yêu cầu mượn container</v-toolbar-title>
          </v-toolbar>
        </template>
        <template v-slot:item.type="{ item }">
          <ChipStatus :status="item.action" type="action" />
        </template>
        <template v-slot:item.sendDate="{ item }">
          {{ formatDatetime(item.sendDate) }}
        </template>
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length" class="px-0" v-if="loading == false">
            <v-data-table
              :headers="shippingInfoHeaders"
              :items="shippingInfos"
              :loading="loading"
              :options.sync="shippingInfoOptions"
              :server-items-length="shippingInfoServerSideOptions.totalItems"
              :footer-props="{
                'items-per-page-options':
                  shippingInfoServerSideOptions.itemsPerPageItems
              }"
              :actions-append="shippingInfoOptions.page"
              disable-sort
              dense
            >
              <template v-slot:item.outbound.packingTime="{ item }">
                {{ formatDatetime(item.outbound.packingTime) }}
              </template>
              <template v-slot:item.outbound.booking.cutOffTime="{ item }">
                {{ formatDatetime(item.outbound.booking.cutOffTime) }}
              </template>
              <template v-slot:item.status="{ item }">
                <ChipStatus :status="item.status" :sub="true" />
              </template>
              <template v-slot:item.actions="{ item }">
                <v-btn
                  v-if="
                    $auth.check('ROLE_SHIPPINGLINE') &&
                      ['SHIPPING'].includes(item.status)
                  "
                  @click="openQRCodeDialog(item)"
                  class="ma-1"
                  tile
                  outlined
                  color="info"
                  small
                >
                  <v-icon left>stay_primary_landscape</v-icon> Tạo mã QR
                </v-btn>
              </template>
            </v-data-table>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <v-row justify="center">
      <QRCodeGenerator
        v-if="dialogQRGender"
        :dialogGender.sync="dialogQRGender"
        :shippingInfo="shippingInfo"
      />
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { ICombined } from "@/entity/combined";
import Utils from "@/mixin/utils";
import { DataOptions } from "vuetify";
import { getShippingInfosByCombined } from "@/api/shipping-info";
import { IShippingLineNotification } from "@/entity/notification";
import { getCombinedNotifications } from "@/api/notification";
import ChipStatus from "@/components/ChipStatus.vue";
import { IShippingInfo } from "@/entity/shipping-info";
import QRCodeGenerator from "@/components/QRCodeGenerator.vue";

@Component({
  mixins: [Utils],
  components: {
    ChipStatus,
    QRCodeGenerator
  }
})
export default class BorrowNotify extends Vue {
  shippingLineNotifications: Array<IShippingLineNotification> = [];
  shippingLineNotification = null as IShippingLineNotification | null;
  shippingInfos: Array<ICombined> = [];
  shippingInfo = null as IShippingInfo | null;
  dialogQRGender = false;
  loading = true;
  expanded: Array<IShippingLineNotification> = [];
  singleExpand = true;
  options = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  shippingInfoOptions = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  shippingInfoServerSideOptions = {
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
    { text: "Bên mượn", value: "relatedResource.bid.bidder.companyName" },
    { text: "Ngày gửi y/c", value: "sendDate" },
    { text: "Loại yêu cầu", value: "type" },
    { text: "Nội dung", value: "title" }
  ];
  shippingInfoHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    {
      text: "Container No.",
      value: "container.number"
    },
    { text: "Lái xe", value: "container.driver.fullname" },
    { text: "SĐT liên hệ", value: "container.driver.phone", class: "tertiary" },
    {
      text: "Đầu kéo",
      value: "container.tractor.licensePlate"
    },
    {
      text: "Ngày đóng hàng",
      value: "outbound.packingTime"
    },
    {
      text: "Ngày Cut-off",
      value: "outbound.booking.cutOffTime"
    },
    {
      text: "Trạng thái",
      value: "status"
    },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  openQRCodeDialog(item: IShippingInfo) {
    this.shippingInfo = item;
    this.dialogQRGender = true;
  }

  async clicked(value: IShippingLineNotification) {
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded = [];
        this.shippingLineNotification = null;
      } else {
        if (this.expanded.length > 0) this.expanded = [];
        this.expanded.push(value);
        this.shippingLineNotification = value;
        await this.loadMoreShippingInfo({
          ...this.shippingInfoOptions,
          page: 1
        });
      }
    }
  }

  async loadMoreShippingInfo(val: DataOptions) {
    if (this.shippingLineNotification) {
      this.loading = true;
      const _res = await getShippingInfosByCombined(
        this.shippingLineNotification.relatedResource.id as number,
        {
          page: val.page - 1,
          limit: val.itemsPerPage
        }
      );
      if (_res.data) {
        const _shippingInfos = _res.data.data;
        this.shippingInfos = _shippingInfos;
        this.shippingInfoServerSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getCombinedNotifications({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _shippingLineNotifications = _res.data.data;
        this.shippingLineNotifications = _shippingLineNotifications;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }

  @Watch("shippingInfoOptions", { deep: true })
  async onShippingInfoOptionsChange(val: DataOptions, oldVal: DataOptions) {
    if (typeof val != "undefined" && val.page != oldVal.page) {
      await this.loadMoreShippingInfo(val);
    }
  }
}
</script>
