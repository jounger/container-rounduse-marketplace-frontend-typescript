<template>
  <v-dialog v-model="dialogCancelSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Hủy HSDT</span>
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn hủy HSDT này?</span
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
        <v-btn @click="dialogCancelSync = false">Trở về</v-btn>
        <v-btn @click="cancelBid()" color="error">Hủy thầu</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IBid } from "@/entity/bid";
import { editBid } from "@/api/bid";
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";

@Component
export default class CancelBid extends Vue {
  @PropSync("dialogCancel", { type: Boolean }) dialogCancelSync!: boolean;
  @Prop(Object)
  bid!: IBid;
  @PropSync("bids", { type: Array }) bidsSync!: Array<IBid>;

  async cancelBid() {
    if (this.bid.id) {
      const _bid = await editBid(this.bid.id, {
        status: "CANCELED"
      })
        .then(res => {
          console.log(res.data);
          const response: IBid = res.data;
          snackbar.setSnackbar({
            text: "Hủy thầu thành công HSDT: " + response.id,
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
        this.dialogCancelSync = false;
      }
      snackbar.setDisplay(true);
    }
  }
}
</script>
