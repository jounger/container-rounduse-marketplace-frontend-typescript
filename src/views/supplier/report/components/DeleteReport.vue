<template>
  <v-dialog v-model="dialogDelSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Xóa Report</span>
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn xóa Report này?</span
            >
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ report.id }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogDelSync = false">Hủy</v-btn>
        <v-btn @click="removeReport()" color="error">Xóa</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IReport } from "@/entity/report";
import { removeReport } from "@/api/report";
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";

@Component
export default class DeleteReport extends Vue {
  @PropSync("dialogDel", { type: Boolean }) dialogDelSync!: boolean;
  @PropSync("reports", { type: Array }) reportsSync!: Array<IReport>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) report!: IReport;

  async removeReport() {
    if (this.report.id) {
      await removeReport(this.report.id)
        .then(res => {
          console.log(res.data);
          snackbar.setSnackbar({
            text: "Xóa thành công Report: " + this.report.id,
            color: "success"
          });
          const index = this.reportsSync.findIndex(
            x => x.id === this.report.id
          );
          this.reportsSync.splice(index, 1);
          this.totalItemsSync -= 1;
          this.dialogDelSync = false;
        })
        .catch(err => {
          console.log(err);
          snackbar.setSnackbar({
            text: getErrorMessage(err),
            color: "error"
          });
          return null;
        });
      snackbar.setDisplay(true);
    }
  }
}
</script>
