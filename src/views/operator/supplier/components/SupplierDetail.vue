<template>
  <v-dialog v-model="dialogDetailSync" max-width="600">
    <v-card tile>
      <v-card-title class="headline">Chi tiết nhà cung cấp</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Tên đăng nhập"
                name="username"
                prepend-icon="mdi-account"
                type="text"
                v-model="supplier.username"
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Email"
                name="email"
                prepend-icon="alternate_email"
                type="text"
                v-model="supplier.email"
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Số điện thoại"
                name="phone"
                prepend-icon="phone"
                type="number"
                v-model="supplier.phone"
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Phân quyền"
                name="role"
                prepend-icon="security"
                type="text"
                v-model="supplier.roles[0]"
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Địa chỉ"
                name="address"
                prepend-icon="location_on"
                type="text"
                v-model="supplier.address"
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Mã công ty"
                name="companyCode"
                prepend-icon="verified_user"
                type="text"
                v-model="supplier.companyCode"
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Tên công ty"
                name="companyName"
                prepend-icon="contacts"
                type="text"
                v-model="supplier.companyName"
                disabled
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Người liên hệ"
                name="fullname"
                prepend-icon="add_ic_call"
                type="text"
                v-model="supplier.fullname"
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Mã số thuế"
                name="tin"
                prepend-icon="card_travel"
                type="number"
                v-model="supplier.tin"
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Fax"
                name="tin"
                prepend-icon="perm_phone_msg"
                type="number"
                v-model="supplier.fax"
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Website"
                name="website"
                prepend-icon="copyright"
                type="text"
                v-model="supplier.website"
                disabled
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Mô tả"
                name="companyDescription"
                prepend-icon="description"
                type="text"
                v-model="supplier.companyDescription"
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <v-text-field
                label="Địa chỉ công ty"
                name="companyAddress"
                prepend-icon="location_city"
                type="text"
                v-model="supplier.companyAddress"
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogDetailSync = false">Trở về</v-btn>
      </v-card-actions>
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
