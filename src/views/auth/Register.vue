<template>
  <v-card tile>
    <Snackbar :text="message" :snackbar.sync="snackbar" />
    <!-- TITLE -->
    <v-toolbar dark color="primary">
      <v-toolbar-title>Đăng ký tài khoản</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn dark text to="/login">Đăng nhập</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <!-- START CONTENT -->
    <v-list three-line subheader>
      <v-stepper v-model="stepper" vertical>
        <v-stepper-step :complete="stepper > 1" step="1" :editable="editable">
          Đăng ký tài khoản
          <small>Thông tin chung</small>
        </v-stepper-step>

        <v-stepper-content step="1">
          <v-form ref="registerForm" v-model="valid" validation>
            <small>*Dấu sao là trường bắt buộc</small>
            <v-layout col>
              <v-layout row>
                <v-flex xs8>
                  <v-text-field
                    label="Tên đăng nhập*"
                    name="username"
                    prepend-icon="mdi-account"
                    type="text"
                    :counter="20"
                    :rules="[
                      minLength('username', 2),
                      maxLength('username', 20)
                    ]"
                    v-model="username"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs8>
                  <v-text-field
                    label="Mật khẩu*"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    :counter="120"
                    :rules="[
                      minLength('password', 6),
                      maxLength('password', 120)
                    ]"
                    v-model="password"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-layout>
            <v-radio-group v-model="roles" :mandatory="true" row>
              <v-radio label="Đăng ký làm chủ xe" value="forwarder"></v-radio>
              <v-radio
                label="Đăng ký làm chủ hàng"
                value="merchant"
                style="margin-left:255px;"
              ></v-radio>
            </v-radio-group>
            <v-layout col>
              <v-layout row>
                <v-flex xs8>
                  <v-text-field
                    label="Email*"
                    type="email"
                    prepend-icon="alternate_email"
                    v-model="emailRegister"
                    :counter="50"
                    :rules="[
                      email('Register'),
                      minLength('email', 5),
                      maxLength('email', 50)
                    ]"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs8>
                  <v-text-field
                    label="Số điện thoại*"
                    name="phone"
                    prepend-icon="phone"
                    type="text"
                    :counter="10"
                    :rules="[minLength('phone', 10), maxLength('phone', 10)]"
                    v-model="phone"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-layout>

            <v-text-field
              label="Địa chỉ*"
              name="address"
              prepend-icon="location_on"
              :counter="100"
              :rules="[minLength('address', 5), maxLength('address', 100)]"
              type="text"
              v-model="address"
            ></v-text-field>
            <v-btn color="primary" @click="stepper = 2" :disabled="!valid"
              >Tiếp tục</v-btn
            >
            <!-- <v-btn text @click="dialogAddSync = false">Hủy</v-btn> -->
          </v-form>
        </v-stepper-content>

        <v-stepper-step :complete="stepper > 2" step="2" :editable="editable">{{
          roles === "forwarder" ? "Thông tin chủ xe" : "Thông tin chủ hàng"
        }}</v-stepper-step>

        <v-stepper-content step="2">
          <v-form ref="companyForm" v-model="valid2" validation>
            <small>*Dấu sao là trường bắt buộc</small>
            <v-layout col>
              <v-layout row>
                <v-flex xs8>
                  <v-text-field
                    label="Mã công ty*"
                    name="companyCode"
                    prepend-icon="verified_user"
                    type="text"
                    :counter="10"
                    :rules="[
                      minLength('cpmpany code', 2),
                      maxLength('company code', 10)
                    ]"
                    v-model="companyCode"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs8>
                  <v-text-field
                    label="Tên công ty*"
                    name="companyName"
                    prepend-icon="contacts"
                    type="text"
                    :counter="100"
                    :rules="[
                      minLength('company name', 5),
                      maxLength('company name', 100)
                    ]"
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
                    label="Người liên hệ*"
                    name="contactPerson"
                    prepend-icon="add_ic_call"
                    type="text"
                    :counter="50"
                    :rules="[
                      minLength('contact person', 5),
                      maxLength('contact person', 50)
                    ]"
                    v-model="contactPerson"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs8>
                  <v-text-field
                    label="Website*"
                    name="website"
                    prepend-icon="copyright"
                    type="text"
                    :counter="50"
                    :rules="[minLength('website', 5), maxLength('website', 50)]"
                    v-model="website"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-layout>
            <v-layout col>
              <v-layout row>
                <v-flex xs8>
                  <v-text-field
                    label="Tin*"
                    name="tin"
                    prepend-icon="contact_phone"
                    :counter="20"
                    :rules="[minLength('tin', 5), maxLength('tin', 20)]"
                    type="text"
                    v-model="tin"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs8>
                  <v-text-field
                    label="Fax*"
                    name="fax"
                    prepend-icon="perm_phone_msg"
                    type="text"
                    :counter="20"
                    :rules="[minLength('fax', 5), maxLength('fax', 20)]"
                    v-model="fax"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-layout>
            <v-layout col>
              <v-layout row>
                <v-flex xs8>
                  <v-text-field
                    label="Mô tả*"
                    name="companyDescription"
                    prepend-icon="description"
                    type="text"
                    :counter="200"
                    :rules="[
                      minLength('company description', 5),
                      maxLength('company description', 200)
                    ]"
                    v-model="companyDescription"
                  ></v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs8>
                  <v-text-field
                    label="Địa chỉ công ty*"
                    name="companyAddress"
                    prepend-icon="location_city"
                    type="text"
                    :counter="200"
                    :rules="[
                      minLength('company address', 5),
                      maxLength('company address', 200)
                    ]"
                    v-model="companyAddress"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-layout>

            <v-btn color="primary" @click="stepper = 3" :disabled="!valid2"
              >Tiếp tục</v-btn
            >
            <v-btn text @click="stepper = 1">Quay lại</v-btn>
          </v-form>
        </v-stepper-content>

        <v-stepper-step :complete="stepper > 3" step="3" :editable="editable"
          >Hoàn thành</v-stepper-step
        >

        <v-stepper-content step="3">
          <v-form ref="finishForm">
            <v-checkbox
              v-model="checkbox"
              label="Bạn đồng ý rằng tất cả các thông tin đưa lên đều là chính xác."
            ></v-checkbox>
            <v-btn color="primary" @click="submit()" :disabled="!checkbox"
              >Hoàn tất</v-btn
            >
            <v-btn
              text
              @click="
                stepper = 2;
                valid = true;
              "
              >Quay lại</v-btn
            >
          </v-form>
        </v-stepper-content>
      </v-stepper>
    </v-list>
    <!-- END CONTENT -->
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FormValidate from "@/mixin/form-validate";
import Snackbar from "@/components/Snackbar.vue";
@Component({
  mixins: [FormValidate],
  components: {
    Snackbar
  }
})
export default class Register extends Vue {
  username = "";
  password = "";
  emailRegister = "";
  phone = "";
  address = "";
  roles = "forwarder";
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
  editable = false;
  stepper = 1;
  valid = false;
  valid2 = false;
  checkbox = false;

  public submit() {
    this.role.push(this.roles);
    console.log(this.role);
    this.$http({
      url: "/auth/signup",
      method: "POST",
      data: {
        username: this.username,
        password: this.password,
        email: this.emailRegister,
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
