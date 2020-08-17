<template>
  <v-dialog v-model="dialogEditSync" max-width="600">
    <v-card>
      <v-card-title class="headline">Cập nhật Report</v-card-title>
      <v-card-text>
        <v-form v-model="valid" validation>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Tiêu đề*"
                name="title"
                prepend-icon="menu"
                type="text"
                :counter="100"
                :rules="[
                  minLength('Tiêu đề Report', 5),
                  maxLength('Tiêu đề Report', 100)
                ]"
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
                :rules="[
                  minLength('Nội dung Report', 5),
                  maxLength('Nội dung Report', 200)
                ]"
                v-model="reportLocal.detail"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogEditSync = false">Trở về</v-btn>
        <v-btn @click="updateReport()" color="primary" :disabled="!valid"
          >Cập nhật</v-btn
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
      const _res = await editReport(this.reportLocal.id, this.reportLocal);
      if (_res.data) {
        const _report = _res.data.data;
        const index = this.reportsSync.findIndex(x => x.id == _report.id);
        this.reportsSync.splice(index, 1, _report);
      }
    }
  }
}
</script>
