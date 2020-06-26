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
            <v-form ref="shippingLineForm" v-model="valid" lazy-validation>
              <v-text-field
                v-model="shippingLineLocal.username"
                :rules="[required('username')]"
                type="text"
                label="Tên đăng nhập"
              ></v-text-field>
              <v-text-field
                v-model="shippingLineLocal.password"
                :rules="[minLength('password', 6)]"
                type="text"
                label="Mật khẩu"
              ></v-text-field>
              <v-text-field
                v-model="shippingLineLocal.email"
                :rules="[email('email')]"
                type="text"
                label="Email"
              ></v-text-field>
              <v-text-field
                v-model="shippingLineLocal.phone"
                :rules="[minLength('phone', 10), maxLength('phone', 11)]"
                type="text"
                label="Số điện thoại"
              ></v-text-field>
              <v-text-field
                v-model="shippingLineLocal.address"
                type="text"
                :rules="[required('address')]"
                label="Địa chỉ"
              ></v-text-field>
              <v-btn
                color="primary"
                @click="valid ? (stepper = 2) : (stepper = 1)"
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
            <v-form ref="bookingForm" v-model="valid" lazy-validation>
              <v-layout col>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      v-model="shippingLineLocal.companyCode"
                      :counter="50"
                      :rules="[
                        minLength('Company code', 5),
                        maxLength('Company code', 50)
                      ]"
                      label="Mã công ty"
                      type="text"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      v-model="shippingLineLocal.companyName"
                      :rules="[required('tên công ty')]"
                      label="Tên công ty"
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
                      :rules="[required('người liên hệ')]"
                      label="Người liên hệ"
                      type="text"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      v-model="shippingLineLocal.website"
                      :rules="[required('website')]"
                      label="website"
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
                      label="Mô tả"
                      type="text"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      v-model="shippingLineLocal.companyAddress"
                      :rules="[required('companyAddress')]"
                      label="Địa chỉ công ty"
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
                      :rules="[required('tin')]"
                      label="Tin"
                      type="text"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      v-model="shippingLineLocal.fax"
                      :rules="[required('fax')]"
                      label="fax"
                      type="text"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-layout>
              <v-btn color="primary" @click="stepper = 3" :disabled="!valid"
                >Tiếp tục</v-btn
              >
              <v-btn text @click="stepper = 1">Quay lại</v-btn>
            </v-form>
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 3" step="3" :editable="editable"
            >Hoàn thành</v-stepper-step
          >

          <v-stepper-content step="3">
            <v-form ref="finishForm" v-model="valid" lazy-validation>
              <v-checkbox
                v-model="checkbox"
                :rules="[required('agree term')]"
                label="Bạn đồng ý muốn thêm hãng tàu với những thông tin trên?"
              ></v-checkbox>
              <v-btn
                color="primary"
                @click="addShippingLine()"
                :disabled="!valid || !checkbox"
                >Hoàn tất</v-btn
              >
              <v-btn text @click="stepper = 2">Quay lại</v-btn>
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
  @PropSync("shippingLine", { type: Object }) shippingLineSync!: IShippingLine;
  @PropSync("shippingLines", { type: Array }) shippingLinesSync!: Array<
    IShippingLine
  >;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  shippingLineLocal = {
    username: "",
    password: "",
    email: "",
    phone: "",
    roles: ["ROLE_SHIPPINGLINE"],
    status: "ACTIVE",
    address: "",
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
  valid = true;

  addShippingLine() {
    if (this.shippingLineLocal) {
      console.log(this.shippingLineSync);
      console.log(this.shippingLineLocal);
      this.shippingLineSync = this.shippingLineLocal;
      console.log(this.shippingLineSync);
      createShippingLine(this.shippingLineSync)
        .then(res => {
          const response: IShippingLine = res.data;
          console.log(response);
          this.messageSync =
            "Thêm mới thành công hãng tàu: " +
            this.shippingLineSync.companyCode;
          this.shippingLinesSync.push(this.shippingLineSync);
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
