<template>
  <v-dialog v-model="dialogDelSync" max-width="400px">
    <v-card>
      <v-card-title class="headline">Xóa hàng</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span>Bạn có chắc chắn muốn xóa hàng nhập này?</span>
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{
                    typeof inbound.billOfLading !== "undefined"
                      ? inbound.billOfLading.number
                      : ""
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogDelSync = false">Trở về</v-btn>
        <v-btn @click="removeInbound()" color="error">Xóa bỏ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IInbound } from "@/entity/inbound";
import { removeInbound } from "@/api/inbound";

@Component
export default class DeleteInbound extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("inbounds", { type: Array }) inboundsSync!: Array<IInbound>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) inbound!: IInbound;

  async removeInbound() {
    if (this.inbound.id) {
      const _res = await removeInbound(this.inbound.id);
      if (_res.status == 200) {
        const index = this.inboundsSync.findIndex(
          x => x.id === this.inbound.id
        );
        this.inboundsSync.splice(index, 1);
        this.totalItemsSync -= 1;
        this.dialogDelSync = false;
      }
    }
  }
}
</script>
