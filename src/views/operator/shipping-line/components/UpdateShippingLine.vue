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
              <small>*Dấu sao là trường bắt buộc</small>
              <v-row
                ><v-col cols="12" md="6">
                  <v-text-field
                    v-model="shippingLineLocal.username"
                    prepend-icon="mdi-account"
                    :counter="20"
                    :rules="[
                      minLength('username', 2),
                      maxLength('username', 20)
                    ]"
                    type="text"
                    label="Tên đăng nhập*"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shippingLineLocal.phone"
                    prepend-icon="phone"
                    :counter="10"
                    :rules="[minLength('phone', 10), maxLength('phone', 10)]"
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
                      email('Shipping Line'),
                      minLength('email', 5),
                      maxLength('email', 50)
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
                      minLength('address', 5),
                      maxLength('address', 100)
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
              <!-- <v-btn text @click="dialogEditSync = false">Hủy</v-btn> -->
            </v-form>
          </v-stepper-content>

          <v-stepper-step :complete="stepper > 2" step="2" :editable="editable"
            >Thông tin hãng tàu</v-stepper-step
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
                      minLength('Company code', 2),
                      maxLength('Company code', 10)
                    ]"
                    label="Mã công ty*"
                    type="text"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shippingLineLocal.companyName"
                    prepend-icon="directions_boat"
                    :counter="100"
                    :rules="[
                      minLength('Company name', 5),
                      maxLength('Company name', 100)
                    ]"
                    label="Tên công ty*"
                    type="text"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shippingLineLocal.contactPerson"
                    prepend-icon="add_ic_call"
                    :counter="50"
                    :rules="[
                      minLength('contact person', 5),
                      maxLength('contact person', 50)
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
                    :rules="[minLength('website', 5), maxLength('website', 50)]"
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
                      minLength('company description', 5),
                      maxLength('company description', 200)
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
                      minLength('company address', 5),
                      maxLength('company address', 200)
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
                    prepend-icon="contact_phone"
                    :counter="20"
                    :rules="[minLength('tin', 5), maxLength('tin', 20)]"
                    label="Tin*"
                    type="number"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="shippingLineLocal.fax"
                    prepend-icon="perm_phone_msg"
                    :counter="20"
                    :rules="[minLength('fax', 5), maxLength('fax', 20)]"
                    label="Fax*"
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
                    :rules="[required('status')]"
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
import { getErrorMessage } from "@/utils/tool";

@Component({
  mixins: [FormValidate]
})
export default class UpdateShippingLine extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("shippingLines", { type: Array }) shippingLinesSync!: Array<
    IShippingLine
  >;
  @Prop(Object) shippingLine!: IShippingLine;

  // Form validate
  checkbox = false;
  editable = true;
  stepper = 1;
  valid = true;
  valid1 = true;
  allStatus: Array<string> = [];
  shippingLineLocal = {} as IShippingLine;
  created() {
    this.allStatus = ["PENDING", "ACTIVE", "BANNED"];
    this.shippingLineLocal = Object.assign({}, this.shippingLine);
  }
  // ShippingLine Update
  updateShippingLine() {
    if (this.shippingLineLocal.id) {
      editShippingLine(this.shippingLineLocal.id, this.shippingLineLocal)
        .then(res => {
          console.log(res.data);
          const response: IShippingLine = res.data;
          this.messageSync =
            "Cập nhập thành công hãng tàu: " + response.companyCode;
          const index = this.shippingLinesSync.findIndex(
            x => x.id == response.id
          );
          this.shippingLinesSync.splice(index, 1, response);
          this.stepper = 2;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = getErrorMessage(err);
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
}
</script>
