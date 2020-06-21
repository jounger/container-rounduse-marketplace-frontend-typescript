<template>
  <v-dialog v-model="dialogSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{ title }}</span>
          <v-btn
            icon
            dark
            @click="dialogSync = false"
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
                  :readonly="readonly"
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
                  v-model="shippingLineSync.shipName"
                  :readonly="readonly"
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
                  :readonly="readonly"
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
                  v-model="shippingLineSync.nameCode"
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-select
                  :items="['ROLE_SHIPPINGLINE']"
                  label="Phân quyền*"
                  prepend-icon="mdi-lock"
                  required
                  v-model="roles"
                  :readonly="readonly"
                ></v-select>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-select
                  :items="['PENDING', 'ACTIVE', 'BANNED']"
                  label="Trạng thái*"
                  prepend-icon="mdi-lock"
                  required
                  v-model="shippingLineSync.status"
                  :readonly="readonly"
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
                  :readonly="readonly"
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
                  :readonly="readonly"
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
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-select
                  :items="icd"
                  attach
                  label="ICD"
                  v-model="shippingLineSync.icds"
                  :readonly="readonly"
                ></v-select>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs6>
                <v-text-field
                  label="Địa chỉ"
                  name="address"
                  prepend-icon="mdi-lock"
                  type="text"
                  v-model="shippingLineSync.address"
                  :readonly="readonly"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogSync = false">Trở về</v-btn>
        <v-btn @click="submit()" color="primary" v-if="checkAdd"
          >Thêm mới</v-btn
        >
        <v-btn @click="updateShippingLine()" color="primary" v-if="checkUpdate"
          >Cập nhập</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { ShippingLine } from "../shipping-line";

@Component({
  name: "CreateShippingLine"
})
export default class CreateShippingLine extends Vue {
  // @Prop() selected!: Array<object>;
  @PropSync("dialogAdd", { type: Boolean }) dialogSync!: boolean;
  @PropSync("checkSuccess", { type: Boolean }) checkSuccessSync!: boolean;
  @PropSync("success", { type: String }) successSync!: string | null;
  @Prop(Boolean) checkAdd!: boolean;
  @Prop(Boolean) checkUpdate!: boolean;
  @Prop(Boolean) readonly!: boolean;
  @PropSync("shippingLine", {
    type: Object
  })
  shippingLineSync!: ShippingLine | null;
  @Prop(String) title!: string | null;
  icd = ["Seaport", "Dryport"];
  roles = "ROLE_SHIPPINGLINE";

  public submit() {
    this.successSync = "Thêm mới thành công!";
    this.checkSuccessSync = true;
    this.dialogSync = false;
  }
  public updateShippingLine() {
    this.successSync = "Cập nhập thành công";
    this.checkSuccessSync = true;
    this.dialogSync = false;
  }
}
</script>
