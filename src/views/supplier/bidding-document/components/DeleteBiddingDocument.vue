<template>
  <v-dialog v-model="dialogDelSync" max-width="400px">
    <v-card>
      <v-card-title class="headline">Xóa HSMT</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span>Bạn có chắc chắn muốn xóa HSMT này?</span>
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
        <v-btn @click="dialogDelSync = false">Trở về</v-btn>
        <v-btn @click="removeBiddingDocument()" color="error">Xóa bỏ</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IBiddingDocument } from "@/entity/bidding-document";
import { removeBiddingDocument } from "@/api/bidding-document";

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
      const _res = await removeBiddingDocument(this.biddingDocument.id);
      if (_res.status == 200) {
        const index = this.biddingDocumentsSync.findIndex(
          x => x.id === this.biddingDocument.id
        );
        this.biddingDocumentsSync.splice(index, 1);
        this.totalItemsSync -= 1;
        this.dialogDelSync = false;
      }
    }
  }
}
</script>
