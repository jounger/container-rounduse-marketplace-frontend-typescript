<template>
  <v-content>
    <v-card>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <CreateInbound
        :dialogAdd.sync="dialogAdd"
        :message.sync="message"
        :snackbar.sync="snackbar"
        :inbounds.sync="inbounds"
        :totalItems.sync="options.totalItems"
      />
      <UpdateInbound
        :inbound="inbound"
        :dialogEdit.sync="dialogEdit"
        :message.sync="message"
        :snackbar.sync="snackbar"
        :inbounds.sync="inbounds"
      />
      <v-row justify="center">
        <DeleteInbound
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :inbound="inbound"
          :inbounds.sync="inbounds"
          :message.sync="message"
          :snackbar.sync="snackbar"
          :totalItems.sync="options.totalItems"
        />
      </v-row>
      <v-row justify="center">
        <DeleteContainer
          v-if="dialogDelCont"
          :dialogDelCont.sync="dialogDelCont"
          :message.sync="message"
          :snackbar.sync="snackbar"
          :container="container"
          :containers.sync="containers"
        />
      </v-row>
      <v-row justify="center">
        <CreateContainer
          v-if="dialogAddCont"
          :message.sync="message"
          :snackbar.sync="snackbar"
          :container="container"
          :containers.sync="containers"
          :dialogAddCont.sync="dialogAddCont"
          :billOfLading="inbound.billOfLading"
          :update="update"
        />
      </v-row>
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
        :actions-append="options.page"
        class="elevation-1"
      >
        <!--  -->
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
        <!--  -->
        <template v-slot:item.pickUpTime="{ item }">
          {{ formatDatetime(item.pickupTime) }}
        </template>
        <template v-slot:item.freetime="{ item }">
          {{ formatDatetime(item.billOfLading.freeTime) }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-menu :close-on-click="true">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="pink" icon outlined v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
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
        <template v-slot:expanded-item="{ headers }">
          <td :colspan="headers.length">
            <v-data-table
              :headers="containerHeaders"
              :items="containers"
              :hide-default-footer="true"
              dense
              dark
            >
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
                <span style="color:green;" v-if="item.status == 'BIDDING'"
                  >BIDDING</span
                >
                <span style="color:green;" v-if="item.status == 'COMBINED'"
                  >COMBINED</span
                >
              </template>
              <template v-slot:footer>
                <v-row justify="center">
                  <v-btn
                    class="ma-1"
                    tile
                    color="success"
                    @click.stop="openCreateContainer()"
                    small
                    v-if="containers.length < inbound.billOfLading.unit"
                  >
                    <span style="color:white;">Thêm Container</span>
                  </v-btn>
                </v-row>
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
import { IInbound } from "@/entity/inbound";
import CreateInbound from "./components/CreateInbound.vue";
import UpdateInbound from "./components/UpdateInbound.vue";
import DeleteInbound from "./components/DeleteInbound.vue";
import Utils from "@/mixin/utils";
import Snackbar from "@/components/Snackbar.vue";
import { getInboundsByForwarder } from "@/api/inbound";
import { PaginationResponse } from "@/api/payload";
import { IContainer } from "@/entity/container";
import { getContainersByInbound } from "@/api/container";
import DeleteContainer from "./components/DeleteContainer.vue";
import CreateContainer from "./components/CreateContainer.vue";
import { DataOptions } from "vuetify";

@Component({
  mixins: [Utils],
  components: {
    CreateInbound,
    UpdateInbound,
    DeleteInbound,
    DeleteContainer,
    CreateContainer,
    Snackbar
  }
})
export default class Inbound extends Vue {
  inbounds: Array<IInbound> = [];
  inbound = {} as IInbound;
  containers: Array<IContainer> = [];
  container = {} as IContainer;
  dialogAddCont = false;
  dialogDelCont = false;
  dialogAdd = false;
  dialogEdit = false;
  dialogDel = false;
  expanded: Array<IInbound> = [];
  singleExpand = true;
  search = "";
  message = "";
  freeTime = "";
  snackbar = false;
  loading = true;
  update = false;
  dateInit = new Date().toISOString().substr(0, 10);
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
    { text: "Hãng tàu", value: "shippingLine" },
    { text: "Loại cont", value: "containerType" },
    { text: "Thời gian lấy cont", value: "pickUpTime" },
    { text: "Thời gian được thuê cont", value: "freetime" },
    { text: "B/L No.", value: "billOfLading.billOfLadingNumber" },
    { text: "Cảng lấy cont", value: "billOfLading.portOfDelivery" },
    { text: "Số cont đăng ký", value: "billOfLading.unit" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];
  containerHeaders = [
    {
      text: "Container No.",
      align: "start",
      sortable: false,
      value: "containerNumber",
      class: "elevation-1 primary"
    },
    { text: "Tài xế", value: "driver", class: "elevation-1 primary" },
    { text: "Trạng thái", value: "status", class: "elevation-1 primary" },
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

  created() {
    this.loading = false;
  }

  openUpdateDialog(item: IInbound) {
    this.inbound = item;
    this.dialogEdit = true;
  }

  openDeleteDialog(item: IInbound) {
    this.inbound = item;
    this.dialogDel = true;
  }
  openCreateContainer() {
    this.update = false;
    this.container = {} as IContainer;
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
  getContainers(item: IInbound) {
    if (item.id) {
      getContainersByInbound(item.id, {
        page: 0,
        limit: 100
      })
        .then(res => {
          const response = res.data;
          this.containers = response.data;
        })
        .catch(err => {
          console.log(err);
        })
        .finally();
    }
  }
  @Watch("options")
  onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      getInboundsByForwarder({
        page: val.page - 1,
        limit: val.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IInbound> = res.data;
          console.log("watch", response);
          this.inbounds = response.data;
          this.serverSideOptions.totalItems = response.totalElements;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }
  clicked(value: IInbound) {
    if (this.singleExpand) {
      if (this.expanded.length > 0 && this.expanded[0].id === value.id) {
        this.expanded.splice(0, this.expanded.length);
        this.inbound = {} as IInbound;
      } else {
        this.expanded.splice(0, this.expanded.length);
        this.getContainers(value);
        this.expanded.push(value);
        this.inbound = value;
      }
    } else {
      const index = this.expanded.findIndex(x => x.id === value.id);
      if (index === -1) {
        this.getContainers(value);
        this.expanded.push(value);
        this.inbound = value;
      } else {
        this.expanded.splice(index, 1);
        this.inbound = {} as IInbound;
      }
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
