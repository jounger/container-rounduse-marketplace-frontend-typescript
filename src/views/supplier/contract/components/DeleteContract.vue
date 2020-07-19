<template>
  <v-dialog v-model="dialogDelSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa hóa đơn</span>
          <v-btn
            icon
            dark
            @click="dialogDelSync = false"
            style="margin-left:383px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn xóa hóa đơn này?</span
            >
            <div class="line"></div>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ contract.id }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogDelSync = false">Hủy</v-btn>
        <v-btn @click="removeContract()" color="red">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IContract } from "@/entity/contract";
import { removeContract } from "@/api/contract";
import { getErrorMessage } from "@/utils/tool";

@Component
export default class DeleteContract extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("contracts", { type: Array }) contractsSync!: Array<IContract>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) contract!: IContract;

  removeContract() {
    if (this.contract.id) {
      removeContract(this.contract.id)
        .then(res => {
          console.log(res.data);
          this.messageSync = "Xóa thành công Hợp đồng: " + this.contract.id;
          const index = this.contractsSync.findIndex(
            x => x.id === this.contract.id
          );
          this.contractsSync.splice(index, 1);
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
