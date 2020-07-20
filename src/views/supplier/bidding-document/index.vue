<template>
  <v-content>
    <Snackbar :text="message" :snackbar.sync="snackbar" />
    <v-row justify="center">
      <DeleteBiddingDocument
        v-if="dialogDel"
        :dialogDel.sync="dialogDel"
        :biddingDocument="biddingDocument"
        :biddingDocuments.sync="biddingDocuments"
        :totalItems.sync="serverSideOptions.totalItems"
        :message.sync="message"
        :snackbar.sync="snackbar"
      />
    </v-row>
    <v-row justify="center">
      <CancelBiddingDocument
        v-if="dialogCancel"
        :dialogCancel.sync="dialogCancel"
        :biddingDocument="biddingDocument"
        :biddingDocuments.sync="biddingDocuments"
        :message.sync="message"
        :snackbar.sync="snackbar"
      />
    </v-row>
    <CreateBiddingDocument
      v-if="dialogAdd"
      :biddingDocuments.sync="biddingDocuments"
      :outbounds.sync="outbounds"
      :dialogAdd.sync="dialogAdd"
      :totalItems.sync="serverSideOptions.totalItems"
      :message.sync="message"
      :snackbar.sync="snackbar"
    />
    <UpdateBiddingDocument
      v-if="dialogEdit"
      :biddingDocument="biddingDocument"
      :biddingDocuments.sync="biddingDocuments"
      :dialogEdit.sync="dialogEdit"
      :message.sync="message"
      :snackbar.sync="snackbar"
    />
    <v-container
      class="d-flex justify-space-around align-start mb-6 mx-1"
      style="max-width: 1510px!important"
    >
      <v-card class="order-0 flex-grow-0 mx-auto mr-5 my-5" width="260">
        <v-card-title>BỘ LỌC</v-card-title>
        <v-card-subtitle
          >Tùy chỉnh các bộ lọc bên dưới theo kết quả bên phải</v-card-subtitle
        >
        <v-divider></v-divider>
        <v-card-text>
          <v-row
            ><v-col cols="12">
              <v-select
                outlined
                dense
                hide-details
                v-model="shippingLineSearch"
                prepend-icon="directions_boat"
                :items="shippingLinesToString"
                label="Hãng tàu"
              ></v-select> </v-col
          ></v-row>
          <v-row
            ><v-col cols="12">
              <v-select
                outlined
                dense
                hide-details
                v-model="containerTypeSearch"
                prepend-icon="directions_bus"
                :items="containerTypesToString"
                label="Loại cont"
              ></v-select> </v-col
          ></v-row>
          <v-row
            ><v-col cols="12">
              <v-select
                outlined
                dense
                hide-details
                v-model="statusSearch"
                prepend-icon="strikethrough_s"
                :items="status"
                label="Trạng thái"
              ></v-select> </v-col
          ></v-row>
          <v-row justify="center">
            <v-btn class="primary" @click="searchBiddingDocument()"
              >Áp dụng</v-btn
            >
          </v-row>
        </v-card-text>
      </v-card>
      <v-card class="order-1 flex-grow-1 mx-auto my-5">
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
          class="elevation-1"
        >
          <!--  -->
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Danh sách đấu thầu</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
              <v-btn
                color="primary"
                dark
                class="mb-2"
                @click="dialogAdd = true"
              >
                Thêm mới
              </v-btn>
            </v-toolbar>
          </template>
          <!--  -->
          <template v-slot:item.actions="{ item }">
            <v-menu :close-on-click="true">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="pink" icon outlined v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
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
                <v-list-item
                  @click.stop="openEditDialog(item)"
                  v-if="item.status == 'CANCELED'"
                >
                  <v-list-item-icon>
                    <v-icon small>edit</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Mở lại thầu</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item @click.stop="openDetailDialog(item)">
                  <v-list-item-icon>
                    <v-icon small>details</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Chi tiết</v-list-item-title>
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
                    <v-list-item-title>Hủy thầu</v-list-item-title>
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
          <template v-slot:item.bidOpeningText="{ item }">
            {{ formatDatetime(item.bidOpening) }}
          </template>
          <template v-slot:item.bidClosingText="{ item }">
            {{ formatDatetime(item.bidClosing) }}
          </template>
          <template v-slot:item.bidPackagePrice="{ item }">
            {{ currencyFormatter(item.bidPackagePrice) }}
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IBiddingDocument } from "@/entity/bidding-document";
import CreateBiddingDocument from "./components/CreateBiddingDocument.vue";
import UpdateBiddingDocument from "./components/UpdateBiddingDocument.vue";
import Snackbar from "@/components/Snackbar.vue";
import { IOutbound } from "@/entity/outbound";
import { getBiddingDocuments } from "@/api/bidding-document";
import { PaginationResponse } from "@/api/payload";
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
import DatetimePicker from "@/components/DatetimePicker.vue";
import { addTimeToDate } from "@/utils/tool";

@Component({
  mixins: [Utils],
  components: {
    DatetimePicker,
    CreateBiddingDocument,
    UpdateBiddingDocument,
    DeleteBiddingDocument,
    CancelBiddingDocument,
    Snackbar
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
  message = "";
  search = "";
  // API list
  ports: Array<IPort> = [];
  shippingLines: Array<IShippingLine> = [];
  containerTypes: Array<IContainerType> = [];
  status: Array<string> = [];
  snackbar = false;
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
    { text: "Hãng tàu", value: "outbound.shippingLine" },
    { text: "Loại cont", value: "outbound.containerType" },
    { text: "Mã booking", value: "outbound.booking.bookingNumber" },
    { text: "Trạng thái", value: "status" },
    { text: "Giá gói thầu", value: "bidPackagePrice" },
    { text: "Đóng thầu", value: "bidClosingText" },
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
  onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      getBiddingDocuments({
        page: val.page - 1,
        limit: val.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IBiddingDocument> = res.data;
          console.log("watch", response);
          this.biddingDocuments = response.data;
          this.serverSideOptions.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }

  searchBiddingDocument() {
    console.log(1);
  }

  async created() {
    this.status = ["BIDDING", "COMBINED", "CANCELED"];
    // API GET Ports
    const _ports = await getPorts({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IPort> = res.data;
        return response.data;
      })
      .catch(err => console.log(err))
      .finally();
    this.ports = _ports || [];
    // API GET Shipping Line
    const _shippingLines = await getShippingLines({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IShippingLine> = res.data;
        return response.data.filter(x => x.roles[0] == "ROLE_SHIPPINGLINE");
      })
      .catch(err => console.log(err))
      .finally();
    this.shippingLines = _shippingLines || [];
    // API GET Container Type
    const _containerTypes = await getContainerTypes({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IContainerType> = res.data;
        return response.data;
      })
      .catch(err => console.log(err))
      .finally();
    this.containerTypes = _containerTypes || [];
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
