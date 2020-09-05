<template>
  <v-dialog v-model="dialogAddSync" max-width="600">
    <v-card>
      <v-card-title class="headline"
        >{{ readonly ? "Thông tin" : "Cập nhật" }} Hợp đồng</v-card-title
      >
      <v-divider></v-divider>
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
                disabled
                v-model="combined.contract.sender.companyName"
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
                disabled
                v-model="combined.bid.bidder.companyName"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="11">
              <v-checkbox
                v-model="contractLocal.required"
                :disabled="readonly"
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
                :rules="[
                  required('% tiền phạt'),
                  minNumber('% tiền phạt', 0),
                  maxNumber('% tiền phạt', 8)
                ]"
                :hint="contractLocal.finesAgainstContractViolations + '%'"
                v-model="contractLocal.finesAgainstContractViolations"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn
          @click="updateContract()"
          color="primary"
          :disabled="!valid"
          v-if="!readonly"
          >Cập nhật</v-btn
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
import { ICombined } from "@/entity/combined";

@Component({
  mixins: [FormValidate]
})
export default class UpdateContract extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("contract", { type: Object }) contractSync!: IContract;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("totalItems", { type: Number }) totalItemsSync?: number;
  @Prop(Boolean) readonly!: boolean;
  @Prop(String) merchant!: string;
  @Prop(Object) combined!: ICombined;

  contractLocal = null as IContract | null;
  valid = false;

  created() {
    if (this.contractSync) {
      this.contractLocal = Object.assign({}, this.contractSync);
    }
  }

  async updateContract() {
    if (this.contractLocal) {
      const _res = await editContract(
        this.contractSync.id as number,
        this.contractLocal
      );
      if (_res.data) {
        const _contract = _res.data.data;
        this.contractSync = _contract;
      }
    }
  }
}
</script>
