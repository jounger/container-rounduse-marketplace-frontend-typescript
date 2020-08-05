<template>
  <v-dialog v-model="dialogDelSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa mã giảm giá</span>
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn xóa mã giảm giá này?</span
            >
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
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogDelSync = false">Hủy</v-btn>
        <v-btn @click="removeDiscount()" color="error">Xóa</v-btn>
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
