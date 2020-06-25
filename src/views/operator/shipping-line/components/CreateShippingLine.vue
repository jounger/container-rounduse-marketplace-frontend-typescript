<template>
  <v-dialog
    v-model="dialogAddSync"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogAddSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{
          isUpdate ? "Cập nhập hãng tàu" : "Thêm mới hãng tàu"
        }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialogAddSync = false">Trở về</v-btn>
          <v-btn dark text @click="createShippingLine()" v-if="!isUpdate"
            >Thêm mới</v-btn
          >
          <v-btn dark text @click="updateShippingLine()" v-else>Cập nhập</v-btn>
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
                  v-model="shippingLineSync.username"
                ></v-text-field>
              </v-flex>
            </v-layout>
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
          </v-layout>
          <v-layout col>
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
                <v-text-field
                  label="Lời dẫn"
                  name="companyDescription"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="shippingLineSync.companyDescription"
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
                  v-model="shippingLineSync.tin"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Fax"
                  name="fax"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="shippingLineSync.fax"
                ></v-text-field>
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
                  label="Địa chỉ"
                  name="companyAddress"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="shippingLineSync.companyAddress"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs6>
                <v-select
                  :items="['PENDING', 'ACTIVE', 'BANNED']"
                  label="Trạng thái"
                  prepend-icon="mdi-lock"
                  required
                  v-model="shippingLineSync.status"
                ></v-select>
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
import { IShippingLine } from "@/entity/shipping-line";
import { createShippingLine, updateShippingLine } from "@/api/shipping-line";

@Component
export default class CreateShippingLine extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("shippingLine", { type: Object }) shippingLineSync!: IShippingLine;
  @PropSync("shippingLines", { type: Array }) shippingLinesSync!: Array<
    IShippingLine
  >;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("expiredDate", { type: String }) expiredDateSync!: string;
  currencies = ["USD", "VND", "EURO"];
  expiredDatePicker = false;
  get isUpdate() {
    if (typeof this.shippingLineSync.id !== "undefined") {
      return true;
    }
    return false;
  }
  addShippingLine() {
    if (this.shippingLineSync) {
      createShippingLine(this.shippingLineSync)
        .then(res => {
          console.log(res.data);
          const response: IShippingLine = res.data;
          this.shippingLineSync = response;
          this.messageSync =
            "Thêm mới thành công mã giảm giá: " +
            this.shippingLineSync.username;
          this.shippingLinesSync.push(this.shippingLineSync);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogAddSync = false))
        );
    }
  }
  updateShippingLine() {
    if (this.shippingLineSync.id) {
      updateShippingLine(this.shippingLineSync)
        .then(res => {
          console.log(res.data);
          const response: IShippingLine = res.data;
          this.shippingLineSync = response;
          this.messageSync =
            "Cập nhập thành công mã giảm giá: " +
            this.shippingLineSync.username;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogAddSync = false))
        );
    }
  }
}
</script>
