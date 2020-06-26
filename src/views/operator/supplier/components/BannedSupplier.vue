<template>
  <v-dialog v-model="dialogBanSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;"
            >Khóa tài khoản Supplier</span
          >
          <v-btn
            icon
            dark
            @click="dialogBanSync = false"
            style="margin-left:268px;"
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
          <v-layout row>
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
        <v-btn @click="dialogBanSync = false">Hủy</v-btn>
        <v-btn @click="bannedSupplier()" color="red">Khóa tài khoản</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { ISupplier } from "@/entity/supplier";
import { reviewSupplier } from "@/api/supplier";

@Component
export default class BannedSupplier extends Vue {
  @PropSync("dialogBan", { type: Boolean }) dialogBanSync!: boolean;
  @PropSync("supplier", { type: Object }) supplierSync!: ISupplier;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("suppliers", { type: Array }) suppliersSync!: Array<ISupplier>;

  reason = "";
  bannedSupplier() {
    if (this.supplierSync.id) {
      reviewSupplier(this.supplierSync.id, {
        status: "BANNED"
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
