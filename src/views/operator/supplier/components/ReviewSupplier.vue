<template>
  <v-dialog v-model="dialogReviewSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            supplier.status == "ACTIVE" ? "Khóa tài khoản" : "Mở khóa tài khoản"
          }}</span>
        </v-toolbar-title>
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" md="11">
              <v-text-field
                label="Tên đăng nhập"
                name="username"
                prepend-icon="mdi-account"
                type="text"
                v-model="supplier.username"
                readonly
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row v-if="supplier.status == 'ACTIVE'">
            <v-col cols="12" md="11">
              <v-text-field
                label="Lý do khóa tài khoản"
                name="reason"
                prepend-icon="comment"
                type="text"
                v-model="reason"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogReviewSync = false">Hủy</v-btn>
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
      const _supplier = await reviewSupplier(this.supplier.id, {
        status: status
      });
      if (_supplier.data) {
        const index = this.suppliersSync.findIndex(
          x => x.id == _supplier.data.id
        );
        this.suppliersSync.splice(index, 1, _supplier.data);
        this.dialogReviewSync = false;
      }
    }
  }
}
</script>
