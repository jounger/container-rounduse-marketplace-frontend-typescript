<template>
  <v-dialog v-model="dialogAddSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Thêm mới Chứng cứ</span>
          <v-btn
            icon
            dark
            @click="dialogAddSync = false"
            style="margin-left:302px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
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
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn
          @click="updateEvidence()"
          color="primary"
          v-if="update"
          :disabled="!valid"
          >Cập nhập</v-btn
        >
        <v-btn
          @click="createEvidence()"
          color="primary"
          v-else
          :disabled="!valid"
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
import { createEvidence, editEvidence } from "@/api/evidence";
import { IContract } from "@/entity/contract";

@Component({
  mixins: [FormValidate]
})
export default class CreateEvidence extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("evidences", { type: Array }) evidencesSync!: Array<IEvidence>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @Prop(Object) contract!: IContract;

  evidenceLocal = {
    sender: this.$auth.user().username,
    evidence: "",
    isValid: false
  } as IEvidence;
  valid = false;
  createEvidence() {
    if (this.contract.id) {
      createEvidence(this.contract.id, this.evidenceLocal)
        .then(res => {
          const response: IEvidence = res.data;
          this.messageSync = "Thêm mới thành công Chứng cứ: " + response.id;
          if (this.evidencesSync) {
            this.evidencesSync.unshift(response);
          }
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
