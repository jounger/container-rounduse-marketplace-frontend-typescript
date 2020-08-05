<template>
  <v-card tile>
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
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Tên đăng nhập*"
                  name="username"
                  prepend-icon="mdi-account"
                  type="text"
                  :counter="20"
                  :rules="[
                    minLength('Tên đăng nhập', 2),
                    maxLength('Tên đăng nhập', 20)
                  ]"
                  v-model="supplier.username"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Mật khẩu*"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  :counter="120"
                  :rules="[
                    minLength('Mật khẩu', 6),
                    maxLength('Mật khẩu', 120)
                  ]"
                  v-model="supplier.password"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-radio-group v-model="role" :mandatory="true" row>
              <v-radio label="Đăng ký làm chủ xe" value="forwarder"></v-radio>
              <v-radio
                label="Đăng ký làm chủ hàng"
                value="merchant"
                style="margin-left:275px;"
              ></v-radio>
            </v-radio-group>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Email*"
                  type="email"
                  prepend-icon="alternate_email"
                  v-model="supplier.email"
                  :counter="50"
                  :rules="[
                    email('đăng ký'),
                    minLength('Email', 5),
                    maxLength('Email', 50)
                  ]"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Số điện thoại*"
                  name="phone"
                  prepend-icon="phone"
                  type="number"
                  :counter="10"
                  :rules="[
                    minLength('Số điện thoại', 10),
                    maxLength('Số điện thoại', 10)
                  ]"
                  v-model="supplier.phone"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Địa chỉ*"
                  name="address"
                  prepend-icon="location_on"
                  :counter="100"
                  :rules="[minLength('Đỉa chỉ', 5), maxLength('Địa chỉ', 100)]"
                  type="text"
                  v-model="supplier.address"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-btn color="primary" @click="stepper = 2" :disabled="!valid"
              >Tiếp tục</v-btn
            >
            <!-- <v-btn text @click="dialogAddSync = false">Hủy</v-btn> -->
          </v-form>
        </v-stepper-content>

        <v-stepper-step :complete="stepper > 2" step="2" :editable="editable">{{
          role === "forwarder" ? "Thông tin chủ xe" : "Thông tin chủ hàng"
        }}</v-stepper-step>

        <v-stepper-content step="2">
          <v-form ref="companyForm" v-model="valid2" validation>
            <small>*Dấu sao là trường bắt buộc</small>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Mã công ty*"
                  name="companyCode"
                  prepend-icon="verified_user"
                  type="text"
                  :counter="10"
                  :rules="[
                    minLength('Mã công ty', 2),
                    maxLength('Mã công ty', 10)
                  ]"
                  v-model="supplier.companyCode"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Tên công ty*"
                  name="companyName"
                  prepend-icon="contacts"
                  type="text"
                  :counter="100"
                  :rules="[
                    minLength('Tên công ty', 5),
                    maxLength('Tên công ty', 100)
                  ]"
                  v-model="supplier.companyName"
                >
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Người liên hệ*"
                  name="contactPerson"
                  prepend-icon="add_ic_call"
                  type="text"
                  :counter="50"
                  :rules="[
                    minLength('Người liên hệ', 5),
                    maxLength('Người liên hệ', 50)
                  ]"
                  v-model="supplier.contactPerson"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Website*"
                  name="website"
                  prepend-icon="copyright"
                  type="text"
                  :counter="50"
                  :rules="[minLength('Website', 5), maxLength('Website', 50)]"
                  v-model="supplier.website"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Mã số thuế*"
                  name="tin"
                  prepend-icon="card_travel"
                  :counter="20"
                  :rules="[
                    minLength('Mã số thuế', 5),
                    maxLength('Mã số thuế', 20)
                  ]"
                  type="number"
                  v-model="supplier.tin"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="FAX*"
                  name="fax"
                  prepend-icon="perm_phone_msg"
                  type="number"
                  :counter="20"
                  :rules="[minLength('FAX', 5), maxLength('FAX', 20)]"
                  v-model="supplier.fax"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Mô tả*"
                  name="companyDescription"
                  prepend-icon="description"
                  type="text"
                  :counter="200"
                  :rules="[
                    minLength('Mô tả công ty', 5),
                    maxLength('Mô tả công ty', 200)
                  ]"
                  v-model="supplier.companyDescription"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  label="Địa chỉ công ty*"
                  name="companyAddress"
                  prepend-icon="location_city"
                  type="text"
                  :counter="200"
                  :rules="[
                    minLength('Địa chỉ công ty', 5),
                    maxLength('Địa chỉ công ty', 200)
                  ]"
                  v-model="supplier.companyAddress"
                ></v-text-field>
              </v-col>
            </v-row>

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
            <v-btn text @click="stepper = 2">Quay lại</v-btn>
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
import snackbar from "@/store/modules/snackbar";
import { getErrorMessage } from "@/utils/tool";
import { ISupplier } from "@/entity/supplier";
@Component({
  mixins: [FormValidate],
  components: {
    Snackbar
  }
})
export default class Register extends Vue {
  supplier = {
    username: "",
    password: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    contactPerson: "",
    companyName: "",
    companyCode: "",
    companyDescription: "",
    companyAddress: "",
    tin: "",
    fax: "",
    status: "PENDING",
    roles: [] as Array<string>
  } as ISupplier;
  role = "forwarder";
  message = "";
  snackbar = false;
  editable = false;
  stepper = 1;
  valid = false;
  valid2 = false;
  checkbox = false;

  async submit() {
    this.supplier.roles.push(this.role);
    await this.$http({
      url: "/auth/signup",
      method: "POST",
      data: this.supplier
    })
      .then(response => {
        console.warn("SUCCESS register", response);
        snackbar.setSnackbar({
          text: "Đăng ký thành công người dùng " + response.data.username,
          color: "success"
        });
      })
      .catch(err => {
        console.error("ERROR! in register", err);
        snackbar.setSnackbar({
          text: getErrorMessage(err),
          color: "error"
        });
      });
    snackbar.setDisplay(true);
    this.supplier.roles = [] as Array<string>;
  }
}
</script>
