<template>
  <v-dialog v-model="dialogConfirmSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            status == true ? "Xác nhận đồng ý HSDT" : "Xác nhận từ chối HSDT"
          }}</span>
          <v-btn
            icon
            dark
            @click="dialogConfirmSync = false"
            style="margin-left:275px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn
              {{ status == true ? "đồng ý" : "từ chối" }} HSDT này?</span
            >
            <div class="line"></div>
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
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogConfirmSync = false">Hủy</v-btn>
        <v-btn @click="reviewBid(status)" color="green" v-if="status"
          >Đồng ý</v-btn
        >
        <v-btn @click="reviewBid(status)" color="red" v-else>Từ chối</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IBiddingDocument } from "@/entity/bidding-document";
import { IBid } from "@/entity/bid";
import { editBid } from "@/api/bid";
import { IContainer } from "@/entity/container";

@Component
export default class ConfirmBid extends Vue {
  @PropSync("dialogConfirm", { type: Boolean }) dialogConfirmSync!: boolean;
  @PropSync("biddingDocument", { type: Object })
  biddingDocumentSync!: IBiddingDocument;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @Prop(Boolean) status!: boolean;
  @Prop(Object) bid!: IBid;
  reviewBid(status: boolean) {
    if (this.bid.id) {
      status == true
        ? (this.bid.status = "ACCEPTED")
        : (this.bid.status = "REJECTED");
      const bidContainerId: Array<number> = [];
      this.bid.containers.forEach((element: IContainer | number) => {
        if (typeof element != "number" && element.id) {
          bidContainerId.push(element.id);
        }
      });
      this.bid.containers = bidContainerId;
      const bidPrice = this.bid.bidPrice;
      this.bid.bidPrice = bidPrice + "";
      editBid(this.bid.id, this.bid)
        .then(res => {
          console.log(res.data);
          const respone = res.data;
          status == true
            ? (this.messageSync = "Đồng ý thành công HSDT: " + this.bid.id)
            : (this.messageSync = "Từ chối thành công HSDT: " + this.bid.id);
          const index = this.biddingDocumentSync.bids.findIndex(
            x => x.id === respone.id
          );
          this.biddingDocumentSync.bids.splice(index, 1, respone);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogConfirmSync = false))
        );
    }
  }
}
</script>
