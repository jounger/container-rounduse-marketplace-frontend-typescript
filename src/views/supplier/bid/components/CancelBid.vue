<template>
  <v-dialog v-model="dialogCancelSync" max-width="400">
    <v-card>
      <v-card-title class="headline">Hủy bỏ HSDT</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span>Bạn có chắc chắn muốn hủy HSDT này?</span>
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{
                    typeof bid.id !== "undefined" ? bid.id : ""
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogCancelSync = false">Trở về</v-btn>
        <v-btn @click="cancelBid()" color="error">Hủy bỏ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IBid } from "@/entity/bid";
import { editBid } from "@/api/bid";

@Component
export default class CancelBid extends Vue {
  @PropSync("dialogCancel", { type: Boolean }) dialogCancelSync!: boolean;
  @Prop(Object) bid!: IBid;
  @PropSync("bids", { type: Array }) bidsSync!: Array<IBid>;

  async cancelBid() {
    if (this.bid.id) {
      const _res = await editBid(this.bid.id, {
        status: "CANCELED"
      });
      if (_res.data) {
        const _bid = _res.data.data;
        const index = this.bidsSync.findIndex(x => x.id === _bid.id);
        this.bidsSync.splice(index, 1, _bid);
        this.dialogCancelSync = false;
      }
    }
  }
}
</script>
