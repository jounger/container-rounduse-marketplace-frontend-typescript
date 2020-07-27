<template>
  <v-dialog v-model="dialogAddPaymentSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhập Hóa đơn" : "Thêm mới Hóa đơn"
          }}</span></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Người gửi*"
                name="sender"
                prepend-icon="record_voice_over"
                type="text"
                :readonly="update"
                :counter="20"
                :rules="[minLength('sender', 5), maxLength('sender', 20)]"
                v-model="paymentLocal.sender"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Người nhận*"
                name="recipient"
                prepend-icon="hearing"
                type="text"
                :readonly="update"
                :counter="20"
                :rules="[minLength('recipient', 5), maxLength('recipient', 20)]"
                v-model="paymentLocal.recipient"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Nội dung*"
                name="detail"
                prepend-icon="description"
                type="text"
                :rules="[required('detail')]"
                v-model="paymentLocal.detail"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Số tiền*"
                name="amount"
                prepend-icon="monetization_on"
                type="number"
                :rules="[required('amount')]"
                v-model="paymentLocal.amount"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="paymentLocal.type"
                prepend-icon="money"
                :items="types"
                :rules="[required('type')]"
                label="Loại hình thanh toán*"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-menu
                ref="paymentDatePicker"
                v-model="paymentDatePicker"
                :close-on-content-click="false"
                :return-value.sync="paymentDate"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="paymentDate"
                    label="Thời gian thanh toán*"
                    prepend-icon="event"
                    v-bind="attrs"
                    v-on="on"
                    :rules="[required('payment date')]"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="paymentDate" no-title scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="paymentDatePicker = false"
                    >Cancel</v-btn
                  >
                  <v-btn
                    text
                    color="primary"
                    @click="$refs.paymentDatePicker.save(paymentDate)"
                    >OK</v-btn
                  >
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn
          @click="updatePayment()"
          color="primary"
          v-if="update"
          :disabled="!valid"
          >Cập nhập</v-btn
        >
        <v-btn
          @click="createPayment()"
          color="primary"
          v-else
          :disabled="!valid"
          >Thêm mới</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IPayment } from "@/entity/payment";
import FormValidate from "@/mixin/form-validate";
import { createPayment, editPayment } from "@/api/payment";
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";
import { IContract } from "@/entity/contract";

@Component({
  mixins: [FormValidate]
})
export default class CreatePayment extends Vue {
  @PropSync("dialogAddPayment", { type: Boolean })
  dialogAddPaymentSync!: boolean;
  @PropSync("payments", { type: Array }) paymentsSync?: Array<IPayment>;
  @Prop(Object) payment?: IPayment;
  @Prop(Object) contract!: IContract;
  @Prop(Boolean) update!: boolean;

  dateInit = new Date().toISOString().substr(0, 10);
  paymentLocal = {
    sender: "",
    recipient: "",
    detail: "",
    amount: 0,
    isPaid: false,
    type: "",
    paymentDate: ""
  } as IPayment;
  valid = false;
  types: Array<string> = [];
  paymentDatePicker = false;
  paymentDate = this.dateInit;
  created() {
    this.types = ["FINES", "PAYMENT"];
    if (this.update) {
      if (typeof this.payment != "undefined") {
        this.paymentLocal = Object.assign({}, this.payment);
        this.paymentDate = this.paymentLocal.paymentDate.slice(0, 10);
      }
    }
  }
  async createPayment() {
    if (this.paymentLocal && this.contract.id) {
      const _payment = await createPayment(this.contract.id, this.paymentLocal)
        .then(res => {
          const response: IPayment = res.data;
          snackbar.setSnackbar({
            text: "Thêm mới thành công Hóa đơn: " + response.id,
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
      if (_payment) {
        this.dialogAddPaymentSync = false;
      }
    }
  }
  async updatePayment() {
    if (this.paymentLocal.id) {
      const _payment = await editPayment(
        this.paymentLocal.id,
        this.paymentLocal
      )
        .then(res => {
          console.log(res.data);
          const response: IPayment = res.data;
          snackbar.setSnackbar({
            text: "Cập nhập thành công Hóa đơn: " + response.id,
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
      if (_payment) {
        if (this.paymentsSync) {
          const index = this.paymentsSync.findIndex(x => x.id == _payment.id);
          this.paymentsSync.splice(index, 1, _payment);
        }
      }
    }
  }
}
</script>
