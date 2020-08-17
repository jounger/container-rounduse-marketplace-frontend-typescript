<template>
  <v-dialog v-model="dialogConfirmSync" max-width="400">
    <v-card>
      <v-card-title class="headline">{{
        status ? "Xác nhận đồng ý đơn đăng ký" : "Xác nhận từ chối đơn đăng ký"
      }}</v-card-title>

      <v-card-text>
        <v-form>
          <v-container>
            <span
              >Bạn có chắc chắn muốn
              {{ status ? "đồng ý" : "từ chối" }}
              tài khoản này?</span
            >
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{
                    supplierSync.companyName
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogConfirmSync = false">Trở về</v-btn>
        <v-btn @click="reviewSupplier()" color="success" v-if="status"
          >Đồng ý</v-btn
        >
        <v-btn @click="reviewSupplier()" color="error" v-else>Từ chối</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { ISupplier } from "@/entity/supplier";
import { reviewSupplier } from "@/api/supplier";

@Component
export default class ConfirmReviewSupplier extends Vue {
  @PropSync("dialogConfirm", { type: Boolean }) dialogConfirmSync!: boolean;
  @PropSync("dialogDetail", { type: Boolean }) dialogDetailSync!: boolean;
  @PropSync("supplier", { type: Object }) supplierSync!: ISupplier;
  @Prop() status!: boolean;

  async reviewSupplier() {
    if (this.supplierSync.id) {
      const _res = await reviewSupplier(this.supplierSync.id, {
        status: status ? "ACTIVE" : "BANNED"
      });
      if (_res.data) {
        const _supplier = _res.data;
        this.supplierSync.status = _supplier.status;
        this.dialogConfirmSync = false;
        this.dialogDetailSync = false;
      }
    }
  }
}
</script>
