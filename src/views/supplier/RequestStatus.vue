<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col class="text-center">
          <p>
            Tài khoản của bạn đang được xác thực bởi các Quản trị viên. Vui lòng
            chờ phản hồi qua email!
          </p>
          <p>Xem chi tiết đơn đăng ký tại <a @click="showDialog">đây</a></p>
        </v-col>
      </v-row>
    </v-container>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-toolbar color="primary" light flat>
            <v-toolbar-title
              ><span class="headline" style="color:white;"
                >Chi tiết đơn đăng ký</span
              >
              <v-btn
                icon
                dark
                @click="dialog = false"
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
                      v-model="username"
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
                      v-model="email"
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
                      v-model="phone"
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
                      v-model="role"
                      readonly
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-layout>
              <v-layout col>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      label="Quốc gia"
                      name="country"
                      prepend-icon="mdi-lock"
                      type="text"
                      v-model="country"
                      readonly
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      label="Tỉnh"
                      name="city"
                      prepend-icon="mdi-lock"
                      type="text"
                      v-model="city"
                      readonly
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-layout>
              <v-layout col>
                <v-layout row>
                  <v-flex xs4>
                    <v-text-field
                      label="Mã code"
                      name="code"
                      prepend-icon="mdi-lock"
                      type="text"
                      v-model="code"
                      readonly
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-layout>
              <v-layout col>
                <v-layout row>
                  <v-flex xs10>
                    <v-text-field
                      label="Địa chỉ chi tiết"
                      name="address"
                      prepend-icon="mdi-lock"
                      type="text"
                      v-model="address"
                      readonly
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-layout>
              <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-row>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import { UserEntity } from "@/store/definitions/user";
import UserModule from "@/store/modules/user";
@Component
export default class Logout extends Vue {
  @PropSync("layout") layoutSync!: object;
  public profile: UserEntity | null = null;
  private username = "";
  private email = "";
  private phone = "";
  private role = "" as any;
  private country = "";
  private city = "";
  private code = "";
  private address = "";
  private status = "";
  private dialog = false;
  created() {
    this.layoutSync = NavLayout;
    this.profile = UserModule.getCurrentUser;
  }
  public showDialog() {
    console.log(UserModule.getCurrentUser);
    if (this.profile != null) {
      console.log(this.profile);
      this.username = this.profile.username;
      this.email = this.profile.email;
      this.phone = this.profile.phone;
      this.role = this.profile.roles;
      this.country = this.profile.address.country;
      this.city = this.profile.address.address;
      this.address = this.profile.address.address;
      this.status = this.profile.status;
      this.code = this.profile.address.postalCode;
    }
    this.dialog = true;
    console.log(this.dialog);
  }
}
</script>
