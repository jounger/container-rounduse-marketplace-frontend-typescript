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
                  v-model="supplier.username"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Email"
                  name="email"
                  prepend-icon="alternate_email"
                  type="text"
                  v-model="supplier.email"
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
                  prepend-icon="phone"
                  type="text"
                  v-model="supplier.phone"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Phân quyền"
                  name="role"
                  prepend-icon="security"
                  type="text"
                  v-model="supplier.roles[0]"
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
                  prepend-icon="location_on"
                  type="text"
                  v-model="supplier.address"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Mã công ty"
                  name="companyCode"
                  prepend-icon="verified_user"
                  type="text"
                  v-model="supplier.companyCode"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Tên công ty"
                  name="companyName"
                  prepend-icon="contacts"
                  type="text"
                  v-model="supplier.companyName"
                  readonly
                >
                </v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Người liên hệ"
                  name="contactPerson"
                  prepend-icon="add_ic_call"
                  type="text"
                  v-model="supplier.contactPerson"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Website"
                  name="website"
                  prepend-icon="copyright"
                  type="text"
                  v-model="supplier.website"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Tin"
                  name="tin"
                  prepend-icon="contact_phone"
                  type="text"
                  v-model="supplier.tin"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Fax"
                  name="tin"
                  prepend-icon="perm_phone_msg"
                  type="text"
                  v-model="supplier.fax"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Mô tả"
                  name="companyDescription"
                  prepend-icon="description"
                  type="text"
                  v-model="supplier.companyDescription"
                  readonly
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs4>
                <v-text-field
                  label="Địa chỉ công ty"
                  name="companyAddress"
                  prepend-icon="location_city"
                  type="text"
                  v-model="supplier.companyAddress"
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
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { ISupplier } from "@/entity/supplier";

@Component
export default class SupplierDetail extends Vue {
  @PropSync("dialogDetail", { type: Boolean }) dialogDetailSync!: boolean;
  @Prop(Object) supplier!: ISupplier;
}
</script>
