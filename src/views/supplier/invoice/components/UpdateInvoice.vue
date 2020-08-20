<template>
  <v-dialog v-model="dialogEditSync" max-width="600">
    <v-card>
      <v-card-title class="headline"
        >{{ disabled ? "Thông tin" : "Cập nhật" }} Hóa đơn</v-card-title
      >
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
                v-model="invoiceLocal.sender.companyName"
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
                v-model="invoiceLocal.recipient.companyName"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="invoiceLocal.type"
                prepend-icon="money"
                disabled
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
                :disabled="disabled"
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
                :disabled="disabled"
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
                :disabled="disabled"
                :rules="[required('nội dung hóa đơn')]"
                v-model="invoiceLocal.detail"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogEditSync = false">Trở về</v-btn>
        <v-btn
          @click="updateInvoice()"
          color="primary"
          v-if="!disabled"
          :disabled="!valid"
          >Cập nhật</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IInvoice } from "@/entity/invoice";
import FormValidate from "@/mixin/form-validate";
import { editInvoice } from "@/api/invoice";
import Utils from "@/mixin/utils";
import DatetimePicker from "@/components/DatetimePicker.vue";
import { addTimeToDate } from "@/utils/tool";

@Component({
  mixins: [FormValidate, Utils],
  components: {
    DatetimePicker
  }
})
export default class UpdateInvoice extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @PropSync("invoices", { type: Array }) invoicesSync?: Array<IInvoice>;
  @Prop(Object) invoice?: IInvoice;
  @Prop(Boolean) disabled!: boolean;

  dateInit = addTimeToDate(new Date().toISOString());
  invoiceLocal = null as IInvoice | null;

  valid = false;
  types: Array<string> = ["FINES", "PAYMENT"];

  created() {
    this.invoiceLocal = Object.assign({}, this.invoice);
    this.invoiceLocal = Object.assign({}, this.invoice);
  }

  async updateInvoice() {
    if (this.invoice && this.invoiceLocal) {
      const _res = await editInvoice(
        this.invoice.id as number,
        this.invoiceLocal
      );
      if (_res.data && this.invoicesSync) {
        const _invoice = _res.data.data;
        const index = this.invoicesSync.findIndex(x => x.id == _invoice.id);
        this.invoicesSync.splice(index, 1, _invoice);
      }
    }
  }
}
</script>
