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
                  <v-list-item-title>{{ invoice.id }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogConfirmSync = false">Trở về</v-btn>
        <v-btn @click="confirmInvoice()" color="primary">Xác nhận</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IInvoice } from "@/entity/invoice";
import { editInvoice } from "@/api/invoice";

@Component
export default class ConfirmInvoice extends Vue {
  @PropSync("dialogConfirm", { type: Boolean }) dialogConfirmSync!: boolean;
  @PropSync("invoices", { type: Array }) invoicesSync!: Array<IInvoice>;
  @Prop(Object) invoice!: IInvoice;

  async confirmInvoice() {
    if (this.invoice.id) {
      const _res = await editInvoice(this.invoice.id, { isPaid: true });
      if (_res.data) {
        const _invoice = _res.data.data;
        const index = this.invoicesSync.findIndex(x => x.id === _invoice.id);
        this.invoicesSync.splice(index, 1, _invoice);
        this.dialogConfirmSync = false;
      }
    }
  }
}
</script>
