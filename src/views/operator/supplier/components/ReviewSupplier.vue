<template>
  <v-dialog v-model="dialogReviewSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            supplier.status == "ACTIVE" ? "Khóa tài khoản" : "Mở khóa tài khoản"
          }}</span>
          <v-btn
            icon
            dark
            @click="dialogReviewSync = false"
            style="margin-left:323px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>

      <v-card-text>
        <v-form>
          <v-layout row>
            <v-text-field
              label="Tên đăng nhập"
              name="username"
              prepend-icon="mdi-account"
              type="text"
              v-model="supplier.username"
              readonly
            ></v-text-field>
          </v-layout>
          <v-layout row v-if="supplier.status == 'ACTIVE'">
            <v-text-field
              label="Lý do khóa tài khoản"
              name="reason"
              prepend-icon="mdi-lock"
              type="text"
              v-model="reason"
              required
            ></v-text-field>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-left: 205px;">
        <v-btn @click="dialogReviewSync = false">Hủy</v-btn>
        <v-btn
          @click="reviewSupplier('BANNED')"
          color="red"
          v-if="supplier.status == 'ACTIVE'"
          :disabled="finish"
          ><span style="color:white;">Khóa tài khoản</span></v-btn
        >
        <v-btn
          @click="reviewSupplier('ACTIVE')"
          color="green"
          v-if="supplier.status == 'BANNED'"
          :disabled="finish"
          ><span style="color:white;">Mở khóa</span></v-btn
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
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("suppliers", { type: Array }) suppliersSync!: Array<ISupplier>;
  @Prop(Object) supplier!: ISupplier;

  reason = "";
  finish = false;
  reviewSupplier(status: string) {
    if (this.supplier.id) {
      reviewSupplier(this.supplier.id, {
        status: status
      })
        .then(res => {
          console.log(res.data);
          const response: ISupplier = res.data;
          this.messageSync =
            response.status == "ACTIVE"
              ? "Mở khóa thành công tài khoản: " + response.username
              : "Khóa thành công tài khoản: " + response.username;
          const index = this.suppliersSync.findIndex(x => x.id == response.id);
          this.suppliersSync.splice(index, 1, response);
          this.finish = true;
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
