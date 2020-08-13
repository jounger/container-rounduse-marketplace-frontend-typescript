<template>
  <v-dialog v-model="dialogConfirmSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;"
            >Thay đổi trạng thái Report</span
          ></v-toolbar-title
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
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{ reportSync.id }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
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
  @PropSync("report", { type: Object }) reportSync!: IReport;
  @Prop(String) status!: string;

  async changeStatusReport() {
    if (this.reportSync.id) {
      const _res = await editReport(this.reportSync.id, {
        status: this.status
      });
      if (_res.data) {
        const _report = _res.data.data;
        this.reportSync = _report;
        this.dialogConfirmSync = false;
      }
    }
  }
}
</script>
