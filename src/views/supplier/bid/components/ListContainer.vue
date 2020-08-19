<template>
  <v-dialog v-model="dialogContainerSync">
    <v-card>
      <v-card-title class="headline">Danh sách Container</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-tabs background-color="white" color="deep-purple accent-4" left>
          <v-tab>Danh sách Inbound</v-tab>
          <v-tab v-if="action == 'ADD'"
            >Danh sách Containers đã chọn ({{
              containersSelected.length
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
                class="elevation-0 mb-1"
              >
                <template v-slot:item.pickUpTime="{ item }">
                  {{ formatDatetime(item.pickupTime) }}
                </template>
                <!-- Show containerList expened -->
                <template v-slot:expanded-item="{ headers }">
                  <td :colspan="headers.length" class="px-0">
                    <v-data-table
                      :headers="containerHeaders"
                      :items="containerList"
                      item-key="id"
                      :loading="loading"
                      :options.sync="containerOptions"
                      :server-items-length="
                        containerServerSideOptions.totalItems
                      "
                      :footer-props="{
                        'items-per-page-options':
                          containerServerSideOptions.itemsPerPageItems
                      }"
                      :actions-append="containerOptions.page"
                      no-data-text="Danh sách Container khả dụng rỗng."
                      v-model="containersSelected"
                      :show-select="action == 'ADD'"
                      @item-selected="selectContainer"
                      dense
                    >
                      <template v-slot:header.data-table-select> </template>
                      <template v-slot:item.actions="{ item }">
                        <v-btn
                          v-if="action == 'CHANGE' && container.id != item.id"
                          outlined
                          color="warning"
                          @click.stop="changeContainerBid(item)"
                          dark
                          x-small
                        >
                          <v-icon left dense>add</v-icon> Đổi Cont
                        </v-btn>
                      </template>
                    </v-data-table>
                  </td>
                </template>
              </v-data-table>
            </v-container>
          </v-tab-item>
          <v-tab-item v-if="action == 'ADD'">
            <v-container fluid>
              <v-data-table
                :headers="containerSelectedHeaders"
                :items="containersSelected"
                item-key="id"
                hide-default-footer
                no-data-text="Danh sách Container đã chọn rỗng."
                disable-sort
                v-model="containersSelected"
                show-select
                single-select
              >
              </v-data-table>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogContainerSync = false">Trở về</v-btn>
        <v-btn
          @click="addContainersBid()"
          color="primary"
          v-if="action == 'ADD'"
          >Thêm containers và Hoàn tất</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop, Watch } from "vue-property-decorator";
import { getContainersByInbound } from "@/api/container";
import { getInboundsByOutboundAndForwarder } from "@/api/inbound";
import { IContainer } from "@/entity/container";
import { IInbound } from "@/entity/inbound";
import { IOutbound } from "@/entity/outbound";
import { DataOptions } from "vuetify";
import Utils from "@/mixin/utils";
import { addContainers, replaceContainer, removeContainer } from "@/api/bid";
import { IBid } from "@/entity/bid";

@Component({
  mixins: [Utils]
})
export default class ListContainer extends Vue {
  @PropSync("dialogContainer", { type: Boolean }) dialogContainerSync!: boolean;
  @Prop(Object) outbound!: IOutbound;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @PropSync("containers", { type: Array }) containersSync!: IContainer[];
  @Prop(String) action!: string;
  @Prop(Object) container!: IContainer;
  @Prop(Object) bid!: IBid;

  expanded: Array<IInbound> = [];
  singleExpand = true;
  unit = 0;
  selectedNumber = 0;
  inbounds: Array<IInbound> = [];
  containerList: Array<IContainer> = [];
  containersSelected: Array<IContainer> = [];
  inbound = null as IInbound | null;
  loading = true;
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
    { text: "B/L No.", value: "billOfLading.number" },
    { text: "Hãng tàu", value: "shippingLine.companyName" },
    { text: "Loại cont", value: "containerType.name" },
    { text: "Thời gian lấy cont", value: "pickUpTime" },
    { text: "Cảng lấy cont", value: "billOfLading.portOfDelivery.fullname" },
    { text: "Số cont đăng ký", value: "billOfLading.unit" }
  ];
  // Container form
  containerHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id",
      class: "tertiary"
    },
    {
      text: "Container No.",
      value: "number",
      class: "tertiary"
    },
    { text: "Tài xế", value: "driver.fullname", class: "tertiary" },
    {
      text: "Rơ mọt",
      value: "trailer.licensePlate",
      class: "tertiary"
    },
    {
      text: "Đầu kéo",
      value: "tractor.licensePlate",
      class: "tertiary"
    },
    { text: "Trạng thái", value: "status", class: "tertiary" },
    { text: "Hành động", value: "actions", class: "tertiary" }
  ];
  containerSelectedHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    {
      text: "Container No.",
      value: "number"
    },
    { text: "Tài xế", value: "driver.fullname" },
    {
      text: "Rơ mọt",
      value: "trailer.licensePlate"
    },
    {
      text: "Đầu kéo",
      value: "tractor.licensePlate"
    }
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectContainer(select: any) {
    select.item.isSelected = select.value;
    if (this.bid && select.item.status == "CREATED") {
      const _container = this.bid.containers as IContainer[];
      const index = _container.findIndex(
        (x: IContainer) => x.id === select.item.id
      );
      if (select.value == false && index != -1) {
        this.bid.containers.splice(index, 1);
      } else if (select.value && index == -1) {
        this.bid.containers.push(select.item);
      } else if (select.value && index != -1) {
        this.bid.containers.splice(index, 1, select.item);
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // selectAllContainer(select: any) {
  //   const _items = select.items as IContainer[];
  //   _items.forEach(x => (x.isSelected = select.value));
  //   if (this.bid) {
  //     this.bid.containers.splice(0, this.bid.containers.length, ..._items);
  //   }
  // }

  async changeContainerBid(item: IContainer) {
    if (this.bid) {
      const _res = await replaceContainer(this.bid.id as number, {
        oldContainerId: this.container.id,
        newContainerId: item.id
      });
      if (_res.data) {
        const index = this.containersSync.findIndex(x => x.id === item.id);
        this.containersSync.splice(index, 1, {
          ...item,
          status: "BIDDING"
        });
        this.dialogContainerSync = false;
      }
    }
  }

  async addContainersBid() {
    if (this.bid) {
      const _containers = this.bid.containers as IContainer[];
      const _containersId = _containers.map(x => x.id) as number[];
      const _res = await addContainers(this.bid.id as number, {
        containers: _containersId
      });
      if (_res.data) {
        _containers.forEach((x: IContainer) => this.containersSync.unshift(x));
        this.totalItemsSync += _containers.length;
        this.dialogContainerSync = false;
      }
    }
  }

  async removeContainer(item: IContainer) {
    if (this.bid) {
      const _res = await removeContainer(
        this.bid.id as number,
        item.id as number
      );
      if (_res.data) {
        const index = this.containersSync.findIndex(x => x.id === item.id);
        this.containersSync.splice(index, 1);
        this.totalItemsSync -= 1;
      }
    }
  }

  @Watch("inboundOptions", { immediate: true })
  async onInboundOptionsChange(val: DataOptions) {
    if (typeof val != "undefined" && this.outbound) {
      this.loading = true;
      const _res = await getInboundsByOutboundAndForwarder(
        this.outbound.id as number,
        {
          page: val.page - 1,
          limit: val.itemsPerPage
        }
      );
      if (_res.data) {
        const _inbounds = _res.data.data;
        this.inbounds = _inbounds;
        this.inboundServerSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }

  @Watch("containerOptions")
  async onContainerOptionsChange(val: DataOptions, oldVal: DataOptions) {
    if (typeof val != "undefined" && val.page != oldVal.page) {
      this.loading = true;
      await this.loadMoreContainers(val);
      this.loading = false;
    }
  }

  async clicked(value: IInbound) {
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded = [];
        this.inbound = null;
      } else {
        if (this.expanded.length > 0) this.expanded = [];
        this.expanded.push(value);
        this.inbound = value;
        await this.loadMoreContainers({
          ...this.containerOptions,
          page: 1
        });
      }
    }
  }

  async loadMoreContainers(val: DataOptions) {
    if (this.inbound) {
      const _res = await getContainersByInbound(this.inbound.id as number, {
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _containers = _res.data.data;
        this.containerList = _containers;
        this.containerServerSideOptions.totalItems = _res.data.totalElements;
      }
    }
  }
}
</script>
