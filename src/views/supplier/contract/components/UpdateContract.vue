<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;"
            >{{ readonly ? "Thông tin" : "Cập nhập" }} Hợp đồng</span
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
                v-model="combined.bid.bidder"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="11">
              <v-checkbox
                v-model="contractLocal.required"
                :readonly="readonly"
                label="Yêu cầu hợp đồng"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                v-if="contractLocal.required"
                readonly
                label="% Tiền phạt*"
                name="finesAgainstContractViolation"
                prepend-icon="monetization_on"
                type="text"
                :rules="[required('phần trăm tiền phạt')]"
                v-model="contractLocal.finesAgainstContractViolation"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn
          @click="updateContract()"
          color="primary"
          :disabled="!valid"
          v-if="!readonly"
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

  contractLocal = {} as IContract;
  valid = false;
  created() {
    if (typeof this.contractSync != "undefined") {
      this.contractLocal = Object.assign({}, this.contractSync);
    }
  }
  async updateContract() {
    if (this.contractLocal.id) {
      const _contract = await editContract(
        this.contractLocal.id,
        this.contractLocal
      );
      if (_contract.data) {
        // TODO
      }
    }
  }
}
</script>
