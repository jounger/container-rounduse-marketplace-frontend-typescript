<template>
  <v-dialog v-model="dialogConfirmSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            isAccept == true ? "Xác nhận đồng ý HSDT" : "Xác nhận từ chối HSDT"
          }}</span>
          <v-btn
            icon
            dark
            @click="dialogConfirmSync = false"
            style="margin-left:273px;"
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
              {{ isAccept == true ? "đồng ý" : "từ chối" }} HSDT này?</span
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
  @PropSync("bids", { type: Array })
  bidsSync!: Array<IBid>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @Prop(Boolean) isAccept!: boolean;
  @Prop(Object) bid!: IBid;
  dialogContract = false;
  update = false;

  reviewBid(isAccept: boolean) {
    if (isAccept) {
      this.dialogContract = true;
    } else {
      if (this.bid.id) {
        editBid(this.bid.id, {
          status: "REJECTED"
        })
          .then(res => {
            const respone = res.data;
            console.log("respone", respone);
            this.messageSync = "Từ chối thành công HSDT: " + respone.id;
            const index = this.bidsSync.findIndex(x => x.id === respone.id);
            this.bidsSync.splice(index, 1, respone);
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
}
</script>
