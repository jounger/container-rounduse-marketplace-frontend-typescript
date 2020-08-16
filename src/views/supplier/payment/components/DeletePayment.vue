<template>
  <v-dialog v-model="dialogDelSync" max-width="400px">
    <v-card>
      <v-card-title class="headline">Xóa hóa đơn</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span>Bạn có chắc chắn muốn xóa hóa đơn này?</span>
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
        <v-btn @click="dialogDelSync = false">Trở về</v-btn>
        <v-btn @click="removePayment()" color="error">Xóa bỏ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IPayment } from "@/entity/payment";
import { removePayment } from "@/api/payment";

@Component
export default class DeletePayment extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("payments", { type: Array }) paymentsSync!: Array<IPayment>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) payment!: IPayment;

  async removePayment() {
    if (this.payment.id) {
      const _res = await removePayment(this.payment.id);
      if (_res.status == 200) {
        const index = this.paymentsSync.findIndex(
          x => x.id === this.payment.id
        );
        this.paymentsSync.splice(index, 1);
        this.totalItemsSync -= 1;
        this.dialogDelSync = false;
      }
    }
  }
}
</script>
