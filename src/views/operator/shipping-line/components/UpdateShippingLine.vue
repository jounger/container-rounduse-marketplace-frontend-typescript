<template>
  <v-dialog
    v-model="dialogEditSync"
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogEditSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Chỉnh sửa hãng tàu</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="dialogEditSync = false">Trở về</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-list three-line subheader>
        <v-stepper v-model="stepper" vertical class="elevation-0">
          <v-stepper-step :complete="stepper > 1" step="1" :editable="editable">
            Thông tin đăng nhập
            <small>Thông tin chung</small>
          </v-stepper-step>

          <v-stepper-content step="1">
            <v-form ref="shippingLineForm" v-model="valid" lazy-validation>
              <small>*Dấu sao là trường bắt buộc</small>
              <v-row
                ><v-col cols="12" md="6">
                  <v-text-field
                    v-model="shippingLineLocal.username"
                    prepend-icon="mdi-account"
                    :counter="20"
                    :rules="[
                      minLength('Tên đăng nhập', 2),
                      maxLength('Tên đăng nhập', 20)
                    ]"
                    type="text"
                    label="Tên đăng nhập*"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shippingLineLocal.phone"
                    prepend-icon="phone"
                    :counter="10"
                    :rules="[
                      minLength('Số điện thoại', 10),
                      maxLength('Số điện thoại', 10)
                    ]"
                    type="number"
                    label="Số điện thoại*"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row
                ><v-col cols="12" md="6">
                  <v-text-field
                    v-model="shippingLineLocal.email"
                    prepend-icon="alternate_email"
                    :counter="50"
                    :rules="[
                      email('hãng tàu'),
                      minLength('Email', 5),
                      maxLength('Email', 50)
                    ]"
                    type="text"
                    label="Email*"
                  ></v-text-field> </v-col
                ><v-col cols="12" md="6">
                  <v-text-field
                    v-model="shippingLineLocal.address"
                    prepend-icon="location_on"
                    type="text"
                    :counter="100"
                    :rules="[
                      minLength('Địa chỉ hãng tàu', 5),
                      maxLength('Địa chỉ hãng tàu', 100)
                    ]"
                    label="Địa chỉ*"
                  ></v-text-field> </v-col
              ></v-row>
              <v-btn
                color="primary"
                @click="updateShippingLine()"
                :disabled="!valid"
                >Lưu và tiếp tục</v-btn
              >
              <!-- <v-btn text @click="dialogEditSync = false">Trở về</v-btn> -->
            </v-form>
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable"
            >Thông tin hãng tàu<small>Thông tin công ty</small></v-stepper-step
          >

          <v-stepper-content step="2">
            <v-form ref="bookingForm" v-model="valid1" lazy-validation>
              <small>*Dấu sao là trường bắt buộc</small>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shippingLineLocal.companyCode"
                    prepend-icon="verified_user"
                    :counter="10"
                    :rules="[
                      minLength('Mã công ty', 2),
                      maxLength('Mã công ty', 10)
                    ]"
                    label="Mã công ty*"
                    type="text"
                    disabled
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shippingLineLocal.companyName"
                    prepend-icon="directions_boat"
                    :counter="100"
                    :rules="[
                      minLength('Tên công ty', 5),
                      maxLength('Tên công ty', 100)
                    ]"
                    label="Tên công ty*"
                    type="text"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shippingLineLocal.fullname"
                    prepend-icon="add_ic_call"
                    :counter="50"
                    :rules="[
                      minLength('Người liên hệ', 5),
                      maxLength('Người liên hệ', 50)
                    ]"
                    label="Người liên hệ*"
                    type="text"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shippingLineLocal.website"
                    prepend-icon="copyright"
                    :counter="50"
                    :rules="[minLength('Website', 5), maxLength('Website', 50)]"
                    label="Website*"
                    type="text"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shippingLineLocal.companyDescription"
                    prepend-icon="description"
                    label="Mô tả*"
                    :counter="200"
                    :rules="[
                      minLength('Mô tả công ty', 5),
                      maxLength('Mô tả công ty', 200)
                    ]"
                    type="text"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shippingLineLocal.companyAddress"
                    prepend-icon="location_city"
                    :counter="200"
                    :rules="[
                      minLength('Địa chỉ công ty', 5),
                      maxLength('Địa chỉ công ty', 200)
                    ]"
                    label="Địa chỉ công ty*"
                    type="text"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shippingLineLocal.tin"
                    prepend-icon="card_travel"
                    :counter="20"
                    :rules="[
                      minLength('Mã số thuế', 5),
                      maxLength('Mã số thuế', 20)
                    ]"
                    disabled
                    label="Mã số thuế*"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shippingLineLocal.fax"
                    prepend-icon="perm_phone_msg"
                    :counter="20"
                    :rules="[minLength('FAX', 5), maxLength('FAX', 20)]"
                    label="FAX*"
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="shippingLineLocal.status"
                    prepend-icon="insert_emoticon"
                    :items="allStatus"
                    :rules="[required('trạng thái hoạt động')]"
                    label="Trạng thái"
                  >
                  </v-select> </v-col
              ></v-row>
              <v-btn
                color="primary"
                @click="updateShippingLine()"
                :disabled="!valid1"
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
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IShippingLine } from "@/entity/shipping-line";
import FormValidate from "@/mixin/form-validate";
import { editShippingLine } from "@/api/shipping-line";

@Component({
  mixins: [FormValidate]
})
export default class UpdateShippingLine extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @PropSync("shippingLines", { type: Array })
  shippingLinesSync!: IShippingLine[];
  @Prop(Object) shippingLine!: IShippingLine;

  // Form validate
  checkbox = false;
  editable = true;
  stepper = 1;
  valid = true;
  valid1 = true;
  allStatus: Array<string> = [];
  shippingLineLocal = null as IShippingLine | null;

  created() {
    this.allStatus = ["ACTIVE", "BANNED"];
    this.shippingLineLocal = Object.assign({}, this.shippingLine);
  }

  async updateShippingLine() {
    if (this.shippingLineLocal && this.shippingLineLocal.id) {
      const _res = await editShippingLine(
        this.shippingLineLocal.id,
        this.shippingLineLocal
      );
      if (_res.data) {
        const _shippingLine = _res.data.data;
        const index = this.shippingLinesSync.findIndex(
          x => x.id == _shippingLine.id
        );
        this.shippingLinesSync.splice(index, 1, _shippingLine);
        if (this.stepper == 2) {
          this.dialogEditSync = false;
        } else {
          this.stepper = 2;
        }
      }
    }
  }
}
</script>
