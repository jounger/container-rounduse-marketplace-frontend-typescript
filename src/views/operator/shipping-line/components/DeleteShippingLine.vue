<template>
  <v-dialog v-model="dialogDelSync" max-width="400px">
    <v-card>
      <v-card-title class="headline">Xóa hãng tàu</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span>Bạn có chắc chắn muốn xóa hãng tàu này?</span>
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{
                    shippingLine.companyCode
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogDelSync = false">Trở về</v-btn>
        <v-btn @click="removeShippingLine()" color="error">Xóa bỏ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IShippingLine } from "@/entity/shipping-line";
import { removeShippingLine } from "@/api/shipping-line";

@Component
export default class DeleteShippingLine extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("shippingLines", { type: Array })
  shippingLinesSync!: IShippingLine[];
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) shippingLine!: IShippingLine;

  async removeShippingLine() {
    if (this.shippingLine.id) {
      const _res = await removeShippingLine(this.shippingLine.id);
      if (_res.status == 200) {
        const index = this.shippingLinesSync.findIndex(
          x => x.id === this.shippingLine.id
        );
        this.shippingLinesSync.splice(index, 1);
        this.totalItemsSync -= 1;
        this.dialogDelSync = false;
      }
    }
  }
}
</script>
