<template>
  <v-dialog v-model="dialogAddSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhập Hợp đồng" : "Thêm mới Hợp đồng"
          }}</span>
          <v-btn
            icon
            dark
            @click="dialogAddSync = false"
            style="margin-left:308px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Người gửi*"
                name="sender"
                prepend-icon="person"
                type="text"
                :readonly="update"
                :counter="20"
                :rules="[minLength('sender', 5), maxLength('sender', 20)]"
                v-model="contractLocal.evidence.sender"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="% Tiền phạt*"
                name="finesAgainstContractViolations"
                prepend-icon="monetization_on"
                type="text"
                :rules="[required('finesAgainstContractViolations')]"
                v-model="contractLocal.finesAgainstContractViolations"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs9>
              <v-text-field
                label="Chứng cớ*"
                name="evidence"
                prepend-icon="description"
                type="text"
                :rules="[required('evidence')]"
                v-model="contractLocal.evidence.evidence"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn
          @click="updateContract()"
          color="primary"
          v-if="update"
          :disabled="!valid"
          >Cập nhập</v-btn
        >
        <v-btn
          @click="createContract()"
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
import { IContract } from "@/entity/contract";
import FormValidate from "@/mixin/form-validate";
import { createContract, editContract } from "@/api/contract";

@Component({
  mixins: [FormValidate]
})
export default class CreateContract extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("contracts", { type: Array }) contractsSync?: Array<IContract>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("totalItems", { type: Number }) totalItemsSync?: number;
  @Prop(Object) contract?: IContract;
  @Prop(Boolean) update!: boolean;

  contractLocal = {
    finesAgainstContractViolations: 50,
    evidence: {
      sender: this.$auth.user().username,
      evidence: "",
      isValid: false
    },
    required: false
  } as IContract;
  valid = false;
  contractDatePicker = false;
  created() {
    if (this.update) {
      this.contractLocal = Object.assign({}, this.contract);
    }
  }
  createContract() {
    if (this.contractLocal) {
      createContract(this.contractLocal)
        .then(res => {
          const response: IContract = res.data;
          this.messageSync = "Thêm mới thành công Hợp đồng: " + response.id;
          if (this.contractsSync) {
            this.contractsSync.unshift(response);
          }
          if (this.totalItemsSync) {
            this.totalItemsSync += 1;
          }
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
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
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
}
</script>
