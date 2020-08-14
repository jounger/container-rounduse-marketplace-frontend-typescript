<template>
  <v-content>
    <CreateOutbound
      :dialogAdd.sync="dialogAdd"
      :outbounds.sync="outbounds"
      :totalItems.sync="serverSideOptions.totalItems"
    />
    <UpdateOutbound
      :outbound="outbound"
      :dialogEdit.sync="dialogEdit"
      :outbounds.sync="outbounds"
      :readonly="readonly"
    />
    <CreateBiddingDocument
      v-if="dialogCreateBiddingDocument"
      :outbound.sync="outbound"
      :dialogAdd.sync="dialogCreateBiddingDocument"
    />
    <v-row justify="center">
      <DeleteOutbound
        v-if="dialogDel"
        :dialogDel.sync="dialogDel"
        :outbound="outbound"
        :outbounds.sync="outbounds"
        :totalItems.sync="serverSideOptions.totalItems"
      />
    </v-row>
    <v-card class="ma-5">
      <v-data-table
        :headers="headers"
        :items="outbounds"
        item-key="id"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        no-data-text="Danh sách hàng xuất rỗng."
        :actions-append="options.page"
        disable-sort
        class="elevation-1"
      >
        <!--  -->
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Danh sách hàng xuất</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" @click="dialogAdd = true">
              Thêm mới
            </v-btn>
          </v-toolbar>
        </template>
        <!--  -->
        <template v-slot:item.status="{ item }">
          <v-chip
            :style="
              item.status == 'CREATED'
                ? 'background-color:orange'
                : item.status == 'BIDDING'
                ? 'background-color:blue'
                : item.status == 'COMBINED'
                ? 'background-color:green'
                : 'background-color:blue'
            "
            dark
            >{{ item.status }}</v-chip
          >
        </template>
        <template v-slot:item.packingTime="{ item }">
          {{ formatDatetime(item.packingTime) }}
        </template>
        <template v-slot:item.cutOffTime="{ item }">
          {{ formatDatetime(item.booking.cutOffTime) }}
        </template>
        <template v-slot:item.grossWeight="{ item }">
          {{ item.grossWeight + "" + item.unitOfMeasurement }}
        </template>
        <template v-slot:item.fcl="{ item }">
          {{ item.booking.isFcl ? "Có" : "Không" }}
        </template>
        <template v-slot:item.unit="{ item }">
          {{ item.booking.unit + " x " + item.containerType }}
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
                @click="openCreateBiddingDocument(item)"
                v-if="item.status == 'CREATED'"
              >
                <v-list-item-icon>
                  <v-icon small>add</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Mở đấu thầu</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="openUpdateDialog(item)"
                v-if="item.status == 'CREATED'"
              >
                <v-list-item-icon>
                  <v-icon small>edit</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Chỉnh sửa</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="openDetailDialog(item)"
                v-if="item.status != 'CREATED'"
              >
                <v-list-item-icon>
                  <v-icon small>details</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xem chi tiết</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="openDeleteDialog(item)"
                v-if="item.status == 'CREATED'"
              >
                <v-list-item-icon>
                  <v-icon small>delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xóa bỏ</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IOutbound } from "@/entity/outbound";
import CreateOutbound from "./components/CreateOutbound.vue";
import UpdateOutbound from "./components/UpdateOutbound.vue";
import DeleteOutbound from "./components/DeleteOutbound.vue";
import { getOutboundByMerchant } from "@/api/outbound";
import Utils from "@/mixin/utils";
import CreateBiddingDocument from "../../supplier/bidding-document/components/CreateBiddingDocument.vue";
import { DataOptions } from "vuetify";

@Component({
  mixins: [Utils],
  components: {
    CreateOutbound,
    UpdateOutbound,
    DeleteOutbound,
    CreateBiddingDocument
  }
})
export default class Outbound extends Vue {
  outbounds: Array<IOutbound> = [];
  outbound = {} as IOutbound;
  dialogAdd = false;
  dialogEdit = false;
  dialogDel = false;
  readonly = false;
  dialogCreateBiddingDocument = false;
  loading = false;
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
    { text: "Booking No.", value: "booking.number" },
    { text: "Hãng tàu", value: "shippingLine" },
    { text: "Số cont", value: "unit" },
    { text: "Khối lượng hàng", value: "grossWeight" },
    { text: "Thời gian đóng hàng", value: "packingTime" },
    { text: "Nơi đóng hàng", value: "packingStation" },
    { text: "Thời gian Cut-off", value: "cutOffTime" },
    { text: "Cảng đóng hàng", value: "booking.portOfLoading" },
    { text: "FCL", value: "fcl" },
    { text: "Trạng thái", value: "status" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  openUpdateDialog(item: IOutbound) {
    this.outbound = item;
    this.readonly = false;
    this.dialogEdit = true;
  }
  openDetailDialog(item: IOutbound) {
    this.outbound = item;
    this.readonly = true;
    this.dialogEdit = true;
  }

  openDeleteDialog(item: IOutbound) {
    this.outbound = item;
    this.dialogDel = true;
  }

  openCreateBiddingDocument(item: IOutbound) {
    this.outbound = item;
    this.dialogCreateBiddingDocument = true;
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getOutboundByMerchant({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _outbounds = _res.data.data;
        this.outbounds = _outbounds;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
