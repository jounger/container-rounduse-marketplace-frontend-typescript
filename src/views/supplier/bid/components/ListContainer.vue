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
        <v-tabs background-color="white" color="deep-purple accent-4" left>
          <v-tab>Danh sách Inbound</v-tab>
          <v-tab
            >Danh sách Containers đã chọn ({{
              selectedContainers.length
            }})</v-tab
          >

          <v-tab-item>
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
                no-data-text="Danh sách hàng nhập rỗng."
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
                      no-data-text="Danh sách Container khả dụng rỗng."
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
                        <v-switch
                          v-if="action == 'ADD'"
                          v-model="selectedContainers"
                          :value="item"
                          @change="changeContainerServerSideOptions(item)"
                          :loading="loading"
                          light
                        ></v-switch>
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
          </v-tab-item>
          <v-tab-item>
            <v-container fluid>
              <v-data-table
                :headers="containerSelectedHeaders"
                :items="selectedContainersList"
                item-key="id"
                :loading="loading"
                :options.sync="containerOptions"
                :server-items-length="containerServerSideOptions.totalItems"
                :footer-props="{
                  'items-per-page-options':
                    containerServerSideOptions.itemsPerPageItems
                }"
                :actions-append="containerOptions.page"
                disable-sort
              >
                <template v-slot:item.actions="{ item }">
                  <v-switch
                    v-model="selectedContainers"
                    :value="item"
                    :loading="loading"
                    @change="
                      changeContainerServerSideOptions(item);
                      onContainerOptionsChange(containerOptions);
                    "
                  ></v-switch>
                </template>
              </v-data-table>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialogContainerSync = false">Hủy</v-btn>
        <v-btn
          @click="dialogContainerSync = false"
          color="primary"
          v-if="action == 'ADD'"
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
import { addContainer, replaceContainer, removeContainer } from "@/api/bid";
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
  @PropSync("listContainersSelected", { type: Array })
  listContainersSelectedSync!: Array<IContainer>;
  @Prop(String) action!: string;
  @Prop(Object) container!: IContainer;
  @Prop(Object) bid!: IBid;
  expanded: Array<IInbound> = [];
  singleExpand = true;
  unit = 0;
  selectedNumber = 0;
  inbounds: Array<IInbound> = [];
  containers: Array<IContainer> = [];
  selectedContainers: Array<IContainer> = [];
  selectedContainersList: Array<IContainer> = [];
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
  containerOptions = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  containerServerSideOptions = {
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
  containerSelectedHeaders = [
    {
      text: "Container No.",
      align: "start",
      sortable: false,
      value: "containerNumber"
    },
    { text: "Tài xế", value: "driver" },
    {
      text: "Rơ mọt",
      value: "trailer.licensePlate"
    },
    {
      text: "Đầu kéo",
      value: "tractor.licensePlate"
    },
    { text: "Chọn Cont", value: "actions" }
  ];
  created() {
    this.selectedContainers = this.listContainersSelectedSync;
    this.selectedNumber = this.listContainersSelectedSync.length;
    this.containerServerSideOptions.totalItems = this.listContainersSelectedSync.length;
  }
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
          this.containers = [] as Array<IContainer>;
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
  async changeContainerServerSideOptions(item: IContainer) {
    if (this.selectedContainers.length > this.selectedNumber) {
      let check = false;
      console.log(this.selectedContainers);
      console.log(item);
      this.selectedContainers.forEach((x: IContainer) => {
        if (x === item) {
          check = true;
        }
      });
      if (check === false) {
        await this.removeContainer(item);
      } else {
        await this.createContainerBid(item);
      }
    } else {
      await this.removeContainer(item);
    }
    this.onContainerOptionsChange(this.containerOptions);
  }
  async createContainerBid(item: IContainer) {
    this.loading = true;
    if (this.bid.id && item.id) {
      const _bid = await addContainer(this.bid.id, item.id)
        .then(res => {
          const response: IBid = res.data;
          console.log("bid", response);
          snackbar.setSnackbar({
            text:
              "Thêm mới thành công Container " +
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
        const _containers: Array<IContainer> = _bid.containers as Array<
          IContainer
        >;
        _containers.forEach((x: IContainer) => {
          if (x.containerNumber == item.containerNumber) {
            this.containersSelectedSync.unshift(x);
            this.listContainersSelectedSync.unshift(x);
          }
        });
        this.selectedContainers.forEach((x: IContainer) => {
          if (x.containerNumber == item.containerNumber) {
            x.status = "BIDDING";
          }
        });
        this.containers.forEach((x: IContainer) => {
          if (x.containerNumber == item.containerNumber) {
            x.status = "BIDDING";
          }
        });
        this.containerServerSideOptions.totalItems += 1;
        this.totalItemsSync += 1;
      } else {
        const index = this.selectedContainers.findIndex(
          x => x.containerNumber == item.containerNumber
        );
        this.selectedContainers.splice(index, 1);
      }
      snackbar.setDisplay(true);
    }
    this.loading = false;
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
        const _containers: Array<IContainer> = _bid.containers as Array<
          IContainer
        >;
        const index = this.containersSelectedSync.findIndex(
          x => x.containerNumber == this.container.containerNumber
        );
        const indexList = this.listContainersSelectedSync.findIndex(
          x => x.containerNumber == this.container.containerNumber
        );
        _containers.forEach((x: IContainer) => {
          if (x.containerNumber == item.containerNumber) {
            this.containersSelectedSync.splice(index, 1, x);
            this.listContainersSelectedSync.splice(indexList, 1, x);
          }
        });
        this.dialogContainerSync = false;
      }
      snackbar.setDisplay(true);
    }
  }
  async removeContainer(item: IContainer) {
    this.loading = true;
    if (item.id && this.bid.id) {
      const _bid = await removeContainer(this.bid.id, item.id)
        .then(res => {
          const response: IBid = res.data;
          snackbar.setSnackbar({
            text:
              "Xóa thành công Container " +
              item.containerNumber +
              " khỏi HSDT " +
              this.bid.id,
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
      snackbar.setDisplay(true);
      if (_bid) {
        const index = this.containersSelectedSync.findIndex(
          x => x.containerNumber == item.containerNumber
        );
        this.containersSelectedSync.splice(index, 1);
        const indexList = this.listContainersSelectedSync.findIndex(
          x => x.containerNumber == item.containerNumber
        );
        this.listContainersSelectedSync.splice(indexList, 1);
        this.totalItemsSync -= 1;
        this.containerServerSideOptions.totalItems -= 1;
      } else {
        this.selectedContainers.push(item);
      }
    }
    this.loading = false;
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
      this.containers = [] as Array<IContainer>;
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
          _containers.data.forEach((x: IContainer) => {
            if (x.status == "CREATED") {
              this.containers.push(x);
            } else {
              this.selectedContainers.forEach((item: IContainer) => {
                if (
                  item.containerNumber &&
                  item.containerNumber == x.containerNumber
                ) {
                  this.containers.push(x);
                }
              });
            }
          });
          console.log(this.containers);
          console.log(this.selectedContainers);
          console.log(this.selectedContainers[0] === this.containers[0]);
          this.serverSideOptions.totalItems = this.containers.length;
        }
      }
      this.loading = false;
    }
  }
  @Watch("containerOptions")
  async onContainerOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.selectedContainersList = [] as Array<IContainer>;
      this.loading = true;
      const start = (val.page - 1) * val.itemsPerPage;
      let end = start + val.itemsPerPage - 1;
      if (end > this.selectedContainers.length - 1) {
        end = this.selectedContainers.length - 1;
      }
      for (let i = start; i <= end; i++) {
        this.selectedContainersList.push(this.selectedContainers[i]);
      }

      this.loading = false;
    }
  }
}
</script>