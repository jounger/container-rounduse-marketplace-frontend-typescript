<template>
  <v-dialog v-model="dialogReviewSync" max-width="400">
    <v-card tile>
      <v-card-title class="headline">{{
        supplier.status == "ACTIVE" ? "Khóa tài khoản" : "Mở khóa tài khoản"
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
                v-model="supplier.username"
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogReviewSync = false">Trở về</v-btn>
        <v-btn
          @click="reviewSupplier('BANNED')"
          color="error"
          v-if="supplier.status == 'ACTIVE'"
          >Khóa tài khoản</v-btn
        >
        <v-btn
          @click="reviewSupplier('ACTIVE')"
          color="success"
          v-if="supplier.status == 'BANNED'"
          >Mở khóa</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { ISupplier } from "@/entity/supplier";
import { reviewSupplier } from "@/api/supplier";

@Component
export default class ReviewSupplier extends Vue {
  @PropSync("dialogReview", { type: Boolean }) dialogReviewSync!: boolean;
  @PropSync("suppliers", { type: Array }) suppliersSync!: Array<ISupplier>;
  @Prop(Object) supplier!: ISupplier;

  reason = "";
  async reviewSupplier(status: string) {
    if (this.supplier.id) {
      const _res = await reviewSupplier(this.supplier.id, {
        status: status
      });
      if (_res.data) {
        const _supplier = _res.data.data;
        const index = this.suppliersSync.findIndex(x => x.id == _supplier.id);
        this.suppliersSync.splice(index, 1, _supplier);
        this.dialogReviewSync = false;
      }
    }
  }
}
</script>
