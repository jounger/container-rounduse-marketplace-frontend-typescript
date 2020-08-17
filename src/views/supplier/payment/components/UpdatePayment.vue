<template>
  <v-dialog v-model="dialogEditSync" max-width="600">
    <v-card>
      <v-card-title class="headline"
        >{{ disabled ? "Thông tin" : "Cập nhật" }} Hóa đơn</v-card-title
      >
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
                v-model="paymentLocal.sender.companyName"
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
                v-model="paymentLocal.recipient.companyName"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                v-model="paymentLocal.type"
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
                v-model="paymentLocal.detail"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogEditSync = false">Trở về</v-btn>
        <v-btn
          @click="updatePayment()"
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
import { IPayment } from "@/entity/payment";
import FormValidate from "@/mixin/form-validate";
import { editPayment } from "@/api/payment";
import Utils from "@/mixin/utils";
import DatetimePicker from "@/components/DatetimePicker.vue";
import { addTimeToDate } from "@/utils/tool";

@Component({
  mixins: [FormValidate, Utils],
  components: {
    DatetimePicker
  }
})
export default class UpdatePayment extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @PropSync("payments", { type: Array }) paymentsSync?: Array<IPayment>;
  @Prop(Object) payment?: IPayment;
  @Prop(Boolean) disabled!: boolean;

  dateInit = addTimeToDate(new Date().toISOString());
  paymentLocal = null as IPayment | null;

  valid = false;
  types: Array<string> = ["FINES", "PAYMENT"];

  created() {
    this.paymentLocal = Object.assign({}, this.payment);
    this.paymentLocal = Object.assign({}, this.payment);
  }

  async updatePayment() {
    if (this.payment && this.paymentLocal) {
      const _res = await editPayment(
        this.payment.id as number,
        this.paymentLocal
      );
      if (_res.data && this.paymentsSync) {
        const _payment = _res.data.data;
        const index = this.paymentsSync.findIndex(x => x.id == _payment.id);
        this.paymentsSync.splice(index, 1, _payment);
      }
    }
  }
}
</script>
