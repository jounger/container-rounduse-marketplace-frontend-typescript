<template>
  <v-dialog v-model="dialogAddSync" max-width="600">
    <v-card>
      <v-card-title class="headline">Tải lên file hợp đồng</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                label="Người gửi*"
                name="sender"
                prepend-icon="person"
                type="text"
                disabled
                v-model="contractDocumentLocal.sender"
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
        <v-btn
          @click="createContractDocument()"
          color="primary"
          :disabled="!valid"
          >Gửi hợp đồng</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IContractDocument } from "@/entity/contract-document";
import FormValidate from "@/mixin/form-validate";
import { createContractDocument } from "@/api/contract-document";
import { IContract } from "@/entity/contract";

@Component({
  mixins: [FormValidate]
})
export default class CreateContractDocument extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("contractDocuments", { type: Array }) contractDocumentsSync!: Array<
    IContractDocument
  >;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @PropSync("checkValid", { type: Boolean }) checkValidSync!: boolean;
  @Prop(Object) contract!: IContract;

  fileInput = null as Blob | null;
  contractDocumentLocal = {
    sender: this.$auth.user().fullname,
    documentPath: "",
    status: "PENDING"
  } as IContractDocument;
  valid = false;

  async createContractDocument() {
    if (this.contract.id && this.fileInput) {
      const formData = new FormData();
      formData.append("file", this.fileInput);
      const _res = await createContractDocument(this.contract.id, formData);
      if (_res.data) {
        const _contractDocument = _res.data.data;
        if (this.contractDocumentsSync) {
          this.contractDocumentsSync.unshift(_contractDocument);
          this.totalItemsSync += 1;
          this.checkValidSync = false;
        }
        this.dialogAddSync = false;
      }
    }
  }
}
</script>
