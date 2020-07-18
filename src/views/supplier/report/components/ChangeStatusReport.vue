<template>
  <v-dialog v-model="dialogConfirmSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;"
            >Thay đổi trạng thái Report</span
          >
          <v-btn
            icon
            dark
            @click="dialogConfirmSync = false"
            style="margin-left:243px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn
              {{
                status == "RESOLVED" || status == "CLOSED" ? "đóng" : "từ chối"
              }}
              Report này?</span
            >
            <div class="line"></div>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ report.id }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogConfirmSync = false">Hủy</v-btn>
        <v-btn @click="changeStatusReport()" class="primary">Đồng ý</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IReport } from "@/entity/report";
import { editReport } from "@/api/report";

@Component
export default class DeleteReport extends Vue {
  @PropSync("dialogConfirm", { type: Boolean }) dialogConfirmSync!: boolean;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("reports", { type: Array }) reportsSync!: Array<IReport>;
  @Prop(Object) report!: IReport;
  @Prop(String) status!: string;

  removeReport() {
    if (this.report.id) {
      editReport(this.report.id, { status: this.status })
        .then(res => {
          console.log(res.data);
          const response = res.data;
          this.messageSync =
            "Thay đổi trạng thái thành công Report: " + response.id;
          const index = this.reportsSync.findIndex(x => x.id === response.id);
          this.reportsSync.splice(index, 1, response);
          this.dialogConfirmSync = false;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
}
</script>
