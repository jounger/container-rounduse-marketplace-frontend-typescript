<template>
  <v-dialog v-model="dialogDelSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa HSMT</span>
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn xóa HSMT này?</span
            >
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{
                    typeof biddingDocument.id !== "undefined"
                      ? biddingDocument.id
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
        <v-btn @click="removeBiddingDocument()" color="red">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IBiddingDocument } from "@/entity/bidding-document";
import { removeBiddingDocument } from "@/api/bidding-document";
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";

@Component
export default class DeleteBiddingDocument extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("biddingDocuments", { type: Array }) biddingDocumentsSync!: Array<
    IBiddingDocument
  >;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object)
  biddingDocument!: IBiddingDocument;

  async removeBiddingDocument() {
    if (this.biddingDocument.id) {
      await removeBiddingDocument(this.biddingDocument.id)
        .then(res => {
          console.log(res.data);
          snackbar.setSnackbar({
            text: "Xóa thành công HSMT: " + this.biddingDocument.id,
            color: "success"
          });
          const index = this.biddingDocumentsSync.findIndex(
            x => x.id === this.biddingDocument.id
          );
          this.biddingDocumentsSync.splice(index, 1);
          this.totalItemsSync -= 1;
          this.dialogDelSync = false;
        })
        .catch(err => {
          console.log(err);
          snackbar.setSnackbar({
            text: getErrorMessage(err),
            color: "error"
          });
        });
      snackbar.setDisplay(true);
    }
  }
}
</script>
