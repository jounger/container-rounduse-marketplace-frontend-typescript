<template>
  <v-dialog v-model="dialogStatusSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Chấm điểm Feedback</span>
          <v-btn
            icon
            dark
            @click="dialogStatusSync = false"
            style="margin-left:288px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <v-layout row>
            <v-flex xs9>
              <v-select
                v-model="reportStatus"
                name="status"
                prepend-icon="security"
                :items="status"
                label="Trạng thái*"
                :rules="[required('role')]"
              ></v-select>
            </v-flex>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogStatusSync = false">Trở về</v-btn>
        <v-btn @click="changeStatusReport()" color="primary" :disabled="!valid"
          >Đặt trạng thái</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import FormValidate from "@/mixin/form-validate";
import { IReport } from "@/entity/report";
import { editReport } from "@/api/report";

@Component({
  mixins: [FormValidate]
})
export default class ChangeStatusReport extends Vue {
  @PropSync("dialogStatus", { type: Boolean }) dialogStatusSync!: boolean;
  @PropSync("reports", { type: Array }) reportsSync!: Array<IReport>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @Prop(Object) report!: IReport;
  @Prop(Boolean) update!: boolean;

  reportStatus = this.report.status;
  status: Array<string> = [];
  valid = false;
  created() {
    this.status = ["PENDING", "RESOLVED", "REJECTED", "UPDATED", "CLOSED"];
  }
  changeStatusReport() {
    if (this.report.id) {
      editReport(this.report.id, {
        status: this.reportStatus
      })
        .then(res => {
          console.log(res.data);
          const response: IReport = res.data;
          this.messageSync =
            "Thay đổi trạng thái thành công Report: " + response.id;
          const index = this.reportsSync.findIndex(x => x.id == response.id);
          this.reportsSync.splice(index, 1, response);
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
