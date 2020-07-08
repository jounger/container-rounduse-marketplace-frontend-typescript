<template>
  <v-content>
    <v-card>
      <v-row justify="center">
        <DeletePayment
          :dialogDel.sync="dialogDel"
          :payment="payment"
          :payments.sync="payments"
          :totalItems.sync="options.totalItems"
          :message.sync="message"
          :snackbar.sync="snackbar"
        />
      </v-row>
      <v-row justify="center">
        <CreatePayment
          v-if="dialogAdd"
          :payment="payment"
          :payments.sync="payments"
          :dialogAdd.sync="dialogAdd"
          :message.sync="message"
          :totalItems.sync="options.totalItems"
          :snackbar.sync="snackbar"
          :update="update"
        />
      </v-row>
      <Snackbar :text="message" :snackbar.sync="snackbar" />
      <v-data-table
        :headers="headers"
        :items="payments"
        :search="search"
        :loading="loading"
        :options.sync="options"
        :server-items-length="options.totalItems"
        :footer-props="{ 'items-per-page-options': options.itemsPerPageItems }"
        :actions-append="options.page"
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
        <template v-slot:item.amountPayment="{ item }">
          {{ item.amount }}
          ({{ item.isPaid == true ? "Đã trả" : "Chưa trả" }})
        </template>
        <template v-slot:item.paymentDate="{ item }">
          {{ formatDatetime(item.paymentDate) }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="openUpdateDialog(item)">
            mdi-pencil
          </v-icon>
          <v-icon small @click="openDeleteDialog(item)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, Watch, Vue } from "vue-property-decorator";
import { IPayment } from "@/entity/payment";
import CreatePayment from "./components/CreatePayment.vue";
import DeletePayment from "./components/DeletePayment.vue";
// import { getPayments } from "@/api/payment";
import { PaginationResponse } from "@/api/payload";
import Snackbar from "@/components/Snackbar.vue";
import { PaymentData } from "./data";
import Utils from "@/mixin/utils";

@Component({
  mixins: [Utils],
  components: {
    CreatePayment,
    DeletePayment,
    Snackbar
  }
})
export default class Payment extends Vue {
  payments: Array<IPayment> = [];
  payment = {} as IPayment;
  dialogAdd = false;
  dialogDel = false;
  search = "";
  roleSearch = "";
  message = "";
  snackbar = false;
  loading = true;
  update = false;
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
      value: "id"
    },
    { text: "Người gửi", value: "sender" },
    { text: "Người nhận", value: "recipient" },
    {
      text: "Số tiền",
      value: "amountPayment"
    },
    { text: "Loại hình thanh toán", value: "type" },
    { text: "Ngày thanh toán", value: "paymentDate" },
    {
      text: "Hành động",
      value: "actions",
      sortable: false
    }
  ];
  openCreateDialog() {
    this.payment = {} as IPayment;
    this.update = false;
    this.dialogAdd = true;
  }

  openUpdateDialog(item: IPayment) {
    console.log(item);
    this.payment = item;
    this.update = true;
    this.dialogAdd = true;
  }

  openDeleteDialog(item: IPayment) {
    this.payment = item;
    this.dialogDel = true;
  }
  created() {
    this.payments = PaymentData;
    this.options.totalItems = this.payments.length;
    this.loading = false;
  }

  // @Watch("options", { deep: true })
  // onOptionsChange(val: object, oldVal: object) {
  //   if (val !== oldVal) {
  //     getPayments({
  //       page: this.options.page - 1,
  //       limit: this.options.itemsPerPage
  //     })
  //       .then(res => {
  //         const response: PaginationResponse<IPayment> = res.data;
  //         console.log("watch", response);
  //         this.payments = response.data;
  //         this.options.totalItems = response.totalElements;
  //       })
  //       .catch(err => console.log(err))
  //       .finally(() => (this.loading = false));
  //   }
  // }
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
