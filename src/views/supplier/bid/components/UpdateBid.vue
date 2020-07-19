<template>
  <v-dialog
    v-model="dialogEditSync"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogEditSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Chỉnh sửa HSDT</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialogEditSync = false">Trở về</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-list three-line subheader>
        <v-stepper v-model="stepper" vertical>
          <v-stepper-step :complete="stepper > 1" step="1" :editable="editable">
            Thông tin HSDT
            <small>Thông tin chung</small>
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-form ref="bidForm" v-model="valid" lazy-validation>
              <v-text-field
                v-model="bidLocal.bidPrice"
                :hint="currencyFormatter(bidLocal.bidPrice)"
                prepend-icon="monetization_on"
                type="number"
                :rules="[
                  minNumber('bid price', biddingDocumentSync.bidFloorPrice + 1)
                ]"
                label="Giá gửi thầu"
              ></v-text-field>
              <!-- <v-text-field
                label="Label Text"
                value="12:30:00"
                type="time"
                suffix="PST"
              ></v-text-field> -->
              <v-btn
                color="primary"
                @click="
                  updateBid();
                  valid = false;
                "
                :disabled="!valid"
                >Lưu và Tiếp tục</v-btn
              >
            </v-form>
          </v-stepper-content>
        </v-stepper>
      </v-list>
      <!-- END CONTENT -->
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IBid } from "@/entity/bid";
import FormValidate from "@/mixin/form-validate";
import { updateBid } from "@/api/bid";
import { IBiddingDocument } from "@/entity/bidding-document";
import { IInbound } from "@/entity/inbound";
import { IContainer } from "@/entity/container";
import { getInboundsByOutboundAndForwarder } from "@/api/inbound";
import { PaginationResponse } from "@/api/payload";
import { IOutbound } from "@/entity/outbound";
import Utils from "@/mixin/utils";
import { addTimeToDate, getErrorMessage } from "@/utils/tool";

@Component({
  mixins: [FormValidate, Utils]
})
export default class UpdateBid extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @Prop(Object) bid!: IBid;
  @PropSync("bids", { type: Array }) bidsSync!: Array<IBid>;
  @PropSync("biddingDocument", { type: Object })
  biddingDocumentSync!: IBiddingDocument;

  dateInit = addTimeToDate(new Date().toString());
  // Form validate
  checkbox = false;
  editable = true;
  expanded: Array<IInbound> = [];
  singleExpand = true;
  loading = true;
  options = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  inboundHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    { text: "Hãng tàu", value: "shippingLine" },
    { text: "Loại cont", value: "containerType" },
    { text: "Trạng thái", value: "status" },
    { text: "Time lấy cont", value: "pickUpTime" },
    { text: "B/L No.", value: "billOfLading.billOfLadingNumber" },
    { text: "Cảng lấy cont", value: "billOfLading.portOfDelivery" },
    { text: "Số lượng cont", value: "billOfLading.containers.length" }
  ];
  containerHeaders = [
    {
      text: "Container No.",
      align: "start",
      sortable: false,
      value: "containerNumber"
    },
    { text: "Biển kiểm sát", value: "licensePlate" },
    { text: "Tài xế", value: "driver" },
    { text: "Rơ mọt", value: "trailer" },
    { text: "Đầu kéo", value: "tractor" },
    { text: "Hành động", value: "actions" }
  ];
  stepper = 1;
  valid = true;
  bidLocal = {} as IBid;
  inbounds = [] as Array<IInbound>;
  containers = [] as Array<IContainer>;
  created() {
    this.bidLocal = Object.assign({}, this.bid);
    this.containers = this.bidLocal.containers as IContainer[];
    this.bidLocal.bidDate = this.dateInit;
    console.log(this.biddingDocumentSync);
    if (this.biddingDocumentSync && this.biddingDocumentSync.outbound) {
      const _outbound = this.biddingDocumentSync.outbound as IOutbound;
      const _outboundId = _outbound.id as number;
      getInboundsByOutboundAndForwarder(_outboundId, {
        page: 0,
        limit: 100
      })
        .then(res => {
          const response: PaginationResponse<IInbound> = res.data;
          this.inbounds = response.data;
          this.options.totalItems = response.totalElements;
          console.log(this.inbounds);
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
  // Bid Update
  updateBid() {
    if (this.bidLocal.id) {
      this.bidLocal.containers = this.containers.reduce(function(
        pV: Array<number>,
        cV: IContainer
      ) {
        if (cV.id) {
          pV.push(cV.id);
        }
        return pV;
      },
      []);
      updateBid(this.bidLocal)
        .then(res => {
          console.log(res.data);
          const response: IBid = res.data;
          this.messageSync = "Cập nhập thành công HSDT: " + response.id;
          const index = this.bidsSync.findIndex(x => x.id == response.id);
          this.bidsSync.splice(index, 1, response);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = getErrorMessage(err);
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  clicked(value: IInbound) {
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded.splice(0, this.expanded.length);
      } else {
        this.expanded.splice(0, this.expanded.length);
        this.expanded.push(value);
      }
    } else {
      const index = this.expanded.findIndex(x => x.id === value.id);
      if (index === -1) {
        this.expanded.push(value);
      } else {
        this.expanded.splice(index, 1);
      }
    }
  }
  checkDuplicateSelect(item: IContainer) {
    return this.containers.filter(x => x.id == item.id).length > 0
      ? true
      : false;
  }
}
</script>
