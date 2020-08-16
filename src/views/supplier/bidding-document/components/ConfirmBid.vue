<template>
  <v-dialog v-model="dialogConfirmSync" max-width="400">
    <v-card>
      <CreateCombined
        :dialogAdd.sync="dialogContract"
        :dialogConfirm.sync="dialogConfirmSync"
        :numberWinner.sync="numberWinnerSync"
        :bids.sync="bidsSync"
        :bid="bid"
      />
      <v-card-title class="headline">{{
        isAccept == true ? "Xác nhận đồng ý HSDT" : "Xác nhận từ chối HSDT"
      }}</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span
              >Bạn có chắc chắn muốn
              {{ isAccept == true ? "đồng ý" : "từ chối" }} HSDT này?</span
            >
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
        <v-btn @click="dialogConfirmSync = false">Trở về</v-btn>
        <v-btn @click="reviewBid(isAccept)" color="green" v-if="isAccept"
          ><span style="color:white;">Đồng ý</span></v-btn
        >
        <v-btn @click="reviewBid(isAccept)" color="red" v-else
          ><span style="color:white;">Từ chối</span></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IBid } from "@/entity/bid";
import { editBid } from "@/api/bid";
import CreateCombined from "../../combined/components/CreateCombined.vue";

@Component({
  components: {
    CreateCombined
  }
})
export default class ConfirmBid extends Vue {
  @PropSync("dialogConfirm", { type: Boolean }) dialogConfirmSync!: boolean;
  @PropSync("bids", { type: Array }) bidsSync!: Array<IBid>;
  @PropSync("numberWinner", { type: Number }) numberWinnerSync!: number;
  @Prop(Boolean) isAccept!: boolean;
  @Prop(Object) bid!: IBid;

  dialogContract = false;
  update = false;

  async reviewBid(isAccept: boolean) {
    if (this.bid.id) {
      const _res = await editBid(this.bid.id, {
        status: isAccept ? "ACCEPTED" : "REJECTED"
      });
      if (_res.data) {
        const _bid = _res.data.data;
        const index = this.bidsSync.findIndex(x => x.id === _bid.id);
        this.bidsSync.splice(index, 1, _bid);
        this.dialogConfirmSync = false;
      }
    }
  }
}
</script>
