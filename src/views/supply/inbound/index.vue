<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="inbounds"
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
        no-data-text="Danh sách hàng nhập rỗng."
        :actions-append="options.page"
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>Danh sách hàng nhập</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <v-btn color="primary" dark class="mb-2" @click="dialogAdd = true">
              Thêm mới
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:item.unit="{ item }">
          {{ item.billOfLading.unit + " x " + item.containerType.name }}
        </template>
        <template v-slot:item.billOfLading.portOfDelivery.fullname="{ item }">
          <div>{{ item.billOfLading.portOfDelivery.fullname }}</div>
          <small>Lấy lúc: {{ formatDatetime(item.pickupTime) }}</small>
        </template>
        <template v-slot:item.forward>
          <v-icon color="tertiary">arrow_forward</v-icon>
        </template>
        <template v-slot:item.returnStation="{ item }">
          <div>{{ item.returnStation }}</div>
          <small
            >Trả lúc: {{ formatDatetime(item.billOfLading.freeTime) }}</small
          >
        </template>

        <template v-slot:item.actions="{ item }">
          <v-menu :close-on-click="true">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" icon outlined v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item @click="openDetailDialog(item)">
                <v-list-item-icon>
                  <v-icon small>remove_red_eye</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xem chi tiết</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="openCreateBidDialog(item)">
                <v-list-item-icon>
                  <v-icon small>find_in_page</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Tìm thầu</v-list-item-title>
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
                  <v-list-item-title>Xóa bỏ</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="openCreateContainer(item)">
                <v-list-item-icon>
                  <v-icon small>local_shipping</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Khai báo container</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length" class="px-0" v-if="loading == false">
            <v-data-table
              :headers="containerHeaders"
              :items="containers"
              :loading="loading"
              :options.sync="containerOptions"
              :server-items-length="containerServerSideOptions.totalItems"
              :footer-props="{
                'items-per-page-options':
                  containerServerSideOptions.itemsPerPageItems
              }"
              :actions-append="containerOptions.page"
              disable-sort
              dense
            >
              <template v-slot:item.status="{ item }">
                <ChipStatus :status="item.status" :sub="true" />
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="openUpdateContainer(item)"
                  v-if="item.status == 'CREATED'"
                >
                  mdi-pencil
                </v-icon>
                <v-icon
                  small
                  @click="openRemoveContainer(item)"
                  v-if="item.status == 'CREATED'"
                >
                  delete
                </v-icon>
              </template>
            </v-data-table>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <CreateInbound
      :dialogAdd.sync="dialogAdd"
      :inbounds.sync="inbounds"
      :totalItems.sync="serverSideOptions.totalItems"
    />
    <UpdateInbound
      :inbound="inbound"
      :dialogEdit.sync="dialogEdit"
      :inbounds="inbounds"
    />
    <CreateBid
      v-if="dialogAddBid"
      :dialogAdd.sync="dialogAddBid"
      :inbound="inbound"
    />
    <v-row justify="center">
      <DeleteInbound
        v-if="dialogDel"
        :dialogDel.sync="dialogDel"
        :inbound="inbound"
        :inbounds.sync="inbounds"
        :totalItems.sync="serverSideOptions.totalItems"
      />
      <CreateContainer
        v-if="dialogAddCont && inbound"
        :container="container"
        :containers.sync="containers"
        :dialogAddCont.sync="dialogAddCont"
        :billOfLading="inbound.billOfLading"
        :totalItems.sync="containerServerSideOptions.totalItems"
        :update="update"
      />
      <DeleteContainer
        v-if="dialogDelCont && container"
        :dialogDelCont.sync="dialogDelCont"
        :container="container"
        :containers.sync="containers"
        :totalItems.sync="containerServerSideOptions.totalItems"
      />
      <DetailInbound
        v-if="dialogDetail"
        :dialogDetail.sync="dialogDetail"
        :inbound="inbound"
      />
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IInbound } from "@/entity/inbound";
import CreateInbound from "./components/CreateInbound.vue";
import UpdateInbound from "./components/UpdateInbound.vue";
import DeleteInbound from "./components/DeleteInbound.vue";
import Utils from "@/mixin/utils";
import { getInboundsByForwarder } from "@/api/inbound";
import { IContainer } from "@/entity/container";
import { getContainersByInbound } from "@/api/container";
import DeleteContainer from "./components/DeleteContainer.vue";
import CreateContainer from "./components/CreateContainer.vue";
import { DataOptions } from "vuetify";
import ChipStatus from "@/components/ChipStatus.vue";
import CreateBid from "../../supplier/bid/components/CreateBid.vue";
import DetailInbound from "./components/DetailInbound.vue";

