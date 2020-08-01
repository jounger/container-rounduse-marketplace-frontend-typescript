<template>
  <v-dialog v-model="dialogContainerSync">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;"
            >Danh sách Container</span
          ></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-container fluid>
          <v-data-table
            :headers="inboundHeaders"
            :items="inbounds"
            :single-expand="true"
            :expanded.sync="expanded"
            show-expand
            @click:row="clicked"
            item-key="id"
            :loading="loading"
            :options.sync="inboundOptions"
            :server-items-length="inboundServerSideOptions.totalItems"
            :footer-props="{
              'items-per-page-options':
                inboundServerSideOptions.itemsPerPageItems
            }"
            :actions-append="inboundOptions.page"
            disable-sort
            class="elevation-1 my-1"
          >
            <template v-slot:item.pickUpTime="{ item }">
              {{ formatDatetime(item.pickupTime) }}
            </template>
            <!-- Show containers expened -->
            <template v-slot:expanded-item="{ headers }">
              <td :colspan="headers.length" class="px-0">
                <v-data-table
                  v-model="containers"
                  :headers="containerHeaders"
                  :items="inbound.billOfLading.containers"
                  item-key="id"
                  :loading="loading"
                  :options.sync="options"
                  :server-items-length="serverSideOptions.totalItems"
                  :footer-props="{
                    'items-per-page-options':
                      serverSideOptions.itemsPerPageItems
                  }"
                  :actions-append="options.page"
                  disable-sort
                  dark
                  dense
                >
                  <template v-slot:item.actions="{ item }">
                    <v-checkbox
                      v-model="containers"
                      :value="item"
                      @change="changeContainerServerSideOptions(item)"
                      :disabled="
                        containers.length == unit &&
                          containers.findIndex(
                            x => x.containerNumber == item.containerNumber
                          ) == -1
                      "
                      style="margin:0px;padding:0px"
                      hide-details
                    ></v-checkbox>
                  </template>
                </v-data-table>
              </td>
            </template>
          </v-data-table>
        </v-container>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogContainerSync = false">Hủy</v-btn>
        <v-btn @click="dialogContainerSync = false" color="error"
          >Hoàn tất</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop, Watch } from "vue-property-decorator";
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";
import { IBiddingDocument } from "@/entity/bidding-document";
import { IBiddingNotification } from "@/entity/notification";
import { editBiddingNotifications } from "@/api/notification";
import { getContainersByInbound } from "../../../../api/container";
import { getInboundsByOutboundAndForwarder } from "../../../../api/inbound";
import { IContainer } from "../../../../entity/container";
import { PaginationResponse } from "../../../../api/payload";
import { IInbound } from "../../../../entity/inbound";
import { IOutbound } from "../../../../entity/outbound";
import { DataOptions } from "vuetify";
import { IBillOfLading } from "../../../../entity/bill-of-lading";

@Component
export default class ListContainer extends Vue {
  @PropSync("dialogContainer", { type: Boolean }) dialogContainerSync!: boolean;
  @Prop(Object) biddingDocumentSelected!: IBiddingDocument;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) biddingDocument!: IBiddingDocument;
  @Prop(Object) biddingNotification!: IBiddingNotification;
  expanded: Array<IInbound> = [];
  singleExpand = true;
  inbounds: Array<IInbound> = [];
  unit = 0;
  inbound = {
    emptyTime: "",
    pickupTime: "",
    billOfLading: {
      billOfLadingNumber: "",
      unit: 0,
      containers: [] as Array<IContainer>,
      portOfDelivery: "",
      freeTime: ""
    } as IBillOfLading,
    returnStation: ""
  } as IInbound;
  loading = true;
  options = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  inboundOptions = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  inboundServerSideOptions = {
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
    { text: "Time lấy cont", value: "pickUpTime" },
    { text: "B/L No.", value: "billOfLading.billOfLadingNumber" },
    { text: "Cảng lấy cont", value: "billOfLading.portOfDelivery" },
    { text: "Số lượng cont đăng ký", value: "billOfLading.unit" }
  ];
  // Container form
  containerHeaders = [
    {
      text: "Container No.",
      align: "start",
      sortable: false,
      value: "containerNumber",
      class: "elevation-1 primary"
    },
    { text: "Tài xế", value: "driver", class: "elevation-1 primary" },
    {
      text: "Rơ mọt",
      value: "trailer.licensePlate",
      class: "elevation-1 primary"
    },
    {
      text: "Đầu kéo",
      value: "tractor.licensePlate",
      class: "elevation-1 primary"
    },
    { text: "Chọn Cont", value: "actions", class: "elevation-1 primary" }
  ];

  async clicked(value: IInbound) {
    console.log("value", value);
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded.splice(0, this.expanded.length);
        this.inbound.billOfLading.containers = [] as Array<IContainer>;
      } else {
        console.log(0);
        if (this.expanded.length > 0) {
          this.expanded.splice(0, this.expanded.length);
          this.expanded.push(value);
          this.inbound = value;
          this.onOptionsChange(this.options);
        } else {
          this.expanded.push(value);
          this.inbound = value;
        }
      }
    }
  }
  @Watch("inboundOptions")
  async onInboundOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      console.log(1);
      this.loading = true;
      if (
        this.biddingDocumentSelected &&
        this.biddingDocumentSelected.outbound
      ) {
        const _outbound = this.biddingDocumentSelected.outbound as IOutbound;
        this.unit = _outbound.booking.unit;
        const _outboundId = _outbound.id as number;
        const _inbounds = await getInboundsByOutboundAndForwarder(_outboundId, {
          page: val.page - 1,
          limit: val.itemsPerPage
        })
          .then(res => {
            const response: PaginationResponse<IInbound> = res.data;
            return response;
          })
          .catch(err => {
            console.log(err);
            return null;
          });
        this.loading = false;
        if (_inbounds) {
          this.inbounds = _inbounds.data;
          this.inboundServerSideOptions.totalItems = _inbounds.totalElements;
        }
      }
    }
  }
  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      if (this.inbound && this.inbound.id) {
        const _containers = await getContainersByInbound(this.inbound.id, {
          page: val.page - 1,
          limit: val.itemsPerPage
        })
          .then(res => {
            const response: PaginationResponse<IContainer> = res.data;
            return response;
          })
          .catch(err => {
            console.log(err);
            return null;
          });
        if (_containers) {
          this.serverSideOptions.totalItems = _containers.totalElements;
          this.inbound.billOfLading.containers = _containers.data;
        }
      }
      this.loading = false;
    }
  }
}
</script>
