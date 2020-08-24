<template>
  <v-dialog v-model="dialogReviewSync" max-width="400">
    <v-card tile>
      <v-card-title class="headline">{{
        operator.status == "ACTIVE" ? "Khóa tài khoản" : "Mở khóa tài khoản"
      }}</v-card-title>

      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                label="Tên đăng nhập"
                name="username"
                prepend-icon="mdi-account"
                type="text"
                v-model="operator.username"
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogReviewSync = false">Trở về</v-btn>
        <v-btn
          @click="reviewOperator('BANNED')"
          color="error"
          v-if="operator.status == 'ACTIVE'"
          >Khóa tài khoản</v-btn
        >
        <v-btn
          @click="reviewOperator('ACTIVE')"
          color="success"
          v-if="operator.status == 'BANNED'"
          >Mở khóa</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IOperator } from "@/entity/operator";
import { editOperator } from "@/api/operator";

@Component
export default class ReviewOperator extends Vue {
  @PropSync("dialogReview", { type: Boolean }) dialogReviewSync!: boolean;
  @PropSync("operators", { type: Array }) operatorsSync!: Array<IOperator>;
  @Prop(Object) operator!: IOperator;

  reason = "";
  async reviewOperator(status: string) {
    if (this.operator.id) {
      const _res = await editOperator(this.operator.id, {
        status: status
      });
      if (_res.data) {
        const _operator = _res.data.data;
        const index = this.operatorsSync.findIndex(x => x.id == _operator.id);
        this.operatorsSync.splice(index, 1, _operator);
        this.dialogReviewSync = false;
      }
    }
  }
}
</script>
