<template>
  <v-dialog v-model="dialogDelSync" max-width="400px">
    <v-card>
      <v-card-title class="headline">Xóa hàng</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span>Bạn có chắc chắn muốn xóa hàng xuất này?</span>
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ bookNo }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogDelSync = false">Trở về</v-btn>
        <v-btn @click="removeOutbound()" color="error">Xóa bỏ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IOutbound } from "@/entity/outbound";
import { removeOutbound } from "@/api/outbound";

@Component
export default class DeleteOutbound extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @Prop(Object) outbound!: IOutbound;
  @PropSync("outbounds", { type: Array }) outboundsSync!: Array<IOutbound>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;

  bookNo = "";
  created() {
    if (typeof this.outbound.booking.number != "undefined") {
      this.bookNo = this.outbound.booking.number;
    }
  }
  async removeOutbound() {
    if (this.outbound.id) {
      const _res = await removeOutbound(this.outbound.id);
      if (_res.status == 200) {
        const index = this.outboundsSync.findIndex(
          x => x.id === this.outbound.id
        );
        this.outboundsSync.splice(index, 1);
        this.totalItemsSync -= 1;
        this.dialogDelSync = false;
      }
    }
  }
}
</script>
