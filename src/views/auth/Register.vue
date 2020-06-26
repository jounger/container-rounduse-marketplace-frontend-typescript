<template>
  <v-card style="width: 1000px;">
    <Snackbar :text="message" :snackbar.sync="snackbar" />
    <v-toolbar color="primary" light flat>
      <v-toolbar-title style="color: white;">Sign up form</v-toolbar-title>
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
                :counter="20"
                :rules="[minLength('username', 2), maxLength('username', 20)]"
                v-model="username"
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
                :counter="120"
                :rules="[minLength('password', 6), maxLength('password', 120)]"
                v-model="password"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs8>
              <v-radio-group v-model="roles" :mandatory="false">
                <v-radio label="Đăng ký làm chủ xe" value="forwarder"></v-radio>
                <v-radio
                  label="Đăng ký làm chủ hàng"
                  value="merchant"
                ></v-radio>
              </v-radio-group>
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
                :counter="50"
                :rules="[minLength('email', 5), maxLength('email', 50)]"
                v-model="email"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs8>
              <v-text-field
                label="Số điện thoại"
                name="phone"
                prepend-icon="mdi-lock"
                type="text"
                :counter="10"
                :rules="[minLength('phone', 10), maxLength('phone', 10)]"
                v-model="phone"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs8>
              <v-text-field
                label="Địa chỉ"
                name="address"
                prepend-icon="mdi-lock"
                :rules="[required('address')]"
                type="text"
                v-model="address"
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
                prepend-icon="mdi-lock"
                type="text"
                :rules="[required('website')]"
                v-model="website"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs8>
              <v-text-field
                label="Người liên hệ"
                name="contactPerson"
                prepend-icon="mdi-lock"
                type="text"
                :rules="[required('Contact Person')]"
                v-model="contactPerson"
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
                :rules="[required('Company name')]"
                v-model="companyName"
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
                :rules="[required('Company code')]"
                v-model="companyCode"
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
                :rules="[required('Company description')]"
                v-model="companyDescription"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs8>
              <v-text-field
                label="Địa chỉ công ty"
                name="companyAddress"
                prepend-icon="mdi-lock"
                type="text"
                :rules="[required('Company address')]"
                v-model="companyAddress"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-layout>
        <v-layout col>
          <v-layout row>
            <v-flex xs8>
              <v-text-field
                label="Tin"
                name="tin"
                prepend-icon="mdi-lock"
                :rules="[required('tin')]"
                type="text"
                v-model="tin"
              ></v-text-field>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs8>
              <v-text-field
                label="Fax"
                name="fax"
                prepend-icon="mdi-lock"
                type="text"
                :rules="[required('fax')]"
                v-model="fax"
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-layout>

        <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="submit()" color="primary">Sign up</v-btn>
      <v-btn @click="cancel()" color="primary">Login</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import FormValidate from "@/mixin/form-validate";
import Snackbar from "@/components/Snackbar.vue";
import RegisterLayout from "@/layouts/RegisterLayout.vue";
@Component({
  mixins: [FormValidate],
  components: {
    Snackbar,
    RegisterLayout
  }
})
export default class Register extends Vue {
  @PropSync("layout") layoutSync!: object;
  private username = "";
  private password = "";
  private email = "";
  private phone = "";
  private address = "";
  private roles = "forwarder";
  website = "";
  contactPerson = "";
  companyName = "";
  companyCode = "";
  companyDescription = "";
  companyAddress = "";
  tin = "";
  fax = "";
  role = [] as Array<string>;
  message = "";
  snackbar = false;

  created() {
    this.layoutSync = RegisterLayout;
  }
  public submit() {
    this.role.push(this.roles);
    console.log(this.role);
    this.$http({
      url: "/auth/signup",
      method: "POST",
      data: {
        username: this.username,
        password: this.password,
        email: this.email,
        phone: this.phone,
        roles: this.role,
        address: this.address,
        website: this.website,
        contactPerson: this.contactPerson,
        companyName: this.companyName,
        companyCode: this.companyCode,
        companyDescription: this.companyDescription,
        companyAddress: this.companyAddress,
        tin: this.tin,
        fax: this.fax
      }
    })
      .then(response => {
        console.warn("SUCCESS register", response);
        this.message = "Đăng ký thành công người dùng " + this.username;
        this.snackbar = true;
      })
      .catch(err => {
        console.error("ERROR! in register", err);
        this.message = "Đã có lỗi xảy ra";
        this.snackbar = true;
      });
  }
  public cancel(): void {
    this.$router.push("/login");
  }
}
</script>

<style></style>
