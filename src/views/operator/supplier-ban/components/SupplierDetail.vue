<template>
  <v-dialog
    v-model="dialogDetailSync"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-btn icon dark @click="dialogDetailSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Chi tiết Supplier</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialogDetailSync = false">Trở về</v-btn>
        </v-toolbar-items>
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
                  v-model="supplierSync.roles[0]"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Địa chỉ"
                  name="address"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplierSync.address"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Website"
                  name="website"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplierSync.website"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Người liên hệ"
                  name="contactPerson"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplierSync.contactPerson"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Tên công ty"
                  name="companyName"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplierSync.companyName"
                  readonly
                >
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Mã công ty"
                  name="companyCode"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplierSync.companyCode"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Mô tả"
                  name="companyDescription"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplierSync.companyDescription"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Địa chỉ công ty"
                  name="companyAddress"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplierSync.companyAddress"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Tin"
                  name="tin"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplierSync.tin"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Fax"
                  name="tin"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="supplierSync.fax"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { ISupplier } from "@/entity/supplier";

@Component
export default class SupplierDetail extends Vue {
  @PropSync("dialogDetail", { type: Boolean }) dialogDetailSync!: boolean;
  @PropSync("dialogBan", { type: Boolean }) dialogBanSync!: boolean;
  @PropSync("supplier", { type: Object }) supplierSync!: ISupplier;
  @PropSync("suppliers", { type: Array }) suppliersSync!: Array<ISupplier>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
}
</script>
