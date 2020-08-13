<template>
  <v-dialog v-model="dialogConfirmSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            supplierSync.status == true
              ? "Xác nhận kích hoạt tài khoản người dùng"
              : "Xác nhận từ chối tài khoản người dùng"
          }}</span></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-container>
            <span style="color: black; font-size:22px;"
              >Bạn có chắc chắn muốn
              {{ supplierSync.status == "ACTIVE" ? "kích hoạt" : "từ chối" }}
              tài khoản này?</span
            >
            <v-divider class="mt-3"></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>{{
                    supplierSync.username
                  }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogConfirmSync = false">Hủy</v-btn>
        <v-btn
          @click="reviewSupplier()"
          color="success"
          v-if="supplierSync.status == 'ACTIVE'"
          >Đồng ý</v-btn
        >
        <v-btn @click="reviewSupplier()" color="error" v-else>Từ chối</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { ISupplier } from "@/entity/supplier";
import { reviewSupplier } from "@/api/supplier";

@Component
export default class ConfirmReviewSupplier extends Vue {
  @PropSync("dialogConfirm", { type: Boolean }) dialogConfirmSync!: boolean;
  @PropSync("dialogDetail", { type: Boolean }) dialogDetailSync!: boolean;
  @PropSync("supplier", { type: Object }) supplierSync!: ISupplier;

  async reviewSupplier() {
    if (this.supplierSync.id) {
      const _res = await reviewSupplier(this.supplierSync.id, {
        status: this.supplierSync.status
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
