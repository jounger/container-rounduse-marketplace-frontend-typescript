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
                :rules="[required('chứng cứ')]"
                v-model="evidenceLocal.evidence"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
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

@Component({
  mixins: [FormValidate]
})
export default class CreateEvidence extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("evidences", { type: Array }) evidencesSync!: Array<IEvidence>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @PropSync("checkValid", { type: Boolean }) checkValidSync!: boolean;
  @Prop(Object) contract!: IContract;

  evidenceLocal = {
    sender: this.$auth.user().username,
    evidence: "",
    isValid: false
  } as IEvidence;
  valid = false;

  async createEvidence() {
    if (this.contract.id) {
      const _res = await createEvidence(this.contract.id, this.evidenceLocal);
      if (_res.data) {
        const _evidence = _res.data.data;
        if (this.evidencesSync) {
          this.evidencesSync.unshift(_evidence);
          this.totalItemsSync += 1;
          this.checkValidSync = false;
        }
        this.dialogAddSync = false;
      }
    }
  }
}
</script>
