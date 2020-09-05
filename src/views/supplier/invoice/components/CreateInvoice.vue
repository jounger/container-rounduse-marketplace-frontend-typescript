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
                v-model="invoiceLocal.sender"
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
                v-model="invoiceLocal.recipient"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="invoiceLocal.type"
                prepend-icon="money"
                :items="invoiceTypes"
                item-text="vi"
                item-value="en"
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
                :hint="currencyFormatter(invoiceLocal.amount)"
                v-model="invoiceLocal.amount"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <DatetimePicker
                :datetime="invoiceLocal.paymentDate"
                :return-value.sync="invoiceLocal.paymentDate"
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
                v-model="invoiceLocal.detail"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn @click="createInvoice()" color="primary" :disabled="!valid"
          >Thêm mới</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IInvoice } from "@/entity/invoice";
import FormValidate from "@/mixin/form-validate";
import { createInvoice } from "@/api/invoice";
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
export default class CreateInvoice extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("invoices", { type: Array }) invoicesSync?: Array<IInvoice>;
  @Prop(Object) combined!: ICombined;

  dateInit = addTimeToDate(new Date().toISOString());
  invoiceLocal = {
    sender: "",
    recipient: "",
    detail: "",
    amount: 0,
    isPaid: false,
    type: "",
    paymentDate: this.dateInit
  } as IInvoice;
  valid = false;
  invoiceTypes: Array<object> = [];

  created() {
    const _contract = this.combined.contract as IContract;
    const _bid = this.combined.bid as IBid;
    const _bidder = _bid.bidder as IForwarder;
    if (this.$auth.check("ROLE_MERCHANT")) {
      this.invoiceTypes = [
        { en: "PAYMENT", vi: "Thanh toán phí" },
        { en: "FINES", vi: "Tiền phạt hợp đồng" }
      ];
      this.invoiceLocal.sender = _contract.sender.companyName;
      this.invoiceLocal.recipient = _bidder.companyName;
    } else if (this.$auth.check("ROLE_FORWARDER")) {
      this.invoiceTypes = [{ en: "FINES", vi: "Tiền phạt hợp đồng" }];
      this.invoiceLocal.sender = _bidder.companyName;
      this.invoiceLocal.recipient = _contract.sender.companyName;
    }
  }

  async createInvoice() {
    if (this.combined.contract) {
      const _res = await createInvoice(
        this.combined.contract.id as number,
        this.invoiceLocal
      );
      if (_res.data && this.invoicesSync) {
        const _invoice = _res.data.data;
        this.invoicesSync.push(_invoice);
      }
      if (_res.status == 201) {
        this.dialogAddSync = false;
      }
    }
  }
}
</script>
