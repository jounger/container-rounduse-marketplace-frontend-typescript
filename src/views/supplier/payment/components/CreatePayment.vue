<template>
  <v-dialog v-model="dialogAddSync" max-width="600">
    <v-card>
      <v-card-title class="headline">Khai báo Hóa đơn</v-card-title>
      <v-divider></v-divider>
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
                disabled
                :counter="20"
                v-model="paymentLocal.sender"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Người nhận*"
                name="recipient"
                prepend-icon="hearing"
                type="text"
                disabled
                :counter="20"
                v-model="paymentLocal.recipient"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="paymentLocal.type"
                prepend-icon="money"
                :items="types"
                :rules="[required('loại hóa đơn')]"
                label="Loại hóa đơn*"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Số tiền*"
                name="amount"
                prepend-icon="monetization_on"
                type="number"
                :rules="[required('số tiền')]"
                :hint="currencyFormatter(paymentLocal.amount)"
                v-model="paymentLocal.amount"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <DatetimePicker
                :datetime="paymentLocal.paymentDate"
                :return-value.sync="paymentLocal.paymentDate"
                dateicon="event"
                datelabel="Thời gian thanh toán*"
                timelabel="Giờ thanh toán"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <v-textarea
                label="Nội dung*"
                name="detail"
                prepend-icon="description"
                outlined
                :rules="[required('nội dung hóa đơn')]"
                v-model="paymentLocal.detail"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn @click="createPayment()" color="primary" :disabled="!valid"
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
import { createPayment } from "@/api/payment";
import { ICombined } from "@/entity/combined";
import { IBid } from "@/entity/bid";
import Utils from "@/mixin/utils";
import DatetimePicker from "@/components/DatetimePicker.vue";
import { addTimeToDate } from "@/utils/tool";
import { IForwarder } from "@/entity/forwarder";
import { IContract } from "@/entity/contract";

@Component({
  mixins: [FormValidate, Utils],
  components: {
    DatetimePicker
  }
})
export default class CreatePayment extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("payments", { type: Array }) paymentsSync?: Array<IPayment>;
  @Prop(Object) combined!: ICombined;

  dateInit = addTimeToDate(new Date().toISOString());
  paymentLocal = {
    sender: "",
    recipient: "",
    detail: "",
    amount: 0,
    isPaid: false,
    type: "",
    paymentDate: this.dateInit
  } as IPayment;
  valid = false;
  types: Array<string> = [];

  created() {
    const _contract = this.combined.contract as IContract;
    const _bid = this.combined.bid as IBid;
    const _bidder = _bid.bidder as IForwarder;
    if (this.$auth.check("ROLE_MERCHANT")) {
      this.types = ["FINES", "PAYMENT"];
      this.paymentLocal.sender = _contract.sender.companyName;
      this.paymentLocal.recipient = _bidder.companyName;
    } else if (this.$auth.check("ROLE_FORWARDER")) {
      this.types = ["FINES"];
      this.paymentLocal.sender = _bidder.companyName;
      this.paymentLocal.recipient = _contract.sender.companyName;
    }
  }

  async createPayment() {
    if (this.combined.contract) {
      const _res = await createPayment(
        this.combined.contract.id as number,
        this.paymentLocal
      );
      if (_res.data && this.paymentsSync) {
        const _payment = _res.data.data;
        this.paymentsSync.push(_payment);
      }
      if (_res.status == 201) {
        this.dialogAddSync = false;
      }
    }
  }
}
</script>
