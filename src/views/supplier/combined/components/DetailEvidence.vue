<template>
  <v-dialog v-model="dialogDetailSync" max-width="400">
    <v-card>
      <v-card-title class="headline">Chi tiết Chứng cứ</v-card-title>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                label="Người gửi"
                name="sender"
                prepend-icon="person"
                type="text"
                disabled
                v-model="evidence.sender.companyName"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="evidence">
            <v-col cols="12" md="8">
              <v-text-field
                label="Chứng cứ"
                name="evidence"
                prepend-icon="picture_as_pdf"
                disabled
                v-model="documentPath"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="mt-3">
              <v-btn color="primary" @click.stop="downLoad(evidence)"
                ><v-icon>cloud_download</v-icon></v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
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
    window.open(process.env.VUE_APP_ENDPOINT + item.documentPath, "_blank");
  }

  get documentPath() {
    return this.evidence
      ? this.evidence.documentPath.split("/")[4].substring(14)
      : "";
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
