<template>
  <v-content>
    <v-container class="d-flex align-start">
      <v-card
        class="order-0 flex-grow-0 mx-auto mr-5 my-12"
        max-width="300"
        style="margin-left: -150px !important"
      >
        <v-card-title>Tìm kiếm</v-card-title>
        <v-divider inset></v-divider>
        <v-card-text>
          <v-layout col
            ><v-layout row
              ><v-flex xs10>
                <v-text-field
                  v-model="shippingLineSearch"
                  prepend-icon="money"
                  type="text"
                  label="Hãng tàu"
                ></v-text-field> </v-flex></v-layout
          ></v-layout>
          <v-layout col
            ><v-layout row
              ><v-flex xs10>
                <v-select
                  v-model="containerTypeSearch"
                  prepend-icon="strikethrough_s"
                  :items="containerTypes"
                  label="Loại cont"
                ></v-select> </v-flex></v-layout
          ></v-layout>
          <v-row align="center" class="mx-0">
            <div class="grey--text mr-4"></div>
            <v-rating
              :value="4.5"
              color="amber"
              dense
              half-increments
              readonly
              size="14"
            ></v-rating>

            <div class="grey--text ml-4">4.5 (413)</div>
          </v-row>

          <v-list dense>
            <v-subheader>Thong tin HSMT</v-subheader>
            <v-list-item-group color="primary">
              <v-list-item @click="check()">
                <v-list-item-icon>
                  <v-icon>monetization_on</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ "Giá gói thầu: " }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ "Giá sàn: " }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>

          <v-list dense>
            <v-subheader>Thong tin Hàng Xuất</v-subheader>
            <v-list-item-group color="primary">
              <v-list-item>
                <v-list-item-icon>
                  <v-icon>child_friendly</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ "Booking No.: " }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ "Cảng bốc hàng: " }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>directions_boat</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ "Hãng tàu: " }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ "Số lượng: " }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>location_on</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ "Đóng tại: " }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ "Thời gian: " }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-icon>
                  <v-icon>description</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ "Mô tả: " }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ "Khối lượng: " }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-title>Thời gian dự thầu</v-card-title>

        <v-card-text>
          <v-chip-group active-class="deep-purple accent-4 white--text" column>
            <v-chip>Mở thầu: </v-chip>

            <v-chip>Đóng thầu: </v-chip>
          </v-chip-group>
        </v-card-text>
      </v-card>
      <v-card
        class="order-1 flex-grow-1 mx-auto my-12"
        style="margin-right: -160px !important"
      >
        <Snackbar :text="message" :snackbar.sync="snackbar" />
        <v-row justify="center">
          <DeleteBiddingDocument
            v-if="dialogDel"
            :dialogDel.sync="dialogDel"
            :biddingDocument="biddingDocument"
            :biddingDocuments.sync="biddingDocuments"
            :totalItems.sync="options.totalItems"
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
          :totalItems.sync="options.totalItems"
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
        <v-data-table
          :headers="headers"
          :items="biddingDocuments"
          item-key="id"
          :loading="loading"
          :options.sync="options"
          :server-items-length="options.totalItems"
          :footer-props="{
            'items-per-page-options': options.itemsPerPageItems
          }"
          :actions-append="options.page"
          @click:row="clicked"
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
                    <v-list-item-title>Xem trạng thái HSMT</v-list-item-title>
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

@Component({
  mixins: [Utils],
  components: {
    CreateBiddingDocument,
    UpdateBiddingDocument,
    DeleteBiddingDocument,
    CancelBiddingDocument,
    Snackbar
  }
})
export default class BiddingDocument extends Vue {
  biddingDocuments: Array<IBiddingDocument> = [];
  biddingDocument = {} as IBiddingDocument;
  outbounds: Array<IOutbound> = [];
  dialogAdd = false;
  dialogEdit = false;
  dialogCancel = false;
  dialogDel = false;
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
    { text: "Hãng tàu", value: "outbound.shippingLine" },
    { text: "Loại cont", value: "outbound.containerType" },
    { text: "Mã booking", value: "outbound.booking.bookingNumber" },
    { text: "Trạng thái", value: "status" },
    { text: "Giá gói thầu", value: "bidPackagePrice" },
    { text: "Mở thầu", value: "bidOpeningText" },
    { text: "Đóng thầu", value: "bidClosingText" },
    { text: "Nhiều thầu win", value: "isMultipleAward" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  openEditDialog(item: IBiddingDocument) {
    this.biddingDocument = item;
    this.biddingDocument.bidOpening = this.biddingDocument.bidOpening.slice(
      0,
      10
    );
    this.biddingDocument.bidClosing = this.biddingDocument.bidClosing.slice(
      0,
      10
    );
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

  clicked(value: IBiddingDocument) {
    this.$router.push({ path: `/bidding-document/${value.id}` });
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    if (val !== oldVal) {
      getBiddingDocuments({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IBiddingDocument> = res.data;
          console.log("watch", response);
          this.biddingDocuments = response.data;
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
