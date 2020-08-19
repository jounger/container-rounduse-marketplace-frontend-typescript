<template>
  <v-container fluid>
    <v-card>
      <v-row justify="center">
        <DeletePayment
          v-if="dialogDel"
          :dialogDel.sync="dialogDel"
          :payment="payment"
          :payments.sync="payments"
          :totalItems.sync="serverSideOptions.totalItems"
        />
      </v-row>
      <v-row justify="center">
        <ConfirmPayment
          v-if="dialogConfirm"
          :dialogConfirm.sync="dialogConfirm"
          :payment="payment"
          :payments.sync="payments"
        />
      </v-row>
      <v-row justify="center">
        <UpdatePayment
          v-if="dialogEdit"
          :payment="payment"
          :payments.sync="payments"
          :dialogEdit.sync="dialogEdit"
          :disabled="disabled"
        />
      </v-row>
      <v-data-table
        :headers="headers"
        :items="payments"
        :loading="loading"
        :options.sync="options"
        :server-items-length="serverSideOptions.totalItems"
        :footer-props="{
          'items-per-page-options': serverSideOptions.itemsPerPageItems
        }"
        :actions-append="options.page"
        no-data-text="Danh sách hóa đơn rỗng."
        disable-sort
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title style="font-weight:bold; font-size: 25px;"
              >Danh sách Hóa đơn</v-toolbar-title
            >
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
          </v-toolbar>
        </template>
        <template v-slot:item.status="{ item }">
          <ChipStatus :status="item.isPaid ? 'PAID' : 'PENDING'" />
        </template>
        <template v-slot:item.paymentDate="{ item }">
          {{ formatDatetime(item.paymentDate) }}
        </template>
        <template v-slot:item.type="{ item }">
          {{ item.type == "FINES" ? "Tiền phạt" : "Tiền phí" }}
        </template>
        <template v-slot:item.amount="{ item }">
          {{ currencyFormatter(item.amount) }}
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
              <v-list-item
                @click="openConfirmDialog(item)"
                v-if="
                  item.recipient.id == $auth.user().id && item.isPaid == false
                "
              >
                <v-list-item-icon>
                  <v-icon small>gavel</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xác nhận thanh toán</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="openUpdateDialog(item)"
                v-if="item.sender.id == $auth.user().id && item.isPaid == false"
              >
                <v-list-item-icon>
                  <v-icon small>edit</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Chỉnh sửa</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                @click="openDeleteDialog(item)"
                v-if="item.sender.id == $auth.user().id && item.isPaid == false"
              >
                <v-list-item-icon>
                  <v-icon small>delete</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>Xóa bỏ</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IPayment } from "@/entity/payment";
import CreatePayment from "./components/CreatePayment.vue";
import DeletePayment from "./components/DeletePayment.vue";
import Utils from "@/mixin/utils";
import { getPaymentsByUser } from "@/api/payment";
import { DataOptions } from "vuetify";
import ConfirmPayment from "./components/ConfirmPayment.vue";
import UpdatePayment from "./components/UpdatePayment.vue";
import ChipStatus from "@/components/ChipStatus.vue";

@Component({
  mixins: [Utils],
  components: {
    CreatePayment,
    UpdatePayment,
    DeletePayment,
    ConfirmPayment,
    ChipStatus
  }
})
export default class Payment extends Vue {
  payments: Array<IPayment> = [];
  payment = null as IPayment | null;
  dialogAdd = false;
  dialogEdit = false;
  dialogDel = false;
  dialogConfirm = false;
  roleSearch = "";
  loading = true;
  update = false;
  disabled = false;
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
      value: "id"
    },
    { text: "Mã hợp đồng", value: "contract.id" },
    { text: "Người gửi", value: "sender.companyName" },
    { text: "Người nhận", value: "recipient.companyName" },
    { text: "Số tiền", value: "amount" },
    { text: "Loại hóa đơn", value: "type" },
    { text: "Ngày thanh toán", value: "paymentDate" },
    { text: "Trạng thái", value: "status" },
    {
      text: "Hành động",
      value: "actions",
      sortable: false
    }
  ];

  openUpdateDialog(item: IPayment) {
    this.payment = item;
    this.disabled = false;
    this.dialogEdit = true;
  }

  openDetailDialog(item: IPayment) {
    this.payment = item;
    this.disabled = true;
    this.dialogEdit = true;
  }

  openDeleteDialog(item: IPayment) {
    this.payment = item;
    this.dialogDel = true;
  }

  openConfirmDialog(item: IPayment) {
    this.payment = item;
    this.dialogConfirm = true;
  }

  @Watch("options", { deep: true })
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getPaymentsByUser({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _payments = _res.data.data;
        this.payments = _payments;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
