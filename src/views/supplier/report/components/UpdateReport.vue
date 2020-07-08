<template>
  <v-dialog v-model="dialogEditSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Cập nhập Report</span>
          <v-btn
            icon
            dark
            @click="dialogEditSync = false"
            style="margin-left:337px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Người gửi*"
                name="sender"
                prepend-icon="person"
                type="text"
                readonly
                :counter="20"
                :rules="[minLength('sender', 5), maxLength('sender', 20)]"
                v-model="reportLocal.sender"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Tiêu đề*"
                name="title"
                prepend-icon="menu"
                type="text"
                :counter="20"
                :rules="[minLength('title', 5), maxLength('title', 20)]"
                v-model="reportLocal.title"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Nội dung*"
                name="detail"
                prepend-icon="description"
                type="text"
                :counter="50"
                :rules="[minLength('detail', 5), maxLength('detail', 50)]"
                v-model="reportLocal.detail"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
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
// import { createReport, updateReport } from "@/api/report";

@Component({
  mixins: [FormValidate]
})
export default class CreateReport extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @PropSync("reports", { type: Array }) reportsSync!: Array<IReport>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @Prop(Object) report!: IReport;

  reportLocal = {} as IReport;
  valid = false;
  created() {
    this.reportLocal = Object.assign({}, this.report);
  }
  updateReport() {
    if (this.reportLocal.id) {
      // updateReport(this.reportLocal)
      //   .then(res => {
      //     console.log(res.data);
      //     const response: IReport = res.data;
      //     this.messageSync = "Cập nhập thành công Phản hồi: " + response.id;
      //     const index = this.reportsSync.findIndex(x => x.id == response.id);
      //     this.reportsSync.splice(index, 1, response);
      //   })
      //   .catch(err => {
      //     console.log(err);
      //     this.messageSync = "Đã có lỗi xảy ra";
      //   })
      //   .finally(() => (this.snackbarSync = true));
      this.messageSync = "Cập nhập thành công Report: " + this.reportLocal.id;
      const index = this.reportsSync.findIndex(
        x => x.id == this.reportLocal.id
      );
      this.reportsSync.splice(index, 1, this.reportLocal);

      this.snackbarSync = true;
    }
  }
}
</script>
