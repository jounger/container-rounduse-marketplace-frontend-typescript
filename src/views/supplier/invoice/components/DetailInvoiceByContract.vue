<template>
  <v-container fluid>
    <v-dialog v-model="dialogDetailSync" max-width="fit-content">
      <v-card v-if="contract" class="elevation-0" tile>
        <v-img
          height="100"
          max-width="inherit"
          src="@/assets/images/background-cover.jpg"
        ></v-img>
        <v-card-text>
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
            class="elevation-0"
          >
            <template v-slot:top>
              <v-toolbar flat color="white">
                <v-toolbar-title style="font-weight:bold; font-size: 25px;"
                  >Danh sách Hóa đơn</v-toolbar-title
                >
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  @click="dialogAdd = true"
                >
                  Thêm mới
                </v-btn>
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
                      item.recipient.id == $auth.user().id &&
                        item.isPaid == false
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
                    v-if="
                      item.sender.id == $auth.user().id && item.isPaid == false
                    "
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
                    v-if="
                      item.sender.id == $auth.user().id && item.isPaid == false
                    "
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
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn @click="dialogDetailSync = false">
            Trở vể
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-row justify="center">
        <CreateInvoice
          v-if="dialogAdd"
          :dialogAdd.sync="dialogAdd"
          :combined="combined"
          :update="false"
          :readonly="false"
        />
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
    </v-dialog>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync, Watch } from "vue-property-decorator";
import { IContract } from "@/entity/contract";
import Utils from "@/mixin/utils";
import CreateInvoice from "./CreateInvoice.vue";
import UpdateInvoice from "./UpdateInvoice.vue";
import DeleteInvoice from "./DeleteInvoice.vue";
import ConfirmInvoice from "./ConfirmInvoice.vue";
import ChipStatus from "@/components/ChipStatus.vue";
import { getInvoicesByContract } from "@/api/invoice";
import { DataOptions } from "vuetify";
import { IInvoice } from "@/entity/invoice";
import { ICombined } from "@/entity/combined";

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
export default class DetailInvoiceByContract extends Vue {
  @Prop() contract!: IContract;
  @Prop() combined!: ICombined;
  @PropSync("dialogDetail", { type: Boolean }) dialogDetailSync!: boolean;

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
    itemsPerPage: 10
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
    if (typeof val != "undefined" && this.contract) {
      this.loading = true;
      const _res = await getInvoicesByContract(this.contract.id as number, {
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
