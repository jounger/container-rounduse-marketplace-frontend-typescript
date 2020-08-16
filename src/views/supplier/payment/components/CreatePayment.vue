<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-card-title class="headline"
        >{{ update ? (readonly ? "Thông tin" : "Cập nhật") : "Thêm mới" }} Hóa
        đơn</v-card-title
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
                :disabled="update || readonly"
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
                :disabled="readonly"
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
                :disabled="update"
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
                :disabled="readonly"
                :rules="[required('nội dung hóa đơn')]"
                v-model="paymentLocal.detail"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn
          @click="updatePayment()"
          color="primary"
          v-if="update && !readonly"
          :disabled="!valid"
          >Cập nhật</v-btn
        >
        <v-btn
          @click="createPayment()"
          color="primary"
          v-if="!update && !readonly"
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
import { ICombined } from "@/entity/combined";
import { IBid } from "@/entity/bid";
import Utils from "@/mixin/utils";
import DatetimePicker from "@/components/DatetimePicker.vue";
import { addTimeToDate } from "@/utils/tool";
import { IForwarder } from "@/entity/forwarder";

@Component({
  mixins: [FormValidate, Utils],
  components: {
    DatetimePicker
  }
})
export default class CreatePayment extends Vue {
  @PropSync("dialogAdd", { type: Boolean })
  dialogAddSync!: boolean;
  @PropSync("payments", { type: Array }) paymentsSync?: Array<IPayment>;
  @Prop(Object) payment?: IPayment;
  @Prop(Object) combined!: ICombined;
  @Prop(String) merchant!: string;
  @Prop(Boolean) update!: boolean;
  @Prop(Boolean) readonly!: boolean;

  dateInit = addTimeToDate(new Date().toISOString());
  paymentLocal = {
    sender: this.$auth.user().fullname,
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
    if (this.$auth.check("ROLE_MERCHANT")) {
      this.types = ["Tiền phạt", "Tiền phí"];
      if (this.combined) {
        const _bid = this.combined.bid as IBid;
        const _bidder = _bid.bidder as IForwarder;
        this.paymentLocal.recipient = _bidder.username;
      }
    }
    if (this.$auth.check("ROLE_FORWARDER")) {
      this.types = ["Tiền phạt"];
      this.paymentLocal.recipient = this.merchant;
    }
    if (this.update) {
      this.types = ["Tiền phạt", "Tiền phí"];
      if (typeof this.payment != "undefined") {
        this.paymentLocal = Object.assign({}, this.payment);
        if (this.payment.type == "FINES") {
          this.paymentLocal.type = "Tiền phạt";
        } else {
          this.paymentLocal.type = "Tiền phí";
        }
      }
    }
  }

  async createPayment() {
    if (
      this.paymentLocal &&
      this.combined.contract &&
      this.combined.contract.id
    ) {
      if (this.paymentLocal.type == "Tiền phạt") {
        this.paymentLocal.type = "FINES";
      }
      if (this.paymentLocal.type == "Tiền phí") {
        this.paymentLocal.type = "PAYMENT";
      }
      const _res = await createPayment(
        this.combined.contract.id,
        this.paymentLocal
      );
      if (_res.data && this.paymentsSync) {
        const _payment = _res.data.data;
        this.paymentsSync.push(_payment);
        this.dialogAddSync = false;
      }
    }
  }

  async updatePayment() {
    if (this.paymentLocal.id) {
      const _res = await editPayment(this.paymentLocal.id, this.paymentLocal);
      if (_res.data && this.paymentsSync) {
        const _payment = _res.data.data;
        const index = this.paymentsSync.findIndex(x => x.id == _payment.id);
        this.paymentsSync.splice(index, 1, _payment);
      }
    }
  }
}
</script>
