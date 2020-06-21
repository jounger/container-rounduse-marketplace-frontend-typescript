<template>
  <v-dialog v-model="dialogSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;"
            >Chi tiết đơn đăng ký</span
          >
          <v-btn
            icon
            dark
            @click="dialogSync = false"
            style="margin-left:308px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Tên đăng nhập"
                  name="username"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="supplierSync.username"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Email"
                  name="email"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplierSync.email"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Số điện thoại"
                  name="phone"
                  prepend-icon="mdi-lock"
                  type="number"
                  v-model="supplierSync.phone"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Phân quyền"
                  name="role"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplierSync.role"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Trạng thái"
                  name="role"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplierSync.status"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialogDetail = false">Trở về</v-btn>
        <v-btn @click="reviewRegister(false)" color="red"
          ><span style="color:white;">Từ chối</span></v-btn
        >
        <v-btn @click="reviewRegister(true)" color="primary"
          ><span style="color:white;">Cho phép</span></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { SupplierEntity } from "../supplier-register";
import { reviewSupplier } from "../../../../api/supplier-request";

@Component({
  name: "DialogRegisterDetail"
})
export default class DialogRegisterDetail extends Vue {
  @PropSync("dialogDetail", { type: Boolean }) dialogSync!: boolean;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("supplier", { type: Object }) supplierSync!: SupplierEntity;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  reviewRegister(status: boolean) {
    if (this.supplierSync.id) {
      reviewSupplier(this.supplierSync.id, {
        status: status == true ? "ACTIVE" : "BANNED"
      })
        .then(res => {
          console.log(res.data);
          const response: SupplierEntity = res.data;
          this.messageSync =
            "Success " + response.status + " for user: " + response.username;
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
