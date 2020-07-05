<template>
  <v-dialog v-model="dialogCancelSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Hủy HSMT</span>
          <v-btn
            icon
            dark
            @click="dialogCancelSync = false"
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
              >Bạn có chắc chắn muốn hủy HSMT này?</span
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
        <v-btn @click="dialogCancelSync = false">Trở về</v-btn>
        <v-btn @click="cancelBiddingDocument()" color="red"
          ><span style="color:white;">Hủy thầu</span></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IBiddingDocument } from "@/entity/bidding-document";
import { editBiddingDocument } from "@/api/bidding-document";

@Component
export default class CancelBiddingDocument extends Vue {
  @PropSync("dialogCancel", { type: Boolean }) dialogCancelSync!: boolean;
  @Prop(Object)
  biddingDocument!: IBiddingDocument;
  @PropSync("biddingDocuments", { type: Array }) biddingDocumentsSync!: Array<
    IBiddingDocument
  >;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  cancelBiddingDocument() {
    if (this.biddingDocument.id) {
      editBiddingDocument(this.biddingDocument.id, {
        status: "CANCELED"
      })
        .then(res => {
          console.log(res.data);
          const response: IBiddingDocument = res.data;
          this.messageSync = "Hủy thầu thành công HSMT: " + response.id;
          const index = this.biddingDocumentsSync.findIndex(
            x => x.id === response.id
          );
          this.biddingDocumentsSync.splice(index, 1, response);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogCancelSync = false))
        );
    }
  }
}
</script>
