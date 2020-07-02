<template>
  <v-content>
    <v-card>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <CreateInbound
        v-if="dialogAdd"
        :dialogAdd.sync="dialogAdd"
        :message.sync="message"
        :snackbar.sync="snackbar"
        :inbounds.sync="inbounds"
      />
      <UpdateInbound
        v-if="dialogEdit"
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
        />
      </v-row>
      <v-data-table
        :headers="headers"
        :items="inbounds"
        item-key="id"
        :loading="loading"
        :options.sync="options"
        :server-items-length="options.totalItems"
        :footer-props="{ 'items-per-page-options': options.itemsPerPageItems }"
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
        <template v-slot:item.status="{ item }">
          {{
            typeof item.billOfLading.containers[0] != "undefined"
              ? item.billOfLading.containers[0].status
              : ""
          }}
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
// import { getInboundByForwarder } from "@/api/inbound";
// import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";
import { getInboundByForwarder } from "@/api/inbound";
import { PaginationResponse } from "@/api/payload";
import { convertFromDateTime } from "@/utils/tool";

@Component({
  components: {
    CreateInbound,
    UpdateInbound,
    DeleteInbound,
    Snackbar
  }
})
export default class Inbound extends Vue {
  inbounds: Array<IInbound> = [];
  inbound = {} as IInbound;
  dialogAdd = false;
  dialogEdit = false;
  dialogDel = false;
  search = "";
  message = "";
  freeTime = "";
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
    { text: "Hãng tàu", value: "shippingLine" },
    { text: "Loại cont", value: "containerType" },
    { text: "Trạng thái", value: "status" },
    { text: "Thời gian lấy cont", value: "pickUpTime" },
    { text: "Thời gian được thuê cont", value: "freetime" },
    { text: "B/L No.", value: "billOfLading.billOfLadingNumber" },
    { text: "Cảng lấy cont", value: "billOfLading.portOfDelivery" },
    { text: "Số lượng cont", value: "billOfLading.containers.length" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];

  formatDatetime(date: string) {
    return convertFromDateTime(date);
  }

  created() {
    this.loading = false;
  }

  openUpdateDialog(item: IInbound) {
    this.inbound = item;
    this.inbound.pickupTime = this.inbound.pickupTime.slice(0, 10);
    this.inbound.billOfLading.freeTime = this.inbound.billOfLading.freeTime.slice(
      0,
      10
    );
    this.dialogEdit = true;
  }

  openDeleteDialog(item: IInbound) {
    this.inbound = item;
    this.dialogDel = true;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    console.log(this.$auth.user());
    if (val !== oldVal) {
      getInboundByForwarder(this.$auth.user().id, {
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IInbound> = res.data;
          console.log("watch", this.options);
          this.inbounds = response.data;
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
