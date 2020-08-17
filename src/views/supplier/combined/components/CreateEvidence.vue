<template>
  <v-dialog v-model="dialogAddSync" max-width="600">
    <v-card>
      <v-card-title class="headline">Thêm mới Chứng cứ</v-card-title>
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
                disabled
                v-model="evidenceLocal.sender"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <v-file-input
                v-model="fileInput"
                counter
                chips
                :show-size="1024"
                accept="image/png,image/jpeg,image/bmp,image/png,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                placeholder="Tải lên hợp đồng"
                label="Hợp đồng"
              ></v-file-input>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
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

  fileInput = null as Blob | null;
  evidenceLocal = {
    sender: this.$auth.user().username,
    documentPath: "",
    isValid: false
  } as IEvidence;
  valid = false;

  async createEvidence() {
    if (this.contract.id && this.fileInput) {
      const formData = new FormData();
      formData.append("file", this.fileInput);
      const _res = await createEvidence(this.contract.id, formData);
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
