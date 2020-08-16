<template>
  <v-dialog v-model="dialogDelSync" max-width="400px">
    <v-card>
      <v-card-title class="headline">Xóa mã giảm giá</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span>Bạn có chắc chắn muốn xóa mã giảm giá này?</span>
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ discount.code }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogDelSync = false">Trở về</v-btn>
        <v-btn @click="removeDiscount()" color="error">Xóa bỏ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IDiscount } from "@/entity/discount";
import { removeDiscount } from "@/api/discount";

@Component
export default class DeleteDiscount extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("discounts", { type: Array }) discountsSync!: Array<IDiscount>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) discount!: IDiscount;

  async removeDiscount() {
    if (this.discount.id) {
      const _res = await removeDiscount(this.discount.id);
      if (_res.status == 200) {
        const index = this.discountsSync.findIndex(
          x => x.id === this.discount.id
        );
        this.discountsSync.splice(index, 1);
        this.totalItemsSync -= 1;
        this.dialogDelSync = false;
      }
    }
  }
}
</script>