@Component({
  mixins: [Utils],
  components: {
    CreateInbound,
    UpdateInbound,
    DeleteInbound,
    DetailInbound,
    DeleteContainer,
    CreateContainer,
    ChipStatus,
    CreateBid
  }
})
export default class Inbound extends Vue {
  inbounds: Array<IInbound> = [];
  inbound = null as IInbound | null;
  containers: Array<IContainer> = [];
  container = null as IContainer | null;
  dialogAddBid = false;
  dialogAddCont = false;
  dialogDelCont = false;
  dialogAdd = false;
  dialogEdit = false;
  dialogDel = false;
  dialogDetail = false;
  expanded: Array<IInbound> = [];
  singleExpand = true;
  search = "";
  freeTime = "";
  loading = false;
  update = false;
  options = {
    page: 1,
    itemsPerPage: 10
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  containerOptions = {
    page: 1,
    itemsPerPage: 10
  } as DataOptions;
  containerServerSideOptions = {
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
    { text: "B/L No.", value: "billOfLading.number" },
    { text: "Hãng tàu", value: "shippingLine.companyName" },
    { text: "Số lượng & loại cont trên B/L", value: "unit" },
    {
      text: "Cảng lấy cont hàng nhập",
      value: "billOfLading.portOfDelivery.fullname"
    },
    { text: "", value: "forward" },
    { text: "Nơi bốc dỡ hàng nhập", value: "returnStation" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];
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
    { text: "Lái xe", value: "driver.fullname", class: "tertiary" },
    { text: "SĐT liên hệ", value: "driver.phone", class: "tertiary" },
    {
      text: "Biển số rơ mọt",
      value: "trailer.licensePlate",
      class: "tertiary"
    },
    {
      text: "Biển số đầu kéo",
      value: "tractor.licensePlate",
      class: "tertiary"
    },
    { text: "Trạng thái", value: "status", class: "tertiary" },
    { text: "Hành động", value: "actions", class: "tertiary" }
  ];

  openDetailDialog(item: IInbound) {
    this.inbound = item;
    this.dialogDetail = true;
  }

  openCreateBidDialog(item: IInbound) {
    this.inbound = item;
    this.dialogAddBid = true;
  }

  openUpdateDialog(item: IInbound) {
    this.inbound = item;
    this.dialogEdit = true;
  }

  openDeleteDialog(item: IInbound) {
    this.inbound = item;
    this.dialogDel = true;
  }

  openCreateContainer(item: IInbound) {
    this.inbound = item;
    this.update = false;
    this.dialogAddCont = true;
  }

  openUpdateContainer(item: IContainer) {
    // TODO
    this.update = true;
    this.container = item;
    this.dialogAddCont = true;
  }

  openRemoveContainer(item: IContainer) {
    this.container = item;
    this.dialogDelCont = true;
  }

  async loadMoreContainers(val: DataOptions) {
    if (this.inbound) {
      this.loading = true;
      const _res = await getContainersByInbound(this.inbound.id as number, {
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _containers = _res.data.data;
        this.containers = _containers;
        this.containerServerSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }

  @Watch("containerOptions")
  async onContainerOptionsChange(val: DataOptions, oldVal: DataOptions) {
    if (typeof val != "undefined" && val.page != oldVal.page) {
      await this.loadMoreContainers(val);
    }
  }

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getInboundsByForwarder({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _inbounds = _res.data.data;
        this.inbounds = _inbounds;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
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
}
</script>
