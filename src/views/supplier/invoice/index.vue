<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="invoices"
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
          </v-toolbar>
        </template>
        <template v-slot:item.isPaid="{ item }">
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
    <v-row justify="center">
      <DeleteInvoice
        v-if="dialogDel"
        :dialogDel.sync="dialogDel"
        :invoice="invoice"
        :invoices.sync="invoices"
        :totalItems.sync="serverSideOptions.totalItems"
      />
      <ConfirmInvoice
        v-if="dialogConfirm"
        :dialogConfirm.sync="dialogConfirm"
        :invoice="invoice"
        :invoices.sync="invoices"
      />
      <UpdateInvoice
        v-if="dialogEdit"
        :invoice="invoice"
        :invoices.sync="invoices"
        :dialogEdit.sync="dialogEdit"
        :disabled="disabled"
      />
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IInvoice } from "@/entity/invoice";
import CreateInvoice from "./components/CreateInvoice.vue";
import DeleteInvoice from "./components/DeleteInvoice.vue";
import Utils from "@/mixin/utils";
import { getInvoicesByUser } from "@/api/invoice";
import { DataOptions } from "vuetify";
import ConfirmInvoice from "./components/ConfirmInvoice.vue";
import UpdateInvoice from "./components/UpdateInvoice.vue";
import ChipStatus from "@/components/ChipStatus.vue";

@Component({
  mixins: [Utils],
  components: {
    CreateInvoice,
    UpdateInvoice,
    DeleteInvoice,
    ConfirmInvoice,
    ChipStatus
  }
})
export default class Invoice extends Vue {
  invoices: Array<IInvoice> = [];
  invoice = null as IInvoice | null;
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
    { text: "Trạng thái", value: "isPaid" },
    {
      text: "Hành động",
      value: "actions",
      sortable: false
    }
  ];

  openUpdateDialog(item: IInvoice) {
    this.invoice = item;
    this.disabled = false;
    this.dialogEdit = true;
  }

  openDetailDialog(item: IInvoice) {
    this.invoice = item;
    this.disabled = true;
    this.dialogEdit = true;
  }

  openDeleteDialog(item: IInvoice) {
    this.invoice = item;
    this.dialogDel = true;
  }

  openConfirmDialog(item: IInvoice) {
    this.invoice = item;
    this.dialogConfirm = true;
  }

  @Watch("options", { deep: true })
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      const _res = await getInvoicesByUser({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _invoices = _res.data.data;
        this.invoices = _invoices;
        this.serverSideOptions.totalItems = _res.data.totalElements;
      }
      this.loading = false;
    }
  }
}
</script>
