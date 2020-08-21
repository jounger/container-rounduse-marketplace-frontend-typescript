<template>
  <section style="height:1000px">
    <v-container>
      <v-row justify="center" align="center" class="mt-15">
        <v-col cols="12" md="2"></v-col>
        <v-col cols="12" md="8">
          <h1 class="black--text display-1 ml-0 mb-5 title">
            Hãy đăng ký ngay
          </h1>
          <div class="line"></div>
          <h4 class="black--text subheading ml-0 ma-3">
            Cùng 300+ khách hàng khác đang sử dụng CRuM nâng cao hiệu suất -
            giảm thiểu chi phí cho doanh nghiệp của bạn.
          </h4>
        </v-col>
        <v-col cols="12" md="2"></v-col>
      </v-row>
      <v-row justify="center">
        <v-list three-line subheader outlined>
          <v-stepper v-model="stepper" vertical class="elevation-0">
            <v-stepper-step
              :complete="stepper > 1"
              step="1"
              :editable="editable"
            >
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
                      autocomplete="username"
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
                      autocomplete="new-password"
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
                  <v-radio
                    label="Đăng ký làm chủ xe"
                    value="forwarder"
                  ></v-radio>
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
                      :rules="[
                        minLength('Đỉa chỉ', 5),
                        maxLength('Địa chỉ', 100)
                      ]"
                      type="text"
                      v-model="supplier.address"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-btn @click="stepper = 2" :disabled="!valid" color="primary"
                  >Tiếp tục</v-btn
                >
              </v-form>
            </v-stepper-content>

            <v-stepper-step
              :complete="stepper > 2"
              step="2"
              :editable="editable"
              >{{
                role === "forwarder" ? "Thông tin chủ xe" : "Thông tin chủ hàng"
              }}</v-stepper-step
            >

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
                      name="fullname"
                      prepend-icon="add_ic_call"
                      type="text"
                      :counter="50"
                      :rules="[
                        minLength('Người liên hệ', 5),
                        maxLength('Người liên hệ', 50)
                      ]"
                      v-model="supplier.fullname"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      label="Website*"
                      name="website"
                      prepend-icon="copyright"
                      type="text"
                      :counter="50"
                      :rules="[
                        minLength('Website', 5),
                        maxLength('Website', 50)
                      ]"
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

                <v-btn @click="stepper = 3" :disabled="!valid2" color="primary"
                  >Tiếp tục</v-btn
                >
                <v-btn text @click="stepper = 1">Quay lại</v-btn>
              </v-form>
            </v-stepper-content>

            <v-stepper-step
              :complete="stepper > 3"
              step="3"
              :editable="editable"
              >Hoàn thành</v-stepper-step
            >

            <v-stepper-content step="3">
              <v-form ref="finishForm">
                <v-checkbox
                  v-model="checkbox"
                  label="Bạn đồng ý rằng tất cả các thông tin đưa lên đều là chính xác."
                ></v-checkbox>
                <v-btn @click="submit()" :disabled="!checkbox" color="primary"
                  >Hoàn tất</v-btn
                >
                <v-btn text @click="stepper = 2">Quay lại</v-btn>
              </v-form>
            </v-stepper-content>
          </v-stepper>
        </v-list>
      </v-row>
    </v-container>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FormValidate from "@/mixin/form-validate";
import { ISupplier } from "@/entity/supplier";

@Component({
  mixins: [FormValidate]
})
export default class Register extends Vue {
  supplier = {
    username: "",
    password: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    fullname: "",
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
  editable = false;
  stepper = 1;
  valid = false;
  valid2 = false;
  checkbox = false;

  async submit() {
    this.supplier.roles.push(this.role);
    const _res = await this.$http({
      url: "/auth/signup",
      method: "POST",
      data: this.supplier
    });
    if (_res.status == 200) this.supplier.roles = [] as Array<string>;
  }
}
</script>
<style scoped lang="css">
section {
  background-color: #cbe4d6 !important;
}
.title {
  font-size: 35px !important;
  font-weight: 300;
}
.subheading {
  font-size: 20px !important;
  font-weight: 300;
}
</style>
