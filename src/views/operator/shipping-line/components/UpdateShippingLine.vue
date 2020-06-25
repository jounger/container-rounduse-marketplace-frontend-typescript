<template>
  <v-dialog
    v-model="dialogEditSync"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogEditSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Chỉnh sửa</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialogEditSync = false">Trở về</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-list three-line subheader>
        <v-stepper v-model="stepper" vertical>
          <v-stepper-step :complete="stepper > 1" step="1" :editable="editable">
            Thông tin hãng tàu
            <small>Thông tin chung</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-form ref="shippingLineForm" v-model="valid" lazy-validation>
              <v-text-field
                v-model="shippingLineSync.username"
                :rules="[required('username')]"
                type="text"
                label="Tên đăng nhập"
                readonly
              ></v-text-field>
              <v-text-field
                v-model="shippingLineSync.email"
                :rules="[email('email')]"
                type="text"
                label="Email"
              ></v-text-field>
              <v-text-field
                v-model="shippingLineSync.phone"
                :rules="[minLength('phone', 10), maxLength('phone', 11)]"
                type="text"
                label="Số điện thoại"
              ></v-text-field>
              <v-text-field
                v-model="shippingLineSync.address"
                type="text"
                :rules="[required('address')]"
                label="Địa chỉ"
              ></v-text-field>
              <v-btn
                color="primary"
                @click="updateShippingLine()"
                :disabled="!valid"
                >Lưu và tiếp tục</v-btn
              >
              <!-- <v-btn text @click="dialogEditSync = false">Hủy</v-btn> -->
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
                      v-model="shippingLineSync.companyCode"
                      :counter="50"
                      :rules="[
                        minLength('Company code', 5),
                        maxLength('Company code', 50)
                      ]"
                      label="Mã công ty"
                      type="text"
                      readonly
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      v-model="shippingLineSync.companyName"
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
                      v-model="shippingLineSync.contactPerson"
                      :rules="[required('người liên hệ')]"
                      label="Người liên hệ"
                      type="text"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      v-model="shippingLineSync.website"
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
                      v-model="shippingLineSync.companyDescription"
                      label="Mô tả"
                      type="text"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      v-model="shippingLineSync.companyAddress"
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
                      v-model="shippingLineSync.tin"
                      :rules="[required('tin')]"
                      label="Tin"
                      type="text"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs8>
                    <v-text-field
                      v-model="shippingLineSync.fax"
                      :rules="[required('fax')]"
                      label="fax"
                      type="text"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-layout>
              <v-select
                v-model="shippingLineSync.status"
                :items="allStatus"
                :rules="[required('status')]"
                label="Trạng thái"
              ></v-select>
              <v-btn
                color="primary"
                @click="updateShippingLine()"
                :disabled="!valid"
                >Hoàn tất</v-btn
              >
              <v-btn text @click="stepper = 1">Quay lại</v-btn>
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
import FormValidate from "@/mixin/form-validate";
import { editShippingLine } from "@/api/shipping-line";

@Component({
  mixins: [FormValidate]
})
export default class UpdateShippingLine extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @PropSync("shippingLine", { type: Object }) shippingLineSync!: IShippingLine;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  // Form validate
  checkbox = false;
  editable = true;
  stepper = 1;
  valid = true;
  allStatus = ["PENDING", "ACTIVE", "BANNED"];

  // ShippingLine Update
  updateShippingLine() {
    if (this.shippingLineSync.id) {
      editShippingLine(this.shippingLineSync.id, this.shippingLineSync)
        .then(res => {
          console.log(res.data);
          const response: IShippingLine = res.data;
          this.shippingLineSync = response;
          this.messageSync =
            "Cập nhập thành công hãng tàu: " +
            this.shippingLineSync.companyCode;
          this.stepper = 2;
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
