<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;"
            >Cập nhập Hợp đồng</span
          ></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                label="Bên chủ hàng*"
                name="merchant"
                prepend-icon="person"
                type="text"
                readonly
                v-model="merchant"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                label="Bên chủ xe*"
                name="forwarder"
                prepend-icon="person"
                type="text"
                readonly
                v-model="forwarder"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="11">
              <v-checkbox
                v-model="contractLocal.required"
                label="Yêu cầu hợp đồng"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                v-if="contractLocal.required"
                label="% Tiền phạt*"
                name="finesAgainstContractViolations"
                prepend-icon="monetization_on"
                type="text"
                :rules="[required('finesAgainstContractViolations')]"
                v-model="contractLocal.finesAgainstContractViolations"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn @click="updateContract()" color="primary" :disabled="!valid"
          >Cập nhập</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IContract } from "@/entity/contract";
import FormValidate from "@/mixin/form-validate";
import { editContract } from "@/api/contract";
import { getErrorMessage } from "@/utils/tool";

@Component({
  mixins: [FormValidate]
})
export default class UpdateContract extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("contracts", { type: Array }) contractsSync?: Array<IContract>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("totalItems", { type: Number }) totalItemsSync?: number;
  @Prop(Object) contract?: IContract;

  contractLocal = {
    finesAgainstContractViolation: 50,
    evidence: {
      sender: this.$auth.user().username,
      evidence: "",
      isValid: false
    },
    required: false
  } as IContract;
  valid = false;
  merchant = "";
  forwarder = "";
  created() {
    this.contractLocal = Object.assign({}, this.contract);
  }
  updateContract() {
    if (this.contractLocal.id) {
      editContract(this.contractLocal.id, this.contractLocal)
        .then(res => {
          console.log(res.data);
          const response: IContract = res.data;
          this.messageSync = "Cập nhập thành công Hợp đồng: " + response.id;
          if (this.contractsSync) {
            const index = this.contractsSync.findIndex(
              x => x.id == response.id
            );
            this.contractsSync.splice(index, 1, response);
          }
        })
        .catch(err => {
          console.log(err);
          this.messageSync = getErrorMessage(err);
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
}
</script>
