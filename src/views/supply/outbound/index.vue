<template>
  <v-content>
    <v-card>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <CreateOutbound
        v-if="dialogAdd"
        :dialogAdd.sync="dialogAdd"
        :message.sync="message"
        :snackbar.sync="snackbar"
        :outbounds.sync="outbounds"
      />
      <UpdateOutbound
        v-if="dialogEdit"
        :outbound="outbound"
        :dialogEdit.sync="dialogEdit"
        :message.sync="message"
        :snackbar.sync="snackbar"
        :outbounds.sync="outbounds"
      />
      <CreateBiddingDocument
        v-if="dialogCreateBiddingDocument"
        :biddingDocument.sync="biddingDocument"
        :outbound.sync="outbound"
        :dialogAdd.sync="dialogCreateBiddingDocument"
        :message.sync="message"
        :snackbar.sync="snackbar"
      />
      <v-row justify="center">
        <DeleteOutbound
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :outbound="outbound"
          :outbounds.sync="outbounds"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
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
          <v-menu :close-on-click="true">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="pink" icon outlined v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="openCreateBiddingDocument(item)">
                <v-list-item-icon>
                  <v-icon small>add</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Mở đấu thầu</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="openUpdateDialog(item)">
                <v-list-item-icon>
                  <v-icon small>edit</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Chỉnh sửa</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="openDeleteDialog(item)">
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
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IOutbound } from "@/entity/outbound";
import CreateOutbound from "./components/CreateOutbound.vue";
import UpdateOutbound from "./components/UpdateOutbound.vue";
// import { getOutboundByForwarder } from "@/api/outbound";
// import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";
import DeleteOutbound from "./components/DeleteOutbound.vue";
import { getOutboundByMerchant } from "@/api/outbound";
import { PaginationResponse } from "@/api/payload";
import { IBiddingDocument } from "@/entity/bidding-document";
import Utils from "@/mixin/utils";
import CreateBiddingDocument from "../../supplier/bidding-document/components/CreateBiddingDocument.vue";

@Component({
  mixins: [Utils],
  components: {
    CreateOutbound,
    UpdateOutbound,
    DeleteOutbound,
    CreateBiddingDocument,
    Snackbar
  }
})
export default class Outbound extends Vue {
  biddingDocument = {} as IBiddingDocument;
  outbounds: Array<IOutbound> = [];
  outbound = {} as IOutbound;
  dialogAdd = false;
  dialogEdit = false;
  dialogDel = false;
  dialogCreateBiddingDocument = false;
  search = "";
  message = "";
  snackbar = false;
  loading = true;
  dateInit = new Date().toISOString().substr(0, 10);
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

  created() {
    this.loading = false;
  }

  openUpdateDialog(item: IOutbound) {
    this.outbound = item;
    this.outbound.packingTime = this.outbound.packingTime.slice(0, 10);
    this.outbound.booking.cutOffTime = this.outbound.booking.cutOffTime.slice(
      0,
      10
    );
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

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    console.log(this.$auth.user());
    if (val !== oldVal) {
      getOutboundByMerchant(this.$auth.user().id, {
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IOutbound> = res.data;
          this.outbounds = response.data;
          this.options.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
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
