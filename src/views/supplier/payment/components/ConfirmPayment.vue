<template>
  <v-dialog v-model="dialogConfirmSync" max-width="400">
    <v-card>
      <v-card-title class="headline">Xác nhận hóa đơn</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span>Bạn xác nhận đã nhận đủ tiền theo đơn này?</span>
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ payment.id }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogConfirmSync = false">Trở về</v-btn>
        <v-btn @click="confirmPayment()" color="primary">Xác nhận</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IPayment } from "@/entity/payment";
import { editPayment } from "@/api/payment";

@Component
export default class ConfirmPayment extends Vue {
  @PropSync("dialogConfirm", { type: Boolean }) dialogConfirmSync!: boolean;
  @PropSync("payments", { type: Array }) paymentsSync!: Array<IPayment>;
  @Prop(Object) payment!: IPayment;

  async confirmPayment() {
    if (this.payment.id) {
      const _res = await editPayment(this.payment.id, { isPaid: true });
      if (_res.data) {
        const _payment = _res.data.data;
        const index = this.paymentsSync.findIndex(x => x.id === _payment.id);
        this.paymentsSync.splice(index, 1, _payment);
        this.dialogConfirmSync = false;
      }
    }
  }
}
</script>
