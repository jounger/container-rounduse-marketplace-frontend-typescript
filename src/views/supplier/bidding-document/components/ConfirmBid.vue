<template>
  <v-dialog v-model="dialogConfirmSync" max-width="600px">
    <v-card>
      <CreateCombined
        :dialogAdd.sync="dialogContract"
        :dialogConfirm.sync="dialogConfirmSync"
        :numberWinner.sync="numberWinnerSync"
        :bids.sync="bidsSync"
        :bid="bid"
      />
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            isAccept == true ? "Xác nhận đồng ý HSDT" : "Xác nhận từ chối HSDT"
          }}</span>
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
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
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogConfirmSync = false">Hủy</v-btn>
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
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";

@Component({
  components: {
    CreateCombined
  }
})
export default class ConfirmBid extends Vue {
  @PropSync("dialogConfirm", { type: Boolean }) dialogConfirmSync!: boolean;
  @PropSync("bids", { type: Array })
  bidsSync!: Array<IBid>;
  @PropSync("numberWinner", { type: Number }) numberWinnerSync!: number;
  @Prop(Boolean) isAccept!: boolean;
  @Prop(Object) bid!: IBid;
  dialogContract = false;
  update = false;

  async reviewBid(isAccept: boolean) {
    if (isAccept) {
      this.dialogContract = true;
    } else {
      if (this.bid.id) {
        const _bid = await editBid(this.bid.id, {
          status: "REJECTED"
        })
          .then(res => {
            const response = res.data;
            console.log("respone", response);
            snackbar.setSnackbar({
              text: "Từ chối thành công HSDT: " + response.id,
              color: "success"
            });
            return response;
          })
          .catch(err => {
            console.log(err);
            snackbar.setSnackbar({
              text: getErrorMessage(err),
              color: "error"
            });
            return null;
          });
        if (_bid) {
          const index = this.bidsSync.findIndex(x => x.id === _bid.id);
          this.bidsSync.splice(index, 1, _bid);
          this.dialogConfirmSync = false;
        }
        snackbar.setDisplay(true);
      }
    }
  }
}
</script>
