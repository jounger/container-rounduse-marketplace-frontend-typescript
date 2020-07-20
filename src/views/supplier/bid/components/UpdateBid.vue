<template>
  <v-dialog
    v-model="dialogEditSync"
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogEditSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Chỉnh sửa HSDT</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialogEditSync = false">Trở về</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-list three-line subheader>
        <v-stepper v-model="stepper" vertical>
          <v-stepper-step :complete="stepper > 1" step="1" :editable="editable">
            Thông tin HSDT
            <small>Thông tin chung</small>
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-form ref="bidForm" v-model="valid" lazy-validation>
              <v-text-field
                v-model="bidLocal.bidPrice"
                :hint="currencyFormatter(bidLocal.bidPrice)"
                prepend-icon="monetization_on"
                type="number"
                :rules="[
                  minNumber('bid price', biddingDocumentSync.bidFloorPrice + 1)
                ]"
                label="Giá gửi thầu"
              ></v-text-field>
              <!-- <v-text-field
                label="Label Text"
                value="12:30:00"
                type="time"
                suffix="PST"
              ></v-text-field> -->
              <v-btn
                color="primary"
                @click="
                  updateBid();
                  valid = false;
                "
                :disabled="!valid"
                >Hoàn tất</v-btn
              >
            </v-form>
          </v-stepper-content>
        </v-stepper>
      </v-list>
      <!-- END CONTENT -->
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IBid } from "@/entity/bid";
import FormValidate from "@/mixin/form-validate";
import { IBiddingDocument } from "@/entity/bidding-document";
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";
import { editBid } from "@/api/bid";

@Component({
  mixins: [FormValidate]
})
export default class UpdateBid extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @Prop(Object) bid!: IBid;
  @PropSync("bids", { type: Array }) bidsSync!: Array<IBid>;
  @PropSync("biddingDocument", { type: Object })
  biddingDocumentSync!: IBiddingDocument;
  // Form validate
  editable = true;
  loading = true;
  stepper = 1;
  valid = true;
  bidLocal = {} as IBid;
  created() {
    this.bidLocal = Object.assign({}, this.bid);
  }
  // Bid Update
  async updateBid() {
    if (this.bidLocal.id) {
      const _bid = await editBid(this.bidLocal.id, this.bidLocal)
        .then(res => {
          console.log(res.data);
          const response: IBid = res.data;
          snackbar.setSnackbar({
            text: "Cập nhập thành công HSDT: " + response.id,
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
        const index = this.bidsSync.findIndex(x => x.id == _bid.id);
        this.bidsSync.splice(index, 1, _bid);
      }
      snackbar.setDisplay(true);
    }
  }
}
</script>
