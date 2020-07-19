<template>
  <v-dialog v-model="dialogDelSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa HSMT</span>
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
              >Bạn có chắc chắn muốn xóa HSMT này?</span
            >
            <div class="line"></div>
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

@Component
export default class DeleteBiddingDocument extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("biddingDocuments", { type: Array }) biddingDocumentsSync!: Array<
    IBiddingDocument
  >;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object)
  biddingDocument!: IBiddingDocument;

  removeBiddingDocument() {
    if (this.biddingDocument.id) {
      removeBiddingDocument(this.biddingDocument.id)
        .then(res => {
          console.log(res.data);
          this.messageSync = "Xóa thành công HSMT: " + this.biddingDocument.id;
          const index = this.biddingDocumentsSync.findIndex(
            x => x.id === this.biddingDocument.id
          );
          this.biddingDocumentsSync.splice(index, 1);
          this.totalItemsSync -= 1;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = getErrorMessage(err);
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogDelSync = false))
        );
    }
  }
}
</script>
