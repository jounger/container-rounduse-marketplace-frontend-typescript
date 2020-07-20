<template>
  <v-dialog v-model="dialogDelSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa hãng tàu</span>
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn xóa hãng tàu này?</span
            >
            <v-divider class="mt-3"></v-divider>
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
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogDelSync = false">Hủy</v-btn>
        <v-btn @click="removeShippingLine()" color="error">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IShippingLine } from "@/entity/shipping-line";
import { removeShippingLine } from "@/api/shipping-line";
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";

@Component
export default class DeleteShippingLine extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("shippingLines", { type: Array }) shippingLinesSync!: Array<
    IShippingLine
  >;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) shippingLine!: IShippingLine;

  async removeShippingLine() {
    if (this.shippingLine.id) {
      await removeShippingLine(this.shippingLine.id)
        .then(res => {
          console.log(res.data);
          snackbar.setSnackbar({
            text: "Xóa thành công hãng tàu: " + this.shippingLine.companyCode,
            color: "success"
          });
          const index = this.shippingLinesSync.findIndex(
            x => x.id === this.shippingLine.id
          );
          this.shippingLinesSync.splice(index, 1);
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
