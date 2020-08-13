<template>
  <v-dialog v-model="dialogConfirmSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;"
            >Xác nhận Từ chối tham gia thầu</span
          ></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn từ chối tham gia thầu này?</span
            >
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{
                    biddingDocument.id
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogConfirmSync = false">Hủy</v-btn>
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
  @Prop(Object) biddingDocument!: IBiddingDocument;
  @Prop(Object) biddingNotification!: IBiddingNotification;
  @PropSync("biddingNotifications", { type: Array })
  biddingNotificationsSync!: Array<IBiddingDocument>;

  async confirmBid() {
    if (this.biddingNotification.id) {
      const _res = await editBiddingNotifications(this.biddingNotification.id, {
        isHide: true
      });
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
