<template>
  <v-dialog v-model="dialogCancelSync" max-width="400">
    <v-card>
      <v-card-title class="headline">Hủy bỏ HSMT</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span>Bạn có chắc chắn muốn hủy HSMT này?</span>
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
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogCancelSync = false">Trở về</v-btn>
        <v-btn @click="cancelBiddingDocument()" color="error">Hủy bỏ</v-btn>
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
  @Prop(Object) biddingDocument!: IBiddingDocument;
  @PropSync("biddingDocuments", { type: Array })
  biddingDocumentsSync?: IBiddingDocument[];

  async cancelBiddingDocument() {
    if (this.biddingDocument.id) {
      const _res = await editBiddingDocument(this.biddingDocument.id, {
        status: "CANCELED"
      });
      if (_res.data) {
        const _biddingDocument = _res.data.data;
        if (this.biddingDocumentsSync) {
          const index = this.biddingDocumentsSync.findIndex(
            x => x.id === _biddingDocument.id
          );
          this.biddingDocumentsSync.splice(index, 1, _biddingDocument);
        }
        this.dialogCancelSync = false;
      }
    }
  }
}
</script>
