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
                  <v-list-item-title>{{ invoice.id }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogDelSync = false">Trở về</v-btn>
        <v-btn @click="removeInvoice()" color="error">Xóa bỏ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IInvoice } from "@/entity/invoice";
import { removeInvoice } from "@/api/invoice";

@Component
export default class DeleteInvoice extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("invoices", { type: Array }) invoicesSync!: Array<IInvoice>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) invoice!: IInvoice;

  async removeInvoice() {
    if (this.invoice.id) {
      const _res = await removeInvoice(this.invoice.id);
      if (_res.status == 200) {
        const index = this.invoicesSync.findIndex(
          x => x.id === this.invoice.id
        );
        this.invoicesSync.splice(index, 1);
        this.totalItemsSync -= 1;
        this.dialogDelSync = false;
      }
    }
  }
}
</script>
