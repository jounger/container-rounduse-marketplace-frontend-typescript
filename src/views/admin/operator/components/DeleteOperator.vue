<template>
  <v-dialog v-model="dialogDelSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa quản trị viên</span>
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
              >Bạn có chắc chắn muốn xóa quản trị viên này?</span
            >
            <div class="line"></div>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{
                    operatorSync.username
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
        <v-btn @click="removeOperator()" color="red">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { IOperator } from "@/entity/operator";
import { removeOperator } from "@/api/operator";

@Component
export default class DeleteOperator extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("operator", { type: Object }) operatorSync!: IOperator;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("operators", { type: Array }) operatorsSync!: Array<IOperator>;

  removeOperator() {
    if (this.operatorSync.id) {
      removeOperator(this.operatorSync.id)
        .then(res => {
          console.log(res.data);
          const response: IOperator = res.data;
          this.operatorSync = response;
          this.messageSync =
            "Xóa thành công quản trị viên: " + this.operatorSync.username;
          const index = this.operatorsSync.findIndex(
            x => x.id === this.operatorSync.id
          );
          this.operatorsSync.splice(index, 1);
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
