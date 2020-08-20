<template>
  <v-dialog v-model="dialogConfirmSync" max-width="400">
    <v-card>
      <v-card-title class="headline"
        >Xác nhận từ chối tham gia thầu</v-card-title
      >

      <v-card-text>
        <v-form>
          <v-container>
            <span>Bạn có chắc chắn muốn từ chối tham gia thầu này?</span>
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{
                    biddingNotification.relatedResource.id
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogConfirmSync = false">Trở về</v-btn>
        <v-btn @click="confirmBid()" color="error">Từ chối</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";

import { IBiddingDocument } from "@/entity/bidding-document";
import { IBiddingNotification } from "@/entity/notification";
import { editBiddingNotifications } from "@/api/notification";

@Component
export default class ConfirmBid extends Vue {
  @PropSync("dialogConfirm", { type: Boolean }) dialogConfirmSync!: boolean;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) biddingNotification!: IBiddingNotification;
  @PropSync("biddingNotifications", { type: Array })
  biddingNotificationsSync!: Array<IBiddingDocument>;

  async confirmBid() {
    if (this.biddingNotification) {
      const _res = await editBiddingNotifications(
        this.biddingNotification.id as number,
        {
          isHide: true
        }
      );
      if (_res.data) {
        const _biddingNofitication = _res.data.data;
        const index = this.biddingNotificationsSync.findIndex(
          x => x.id === _biddingNofitication.id
        );
        this.biddingNotificationsSync.splice(index, 1);
        this.totalItemsSync -= 1;
        this.dialogConfirmSync = false;
      }
    }
  }
}
</script>
