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
        <v-btn @click="destroy()" color="red"
          ><span style="color:white;">Hủy bỏ</span></v-btn
        >
        <v-btn @click="approve()" color="primary"
          ><span style="color:white;">Cho phép</span></v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { SupplierRegister } from "../supplier-register";

@Component({
  name: "SupplierRegisterDetail"
})
export default class SupplierRegisterDetail extends Vue {
  // @Prop() selected!: Array<object>;
  @PropSync("dialogDetail", { type: Boolean }) dialogSync!: boolean;
  @PropSync("checkSuccess", { type: Boolean }) checkSuccessSync!: boolean;
  @PropSync("success", { type: String }) successSync!: string | null;
  @PropSync("supplier", {
    type: Object
  })
  supplierSync!: SupplierRegister | null;
  @PropSync("checkDestroy", { type: Boolean }) checkDestroySync!: boolean;
  @PropSync("checkAcc", { type: Boolean }) checkAccSync!: boolean;
  @PropSync("title", { type: String }) titleSync!: string | null;
  @PropSync("status", { type: String }) statusSync!: string | null;
  @PropSync("dialogConfirm", { type: Boolean }) dialogConfirmSync!: boolean;

  public approve() {
    this.checkAccSync = true;
    this.checkDestroySync = false;
    this.titleSync = "Xác nhận kiểm duyệt";
    this.statusSync = "chấp nhận";
    this.dialogConfirmSync = true;
  }
  public destroy() {
    this.checkDestroySync = true;
    this.checkAccSync = false;
    this.titleSync = "Xác nhận hủy bỏ";
    this.statusSync = "hủy bỏ";
    this.dialogConfirmSync = true;
  }
}
</script>
