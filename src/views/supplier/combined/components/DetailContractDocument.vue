<template>
  <v-dialog v-model="dialogDetailSync" max-width="400">
    <v-card>
      <v-card-title class="headline">Chi tiết file Hợp đồng</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                label="Bên gửi"
                name="sender"
                prepend-icon="person"
                type="text"
                disabled
                v-model="contractDocument.sender.companyName"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="contractDocument">
            <v-col cols="12" md="8">
              <v-text-field
                label="File Hợp đồng"
                name="contractDocument"
                prepend-icon="picture_as_pdf"
                disabled
                v-model="documentPath"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4" class="mt-3">
              <v-btn color="primary" @click.stop="downLoad(contractDocument)"
                ><v-icon>cloud_download</v-icon></v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogDetailSync = false">Trở về</v-btn>
        <v-btn
          @click="reviewContractDocument(false)"
          color="error"
          v-if="
            $auth.check('ROLE_MERCHANT') && contractDocument.status == 'PENDING'
          "
          >Từ chối</v-btn
        >
        <v-btn
          @click="reviewContractDocument(true)"
          color="success"
          v-if="
            $auth.check('ROLE_MERCHANT') && contractDocument.status == 'PENDING'
          "
          >Đồng ý</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IContractDocument } from "@/entity/contract-document";
import { editContractDocument } from "@/api/contract-document";

@Component
export default class DetailContractDocument extends Vue {
  @PropSync("dialogDetail", { type: Boolean }) dialogDetailSync!: boolean;
  @PropSync("contractDocuments", { type: Array }) contractDocumentsSync!: Array<
    IContractDocument
  >;
  @Prop(Object) contractDocument!: IContractDocument;
  @Prop(Boolean) finalContractDocument!: boolean;

  downLoad(item: IContractDocument) {
    window.open(process.env.VUE_APP_ENDPOINT + item.documentPath, "_blank");
  }

  get documentPath() {
    return this.contractDocument
      ? this.contractDocument.documentPath.split("/")[4].substring(14)
      : "";
  }

  async reviewContractDocument(status: boolean) {
    if (this.contractDocument) {
      const _res = await editContractDocument(
        this.contractDocument.id as number,
        {
          status: status ? "ACCEPTED" : "REJECTED"
        }
      );
      if (_res.data) {
        const _contractDocument = _res.data.data;
        const index = this.contractDocumentsSync.findIndex(
          x => x.id === _contractDocument.id
        );
        this.contractDocumentsSync.splice(index, 1, _contractDocument);
        this.dialogDetailSync = false;
      }
    }
  }
}
</script>
