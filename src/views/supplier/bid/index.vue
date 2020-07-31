<template>
  <v-content>
    <v-card class="ma-5">
      <CreateBid
        v-if="dialogAdd"
        :bid.sync="bid"
        :biddingDocument.sync="biddingDocument"
        :bids.sync="bids"
        :dialogAdd.sync="dialogAdd"
        :totalItems.sync="serverSideOptions.totalItems"
      />
      <UpdateBid
        v-if="dialogEdit"
        :bid="bid"
        :bids.sync="bids"
        :biddingDocument.sync="biddingDocument"
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
        <template v-slot:item.bidOpeningText="{ item }">
          {{ formatDatetime(item.bidOpening) }}
        </template>
        <template v-slot:item.bidClosingText="{ item }">
          {{ formatDatetime(item.bidClosing) }}
        </template>

        <template v-slot:item.bidPackagePrice="{ item }">
          {{ currencyFormatter(item.bidPackagePrice) }}
        </template>
        <!-- Show Bids expened -->
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length" class="px-0">
            <v-data-table
              :headers="bidHeaders"
              :items="bids"
              :hide-default-footer="true"
              disable-sort
              dense
              dark
            >
              <template v-slot:item.bidDateText="{ item }">
                {{ formatDatetime(item.bidDate) }}
              </template>
              <template v-slot:item.bidValidityPeriodText="{ item }">
                {{ formatDatetime(item.bidValidityPeriod) }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="openEditDialog(item)"
                  v-if="item.status == 'PENDING'"
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                  small
                  @click="openCancelDialog(item)"
                  v-if="item.status == 'PENDING'"
                >
                  close
                </v-icon>
                <v-chip
                  v-if="item.status != 'PENDING'"
                  :style="
                    item.status == 'ACCEPTED'
                      ? 'background-color:green'
                      : item.status == 'REJECTED'
                      ? 'background-color:red'
                      : item.status == 'EXPIRED'
                      ? 'background-color:cadetblue'
                      : 'background-color:darkgoldenrod'
                  "
                  dark
                  >{{ item.status }}</v-chip
                >
              </template>
              <template v-slot:item.bidPrice="{ item }">
                {{ currencyFormatter(item.bidPrice) }}
              </template>
            </v-data-table>
          </td>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IBid } from "@/entity/bid";
import { IBiddingDocument } from "@/entity/bidding-document";
import CreateBid from "./components/CreateBid.vue";
import { getBiddingDocuments } from "@/api/bidding-document";
import { PaginationResponse } from "@/api/payload";
import { getBidByBiddingDocumentAndForwarder } from "@/api/bid";
import Utils from "@/mixin/utils";
import UpdateBid from "./components/UpdateBid.vue";
import CancelBid from "./components/CancelBid.vue";
import { DataOptions } from "vuetify";
import snackbar from "@/store/modules/snackbar";
import { getErrorMessage } from "@/utils/tool";

@Component({
  mixins: [Utils],
  components: {
    CreateBid,
    UpdateBid,
    CancelBid
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
    { text: "Mã booking", value: "outbound.booking.number" },
    { text: "Giá gói thầu", value: "bidPackagePrice" },
    { text: "Mở thầu", value: "bidOpeningText" },
    { text: "Đóng thầu", value: "bidClosingText" },
    { text: "Nhiều thầu win", value: "isMultipleAward" }
  ];

  bidHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id",
      class: "elevation-1 primary"
    },
    {
      text: "Cont qty",
      value: "containers.length",
      class: "elevation-1 primary"
    },
    { text: "Giá thầu", value: "bidPrice", class: "elevation-1 primary" },
    { text: "Ngày thầu", value: "bidDateText", class: "elevation-1 primary" },
    {
      text: "Hiệu lực",
      value: "bidValidityPeriodText",
      class: "elevation-1 primary"
    },
    {
      text: "",
      value: "actions",
      sortable: false,
      class: "elevation-1 primary"
    }
  ];
  async getBids(item: IBiddingDocument) {
    this.loading = true;
    if (item.id) {
      const _bid = await getBidByBiddingDocumentAndForwarder(item.id)
        .then(res => {
          const response = res.data;
          console.log(response);
          return response;
        })
        .catch(err => {
          console.log(err);
          snackbar.setSnackbar({
            text: getErrorMessage(err),
            color: "error"
          });
          snackbar.setDisplay(true);
          return null;
        });
      if (_bid) {
        if (this.bids.length == 0) {
          this.bids.push(_bid);
        } else {
          this.bids.splice(0, 1, _bid);
        }
      }
    }
    this.loading = false;
    return this.bids;
  }
  clicked(value: IBiddingDocument) {
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded.splice(0, this.expanded.length);
        this.biddingDocument = {} as IBiddingDocument;
      } else {
        this.expanded.splice(0, this.expanded.length);
        this.getBids(value);
        this.expanded.push(value);
        this.biddingDocument = value;
      }
    }
  }

  openCreateDialog() {
    this.biddingDocument = {} as IBiddingDocument;
    this.dialogAdd = true;
  }

  openEditDialog(item: IBid) {
    if (new Date().getTime() - new Date(item.bidValidityPeriod).getTime() > 0) {
      this.bid = item;
      this.dialogEdit = true;
    } else {
      snackbar.setSnackbar({
        text: "Không thể sửa khi chưa vượt quá thời gian Validity Period",
        color: "error"
      });
      snackbar.setDisplay(true);
    }
  }

  openCancelDialog(item: IBid) {
    if (new Date().getTime() - new Date(item.bidValidityPeriod).getTime() > 0) {
      this.bid = item;
      this.dialogCancel = true;
    } else {
      snackbar.setSnackbar({
        text: "Không thể sửa khi chưa vượt quá thời gian Validity Period",
        color: "error"
      });
      snackbar.setDisplay(true);
    }
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _biddingDocuments = await getBiddingDocuments({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IBiddingDocument> = res.data;
          console.log("watch", response.data);
          return response;
        })
        .catch(err => {
          console.log(err);
          snackbar.setSnackbar({
            text: getErrorMessage(err),
            color: "error"
          });
          snackbar.setDisplay(true);
          return null;
        });
      if (_biddingDocuments) {
        this.biddingDocuments = _biddingDocuments.data;
        this.serverSideOptions.totalItems = _biddingDocuments.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
