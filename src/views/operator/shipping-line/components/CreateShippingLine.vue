<template>
  <v-dialog v-model="dialogAddSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            isUpdate ? "Update" : "Add"
          }}</span>
          <v-btn
            icon
            dark
            @click="dialogAddSync = false"
            style="margin-left:296px;"
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
                  v-model="shippingLineSync.username"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Tên hãng tàu"
                  name="shippingLineName"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="shippingLineSync.companyName"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Mật khẩu"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  v-model="shippingLineSync.password"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Mã tên"
                  name="namecode"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="shippingLineSync.companyCode"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-select
                  :items="['PENDING', 'ACTIVE', 'BANNED']"
                  label="Trạng thái*"
                  prepend-icon="mdi-lock"
                  required
                  v-model="shippingLineSync.status"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Email"
                  name="email"
                  prepend-icon="mdi-lock"
                  type="email"
                  v-model="shippingLineSync.email"
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
                  v-model="shippingLineSync.website"
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
                  type="phone"
                  v-model="shippingLineSync.phone"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="name code"
                  name="companyCode"
                  prepend-icon="mdi-lock"
                  type="phone"
                  v-model="shippingLineSync.companyCode"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs6>
                <v-text-field
                  label="Địa chỉ"
                  name="companyAddress"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="shippingLineSync.companyAddress"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <small>*Dấu sao là trường bắt buộc</small>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn @click="createShippingLine()" color="primary" v-if="!isUpdate"
          >Thêm mới</v-btn
        >
        <v-btn @click="updateShippingLine()" color="primary" v-else
          >Cập nhập</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { IShippingLine } from "@/entity/shipping-line";

@Component
export default class CreateShippingLine extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("shippingLine", { type: Object }) shippingLineSync!: IShippingLine;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  get isUpdate() {
    if (typeof this.shippingLineSync.id !== "undefined") return true;
    return false;
  }
}
</script>
