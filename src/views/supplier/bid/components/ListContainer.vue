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
                  :headers="containerHeaders"
                  :items="containers"
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
                    <v-btn
                      class="ma-1"
                      tile
                      outlined
                      color="success"
                      @click.stop="createContainerBid(item)"
                      small
                      v-if="
                        action == 'ADD' &&
                          containersSelected.findIndex(
                            x => x.containerNumber == item.containerNumber
                          ) == -1
                      "
                    >
                      <v-icon left>add</v-icon> Thêm Cont
                    </v-btn>
                    <v-btn
                      class="ma-1"
                      tile
                      outlined
                      color="primary"
                      @click.stop="changeContainerBid(item)"
                      small
                      v-if="action == 'CHANGE'"
                    >
                      <v-icon left>add</v-icon> Đổi Cont
                    </v-btn>
                  </template>
                </v-data-table>
              </td>
            </template>
          </v-data-table>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialogContainerSync = false">Hủy</v-btn>
        <v-btn @click="dialogContainerSync = false" color="primary"
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
import { getContainersByInbound } from "@/api/container";
import { getInboundsByOutboundAndForwarder } from "@/api/inbound";
import { IContainer } from "@/entity/container";
import { PaginationResponse } from "@/api/payload";
import { IInbound } from "@/entity/inbound";
import { IOutbound } from "@/entity/outbound";
import { DataOptions } from "vuetify";
import Utils from "@/mixin/utils";
import { addContainer, replaceContainer } from "@/api/bid";
import { IBid } from "@/entity/bid";

@Component({
  mixins: [Utils]
})
export default class ListContainer extends Vue {
  @PropSync("dialogContainer", { type: Boolean }) dialogContainerSync!: boolean;
  @Prop(Object) biddingDocumentSelected!: IBiddingDocument;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @PropSync("containersSelected", { type: Array })
  containersSelectedSync!: Array<IContainer>;
  @Prop(String) action!: string;
  @Prop(Object) container!: IContainer;
  @Prop(Object) bid!: IBid;
  expanded: Array<IInbound> = [];
  singleExpand = true;
  inbounds: Array<IInbound> = [];
  containers: Array<IContainer> = [];
  inbound = null as IInbound | null;
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
    { text: "B/L No.", value: "billOfLading.number" },
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
    { text: "Hành động", value: "actions", class: "elevation-1 primary" }
  ];

  async clicked(value: IInbound) {
    console.log("value", value);
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded.splice(0, this.expanded.length);
        this.containers = [] as Array<IContainer>;
      } else {
        console.log(0);
        if (this.expanded.length > 0) {
          this.expanded.splice(0, this.expanded.length);
          this.expanded.push(value);
          this.containers = [] as Array<IContainer>;
          this.inbound = value;
          this.onOptionsChange(this.options);
        } else {
          this.expanded.push(value);
          this.inbound = value;
        }
      }
    }
  }
  async createContainerBid(item: IContainer) {
    if (this.bid.id && item.id) {
      console.log(0);
      const _bid = await addContainer(this.bid.id, item.id)
        .then(res => {
          console.log(1);
          const response: IBid = res.data;
          snackbar.setSnackbar({
            text:
              "Thêm mới thành công Container " +
              item.containerNumber +
              " cho HSDT " +
              response.id,
            color: "success"
          });
          console.log(2);
          return response;
        })
        .catch(err => {
          console.log(3);
          console.log(err);
          snackbar.setSnackbar({
            text: getErrorMessage(err),
            color: "error"
          });
          return null;
        });
      if (_bid) {
        console.log(4);
        this.containersSelectedSync.unshift(item);
        this.totalItemsSync += 1;
      }
      snackbar.setDisplay(true);
    }
  }

  async changeContainerBid(item: IContainer) {
    if (this.bid.id && item.id) {
      const _bid = await replaceContainer(this.bid.id, {
        oldContainerId: this.container.id,
        newContainerId: item.id
      })
        .then(res => {
          const response: IBid = res.data;
          snackbar.setSnackbar({
            text:
              "Đổi thành công Container " +
              this.container.containerNumber +
              " thành Container " +
              item.containerNumber +
              " cho HSDT " +
              response.id,
            color: "success"
          });
          return response;
        })
        .catch(err => {
          console.log(err);
          snackbar.setSnackbar({
            text: getErrorMessage(err),
            color: "error"
          });
          return null;
        });
      if (_bid) {
        console.log(_bid);
        const index = this.containersSelectedSync.findIndex(
          x => x.containerNumber == this.container.containerNumber
        );
        this.containersSelectedSync.splice(index, 1, item);
        snackbar.setDisplay(true);
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
          this.containers = _containers.data.filter(
            (x: IContainer) => x.status == "CREATED"
          );
          this.serverSideOptions.totalItems = this.containers.length;
        }
      }
      this.loading = false;
    }
  }
}
</script>
