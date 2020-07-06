<template>
  <v-dialog v-model="dialogDelSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa hãng tàu</span>
          <v-btn
            icon
            dark
            @click="dialogDelSync = false"
            style="margin-left:379px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn xóa hãng tàu này?</span
            >
            <div class="line"></div>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{
                    shippingLine.companyCode
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
        <v-btn @click="removeShippingLine()" color="red">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IShippingLine } from "@/entity/shipping-line";
import { removeShippingLine } from "@/api/shipping-line";

@Component
export default class DeleteShippingLine extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("shippingLines", { type: Array }) shippingLinesSync!: Array<
    IShippingLine
  >;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) shippingLine!: IShippingLine;

  removeShippingLine() {
    if (this.shippingLine.id) {
      removeShippingLine(this.shippingLine.id)
        .then(res => {
          console.log(res.data);
          this.messageSync =
            "Xóa thành công hãng tàu: " + this.shippingLine.companyCode;
          const index = this.shippingLinesSync.findIndex(
            x => x.id === this.shippingLine.id
          );
          this.shippingLinesSync.splice(index, 1);
          this.totalItemsSync -= 1;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Error happend";
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogDelSync = false))
        );
    }
  }
}
</script>
