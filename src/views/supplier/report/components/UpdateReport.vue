<template>
  <v-dialog v-model="dialogEditSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Cập nhập Report</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <!-- <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                label="Người gửi*"
                name="sender"
                prepend-icon="person"
                type="text"
                readonly
                v-model="reportLocal.sender"
              ></v-text-field>
            </v-col>
          </v-row> -->
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Tiêu đề*"
                name="title"
                prepend-icon="menu"
                type="text"
                :counter="20"
                :rules="[minLength('title', 5), maxLength('title', 100)]"
                v-model="reportLocal.title"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-textarea
                outlined
                label="Nội dung*"
                name="detail"
                prepend-icon="description"
                type="text"
                :counter="200"
                :rules="[minLength('detail', 5), maxLength('detail', 200)]"
                v-model="reportLocal.detail"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialogEditSync = false">Trở về</v-btn>
        <v-btn @click="updateReport()" color="primary" :disabled="!valid"
          >Cập nhập</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IReport } from "@/entity/report";
import FormValidate from "@/mixin/form-validate";
import { editReport } from "@/api/report";

@Component({
  mixins: [FormValidate]
})
export default class CreateReport extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @PropSync("reports", { type: Array }) reportsSync!: Array<IReport>;
  @Prop(Object) report!: IReport;

  reportLocal = null as IReport | null;
  valid = false;
  created() {
    this.reportLocal = Object.assign({}, this.report);
  }
  async updateReport() {
    if (this.reportLocal && this.reportLocal.id) {
      const _report = await editReport(this.reportLocal.id, this.reportLocal);
      if (_report.data) {
        const index = this.reportsSync.findIndex(x => x.id == _report.data.id);
        this.reportsSync.splice(index, 1, _report.data);
      }
    }
  }
}
</script>
