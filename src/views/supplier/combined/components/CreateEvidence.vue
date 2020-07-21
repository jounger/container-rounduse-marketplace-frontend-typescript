<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Thêm mới Chứng cứ</span>
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                label="Người gửi*"
                name="sender"
                prepend-icon="person"
                type="text"
                readonly
                :counter="20"
                :rules="[minLength('sender', 5), maxLength('sender', 20)]"
                v-model="evidenceLocal.sender"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                label="Chứng cứ*"
                name="evidence"
                prepend-icon="description"
                type="text"
                :rules="[required('evidence')]"
                v-model="evidenceLocal.evidence"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn @click="createEvidence()" color="primary" :disabled="!valid"
          >Thêm mới</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IEvidence } from "@/entity/evidence";
import FormValidate from "@/mixin/form-validate";
import { createEvidence } from "@/api/evidence";
import { IContract } from "@/entity/contract";
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";

@Component({
  mixins: [FormValidate]
})
export default class CreateEvidence extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("evidences", { type: Array }) evidencesSync!: Array<IEvidence>;
  @Prop(Object) contract!: IContract;

  evidenceLocal = {
    sender: this.$auth.user().username,
    evidence: "",
    isValid: false
  } as IEvidence;
  valid = false;
  async createEvidence() {
    if (this.contract.id) {
      const _evidence = await createEvidence(
        this.contract.id,
        this.evidenceLocal
      )
        .then(res => {
          const response: IEvidence = res.data;
          snackbar.setSnackbar({
            text: "Thêm mới thành công Chứng cứ: " + response.id,
            color: "success"
          });
          return response;
        })
        .catch(err => {
          console.log(err);
          snackbar.setSnackbar({
            text: getErrorMessage(err),
            color: "error"
          });
          return null;
        });
      if (_evidence) {
        if (this.evidencesSync) {
          this.evidencesSync.unshift(_evidence);
        }
        this.dialogAddSync = false;
      }
      snackbar.setDisplay(true);
    }
  }
}
</script>
