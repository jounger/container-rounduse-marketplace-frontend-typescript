<template>
  <v-dialog v-model="dialogDelSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Đóng băng HSMT</span>
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
              >Bạn có chắc chắn muốn đóng băng HSMT này?</span
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
import { editOutbound } from "@/api/outbound";
import { IOutbound } from "../../../../entity/outbound";

@Component
export default class CancelBiddingDocument extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @Prop(Object)
  biddingDocument!: IBiddingDocument;
  @PropSync("biddingDocuments", { type: Array }) biddingDocumentsSync!: Array<
    IBiddingDocument
  >;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  freezeBiddingDocument() {
    if (
      typeof this.biddingDocument.outbound != "number" &&
      this.biddingDocument.outbound.id
    ) {
      this.biddingDocument.outbound.status = "CANCELED";
      const outbound = this.biddingDocument.outbound as IOutbound;
      editOutbound(this.biddingDocument.outbound.id, outbound)
        .then(res => {
          console.log(res.data);
          const response: IBiddingDocument = res.data;
          this.messageSync = "Đóng băng thành công HSMT: " + response.id;
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
          () => ((this.snackbarSync = true), (this.dialogDelSync = false))
        );
    }
  }
}
</script>
