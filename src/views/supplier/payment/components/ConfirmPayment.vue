<template>
  <v-dialog v-model="dialogConfirmSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;"
            >Xác nhận hóa đơn</span
          ></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có xác nhận đã nhận tiền cho hóa đơn này?</span
            >
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
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogConfirmSync = false">Hủy</v-btn>
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
        const _payment = _res.data;
        const index = this.paymentsSync.findIndex(x => x.id === _payment.id);
        this.paymentsSync.splice(index, 1, _payment);
        this.dialogConfirmSync = false;
      }
    }
  }
}
</script>
