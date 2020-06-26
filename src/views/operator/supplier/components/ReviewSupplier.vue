<template>
  <v-dialog v-model="dialogReviewSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            supplierSync.status == "ACTIVE"
              ? "Khóa tài khoản"
              : "Mở khóa tài khoản"
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
              v-model="supplierSync.username"
              readonly
            ></v-text-field>
          </v-layout>
          <v-layout row v-if="supplierSync.status == 'ACTIVE'">
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
          v-if="supplierSync.status == 'ACTIVE'"
          >Khóa tài khoản</v-btn
        >
        <v-btn
          @click="reviewSupplier('ACTIVE')"
          color="green"
          v-if="supplierSync.status == 'BANNED'"
          >Mở khóa</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { ISupplier } from "@/entity/supplier";
import { reviewSupplier } from "@/api/supplier";

@Component
export default class ReviewSupplier extends Vue {
  @PropSync("dialogReview", { type: Boolean }) dialogReviewSync!: boolean;
  @PropSync("supplier", { type: Object }) supplierSync!: ISupplier;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("suppliers", { type: Array }) suppliersSync!: Array<ISupplier>;

  reason = "";
  reviewSupplier(status: string) {
    if (this.supplierSync.id) {
      reviewSupplier(this.supplierSync.id, {
        status: status
      })
        .then(res => {
          console.log(res.data);
          const response: ISupplier = res.data;
          this.supplierSync = response;
          this.messageSync =
            "Success " + response.status + " for user: " + response.username;
          const index = this.suppliersSync.findIndex(
            x => x.id === this.supplierSync.id
          );
          this.suppliersSync.splice(index, 1);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Error happend";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
}
</script>
