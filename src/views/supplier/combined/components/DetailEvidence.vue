<template>
  <v-dialog v-model="dialogDetailSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Chi tiết Chứng cứ</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                label="Người gửi"
                name="sender"
                prepend-icon="person"
                type="text"
                readonly
                v-model="evidence.sender"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="evidence">
            <v-col cols="12" md="8">
              <v-text-field
                label="Chứng cứ"
                name="evidence"
                prepend-icon="picture_as_pdf"
                readonly
                v-model="evidence.documentPath.split('-')[1]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn color="primary" @click.stop="downLoad(evidence)"
                ><v-icon>cloud_download</v-icon> Tải xuống</v-btn
              >
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="11">
              <span style="color: green" v-if="evidence.isValid"
                >Đã xác nhận
              </span>
              <span style="color: red" v-else>Chưa xác nhận </span>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialogDetailSync = false">Trở về</v-btn>
        <v-btn
          @click="reviewEvidence(false)"
          color="error"
          v-if="$auth.check('ROLE_MERCHANT') && evidence.isValid == false"
          >Từ chối</v-btn
        >
        <v-btn
          @click="reviewEvidence(true)"
          color="success"
          v-if="$auth.check('ROLE_MERCHANT') && evidence.isValid == false"
          >Đồng ý</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IEvidence } from "@/entity/evidence";
import { editEvidence } from "@/api/evidence";

@Component
export default class DetailEvidence extends Vue {
  @PropSync("dialogDetail", { type: Boolean }) dialogDetailSync!: boolean;
  @PropSync("evidences", { type: Array }) evidencesSync!: Array<IEvidence>;
  @PropSync("checkValid", { type: Boolean }) checkValidSync!: boolean;
  @Prop(Object) evidence!: IEvidence;
  @Prop(Boolean) finalEvidence!: boolean;

  downLoad(item: IEvidence) {
    window.open("http://localhost:8085" + item.documentPath, "_blank");
  }

  async reviewEvidence(isValid: boolean) {
    if (this.evidence.id) {
      const _res = await editEvidence(this.evidence.id, {
        isValid: isValid
      });
      if (_res.data) {
        const _evidence = _res.data.data;
        const index = this.evidencesSync.findIndex(x => x.id == _evidence.id);
        this.evidencesSync.splice(index, 1, _evidence);
        if (this.finalEvidence && _evidence.isValid) {
          this.checkValidSync = true;
        }
        this.dialogDetailSync = false;
      }
    }
  }
}
</script>
