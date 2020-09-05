<template>
  <v-container class="my-container">
    <v-row>
      <v-col cols="12" md="8">
        <v-card-title>Đăng ký tài khoản</v-card-title>
        <div class="register-line"></div>
        <p>
          <strong>Đăng ký tài khoản</strong> để trở thành một Thành viên của
          trang web.
        </p>
        <!-- START CONTENT -->
        <v-list class="form-list elevation-5" three-line subheader outlined>
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
                    style="margin-left:185px;"
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
        </v-list></v-col
      >
      <v-col cols="12" md="4"
        ><v-card width="400" height="200" class="follow mt-5" outlined>
          <v-card-title>Theo dõi chúng tôi</v-card-title>

          <p class="mt-5 ml-6">để cập nhật những thông tin mới nhất</p>
          <v-card-text>
            <v-row justify="center">
              <v-btn
                v-for="icon in socialNetworks"
                :key="icon.icon"
                :href="icon.to"
                target="_blank"
                class="mx-4"
                icon
              >
                <v-icon size="24px" :color="icon.color">{{ icon.icon }}</v-icon>
              </v-btn></v-row
            >
          </v-card-text>
        </v-card>
        <v-card width="400" height="400" class="contact mt-10" outlined>
          <v-card-title>Liên lạc với chúng tôi</v-card-title>

          <p class="mt-5 ml-6">để được tư vấn thêm</p>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="item in contacts"
                :key="item.title"
                class="mx-4"
                icon
              >
                <v-list-item-icon>
                  <v-icon :color="item.color">{{ item.icon }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item></v-list
            >
          </v-card-text>
        </v-card>
      </v-col></v-row
    >
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FormValidate from "@/mixin/form-validate";
import { ISupplier } from "@/entity/supplier";

@Component({
  mixins: [FormValidate]
})
export default class Register extends Vue {
  socialNetworks = [
    { icon: "mdi-facebook", color: "blue", to: "https://facebook.com" },
    { icon: "mdi-twitter", color: "blue", to: "https://twitter.com/" },
    { icon: "mdi-linkedin", color: "blue", to: "https://www.linkedin.com/" },
    { icon: "mdi-instagram", color: "pink", to: "https://www.instagram.com/" }
  ];
  contacts = [
    {
      icon: "account_circle",
      color: "primary",
      title: "Nguyễn Văn An"
    },
    {
      icon: "call",
      color: "green",
      title: "096.739.0098"
    },
    {
      icon: "email",
      color: "blue",
      title: "support@containerrounduse.com"
    },
    {
      icon: "location_on",
      color: "red",
      title: "Thạch Hòa- Thạch Thất- Hà Nội"
    }
  ];
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
.my-container {
  background-color: rgba(221, 221, 221, 0.2);
  width: 100%;
  max-width: 100% !important;
  margin: 0 !important;
}
.my-container .v-card__title {
  margin-left: 80px !important;
  font-size: 30px;
  margin-top: 20px;
}
.my-container p {
  margin-left: 100px;
  margin-top: 10px;
}
.my-container .form-list {
  width: 800px;
  margin-left: 80px !important;
}
.follow .v-card__title {
  font-size: 20px;
  margin-left: 5px !important;
}
.contact .v-card__title {
  font-size: 20px;
  margin-left: 5px !important;
}
.register-line {
  width: 200px;
  margin-left: 6%;
  border-bottom: 5px solid #eea632;
  position: absolute;
}
</style>
