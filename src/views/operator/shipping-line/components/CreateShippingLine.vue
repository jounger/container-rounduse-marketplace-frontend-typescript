<template>
  <v-dialog
    v-model="dialogAddSync"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogAddSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Thêm mới</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="addShippingLine()">Thêm mới</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-list three-line subheader>
        <v-stepper v-model="stepper" vertical>
          <v-stepper-step :complete="stepper > 1" step="1" :editable="editable">
            Thêm mới hãng tàu
            <small>Thông tin chung</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-form ref="shippingLineForm" v-model="valid" validation>
              <small>*Dấu sao là trường bắt buộc</small>
              <v-layout col
                ><v-layout row
                  ><v-flex xs10>
                    <v-text-field
                      v-model="shippingLineLocal.username"
                      :counter="20"
                      :rules="[
                        minLength('username', 2),
                        maxLength('username', 20)
                      ]"
                      type="text"
                      label="Tên đăng nhập*"
                    ></v-text-field> </v-flex></v-layout
                ><v-layout row
                  ><v-flex xs10>
                    <v-text-field
                      v-model="shippingLineLocal.password"
                      :counter="120"
                      :rules="[
                        minLength('password', 6),
                        maxLength('password', 120)
                      ]"
                      type="password"
                      label="Mật khẩu*"
                    ></v-text-field> </v-flex></v-layout
              ></v-layout>
              <v-layout col
                ><v-layout row
                  ><v-flex xs10>
                    <v-text-field
                      v-model="shippingLineLocal.email"
                      :counter="50"
                      :rules="[
                        email('Shipping Line'),
                        minLength('email', 5),
                        maxLength('email', 50)
                      ]"
                      type="text"
                      label="Email*"
                    ></v-text-field> </v-flex></v-layout
                ><v-layout row
                  ><v-flex xs10>
                    <v-text-field
                      v-model="shippingLineLocal.phone"
                      :counter="10"
                      :rules="[minLength('phone', 10), maxLength('phone', 10)]"
                      type="text"
                      label="Số điện thoại*"
                    ></v-text-field> </v-flex></v-layout
              ></v-layout>
              <v-layout col
                ><v-layout row
                  ><v-flex xs11>
                    <v-text-field
                      v-model="shippingLineLocal.address"
                      type="text"
                      :counter="100"
                      :rules="[
                        minLength('address', 5),
                        maxLength('address', 100)
                      ]"
                      label="Địa chỉ*"
                    ></v-text-field> </v-flex></v-layout
              ></v-layout>
              <v-btn
                color="primary"
                @click="
                  stepper = 2;
                  valid = false;
                "
                :disabled="!valid"
                >Tiếp tục</v-btn
              >
              <!-- <v-btn text @click="dialogAddSync = false">Hủy</v-btn> -->
            </v-form>
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable"
            >Thông tin hãng tàu</v-stepper-step
          >

          <v-stepper-content step="2">
            <v-form ref="bookingForm" v-model="valid" validation>
              <small>*Dấu sao là trường bắt buộc</small>
              <v-layout col>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      v-model="shippingLineLocal.companyCode"
                      :counter="10"
                      :rules="[
                        minLength('Company code', 2),
                        maxLength('Company code', 10)
                      ]"
                      label="Mã công ty*"
                      type="text"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      v-model="shippingLineLocal.companyName"
                      :counter="100"
                      :rules="[
                        minLength('Company name', 5),
                        maxLength('Company name', 100)
                      ]"
                      label="Tên công ty*"
                      type="text"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-layout>
              <v-layout col>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      v-model="shippingLineLocal.contactPerson"
                      :counter="50"
                      :rules="[
                        minLength('contact person', 5),
                        maxLength('contact person', 50)
                      ]"
                      label="Người liên hệ*"
                      type="text"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      v-model="shippingLineLocal.website"
                      :counter="50"
                      :rules="[
                        minLength('website', 5),
                        maxLength('website', 50)
                      ]"
                      label="Website*"
                      type="text"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-layout>
              <v-layout col>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      v-model="shippingLineLocal.companyDescription"
                      label="Mô tả*"
                      :counter="200"
                      :rules="[
                        minLength('company description', 5),
                        maxLength('company description', 200)
                      ]"
                      type="text"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      v-model="shippingLineLocal.companyAddress"
                      :counter="200"
                      :rules="[
                        minLength('company address', 5),
                        maxLength('company address', 200)
                      ]"
                      label="Địa chỉ công ty*"
                      type="text"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-layout>
              <v-layout col>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      v-model="shippingLineLocal.tin"
                      :counter="20"
                      :rules="[minLength('tin', 5), maxLength('tin', 20)]"
                      label="Tin*"
                      type="text"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      v-model="shippingLineLocal.fax"
                      :counter="20"
                      :rules="[minLength('fax', 5), maxLength('fax', 20)]"
                      label="Fax*"
                      type="text"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-layout>
              <v-btn
                color="primary"
                @click="
                  stepper = 3;
                  valid = true;
                "
                :disabled="!valid"
                >Tiếp tục</v-btn
              >
              <v-btn
                text
                @click="
                  stepper = 1;
                  valid = true;
                "
                >Quay lại</v-btn
              >
            </v-form>
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 3" step="3" :editable="editable"
            >Hoàn thành</v-stepper-step
          >

          <v-stepper-content step="3">
            <v-form ref="finishForm" v-model="valid" validation>
              <v-checkbox
                v-model="checkbox"
                label="Bạn đồng ý muốn thêm hãng tàu với những thông tin trên?"
              ></v-checkbox>
              <v-btn
                color="primary"
                @click="createShippingLine()"
                :disabled="!valid || !checkbox"
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
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { IShippingLine } from "@/entity/shipping-line";
import { createShippingLine } from "@/api/shipping-line";
import FormValidate from "@/mixin/form-validate";

@Component({
  mixins: [FormValidate]
})
export default class CreateShippingLine extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("shippingLines", { type: Array }) shippingLinesSync!: Array<
    IShippingLine
  >;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  shippingLineLocal = {
    username: "",
    email: "",
    phone: "",
    roles: ["ROLE_SHIPPINGLINE"],
    status: "",
    address: "",
    password: "",
    website: "",
    contactPerson: "",
    companyName: "",
    companyCode: "",
    companyDescription: "",
    companyAddress: "",
    tin: "",
    fax: "",
    ratingValue: 0
  } as IShippingLine;

  checkbox = false;
  editable = false;
  stepper = 1;
  valid = false;

  createShippingLine() {
    if (this.shippingLineLocal) {
      console.log(this.shippingLineLocal);
      createShippingLine(this.shippingLineLocal)
        .then(res => {
          const response: IShippingLine = res.data;
          this.messageSync =
            "Thêm mới thành công hãng tàu: " + response.companyCode;
          this.shippingLinesSync.unshift(response);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
}
</script>
