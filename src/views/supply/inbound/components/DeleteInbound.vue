<template>
  <v-dialog v-model="dialogDelSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa hàng</span>
          <v-btn
            icon
            dark
            @click="dialogDelSync = false"
            style="margin-left:403px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn xóa hàng nhập này?</span
            >
            <div class="line"></div>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{
                    typeof inbound.billOfLading !== "undefined"
                      ? inbound.billOfLading.billOfLadingNumber
                      : ""
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogDelSync = false">Hủy</v-btn>
        <v-btn @click="removeInbound()" color="red">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IInbound } from "@/entity/inbound";
import { removeInbound } from "@/api/inbound";
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";

@Component
export default class DeleteInbound extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("inbounds", { type: Array }) inboundsSync!: Array<IInbound>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) inbound!: IInbound;

  async removeInbound() {
    if (this.inbound.id) {
      await removeInbound(this.inbound.id)
        .then(res => {
          console.log("response", res);
          snackbar.setSnackbar({
            text:
              "Xóa thành công hàng nhập: " +
              this.inbound.billOfLading.billOfLadingNumber,
            color: "success"
          });
        })
        .catch(err => {
          snackbar.setSnackbar({
            text: getErrorMessage(err),
            color: "error"
          });
        });
      snackbar.setDisplay(true);
      const index = this.inboundsSync.findIndex(x => x.id === this.inbound.id);
      this.inboundsSync.splice(index, 1);
      this.totalItemsSync -= 1;
      this.dialogDelSync = false;
    }
  }
}
</script>
