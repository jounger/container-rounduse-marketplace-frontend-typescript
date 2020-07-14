<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhập Mã giảm giá" : "Thêm mới Mã giảm giá"
          }}</span>
          <v-btn
            icon
            dark
            @click="dialogAddSync = false"
            style="margin-left:274px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-layout row>
            <v-layout col>
              <v-flex xs10>
                <v-text-field
                  label="Mã giảm giá*"
                  name="code"
                  prepend-icon="loyalty"
                  type="text"
                  v-model="discountLocal.code"
                  :rules="[required('code')]"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout col>
              <v-flex xs10>
                <v-text-field
                  label="Chi tiết"
                  name="detail"
                  prepend-icon="description"
                  type="text"
                  v-model="discountLocal.detail"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout row>
            <v-layout col>
              <v-flex xs10>
                <v-select
                  prepend-icon="monetization_on"
                  :items="currencies"
                  attach
                  label="Loại tiền tệ"
                  v-model="discountLocal.currency"
                ></v-select>
              </v-flex>
            </v-layout>
            <v-layout col>
              <v-flex xs10>
                <v-text-field
                  label="Phần trăm (%)"
                  name="percent"
                  prepend-icon="shopping_cart"
                  type="number"
                  v-model="discountLocal.percent"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout row>
            <v-layout col>
              <v-flex xs10>
                <v-text-field
                  label="Giảm giá nhiều nhất (%)"
                  name="maximumDiscount"
                  prepend-icon="swap_vert"
                  type="number"
                  v-model="discountLocal.maximumDiscount"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout col>
              <v-flex xs7>
                <v-menu
                  ref="expiredDatePicker"
                  v-model="expiredDatePicker"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="expiredDate"
                      label="Ngày hết hạn"
                      hint="YYYY/MM/DD"
                      persistent-hint
                      prepend-icon="remove_shopping_cart"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="expiredDate"
                    no-title
                    @input="expiredDatePicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs3>
                <v-text-field
                  label="Giờ hết hạn"
                  name="time"
                  type="time"
                  v-model="time"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn
          @click="updateDiscount()"
          color="primary"
          v-if="update"
          :disabled="!valid"
          >Cập nhập</v-btn
        >
        <v-btn
          @click="createDiscount()"
          color="primary"
          v-else
          :disabled="!valid"
          >Thêm mới</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IDiscount } from "@/entity/discount";
import { createDiscount, updateDiscount } from "@/api/discount";
import FormValidate from "@/mixin/form-validate";
import { addTimeToDate } from "@/utils/tool";

@Component({
  mixins: [FormValidate]
})
export default class CreateDiscount extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("discounts", { type: Array }) discountsSync!: Array<IDiscount>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) discount!: IDiscount;
  @Prop(Boolean) update!: boolean;

  currencies: Array<string> = [];
  valid = false;
  expiredDatePicker = false;
  dateInit = addTimeToDate(new Date().toString());
  expiredDate = this.dateInit.slice(0, 10);
  time = this.dateInit.slice(11, 16);
  discountLocal = {
    code: "",
    detail: "",
    currency: "VND",
    percent: 0,
    maximumDiscount: 0,
    expiredDate: this.dateInit.slice(0, 10)
  } as IDiscount;
  test = 0;
  created() {
    this.currencies = ["USD", "VND"];
    if (this.update) {
      this.discountLocal = Object.assign({}, this.discount);
      this.expiredDate = this.discountLocal.expiredDate.slice(0, 10);
      this.time = this.discountLocal.expiredDate.slice(11, 16);
      console.log(this.discountLocal.expiredDate);
      console.log(this.time);
    }
  }
  createDiscount() {
    if (this.discountLocal) {
      this.discountLocal.expiredDate = this.expiredDate + "T" + this.time;
      createDiscount(this.discountLocal)
        .then(res => {
          const response: IDiscount = res.data;
          this.messageSync =
            "Thêm mới thành công mã giảm giá: " + response.code;
          this.discountsSync.unshift(response);
          this.totalItemsSync += 1;
          console.log(this.totalItemsSync);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  updateDiscount() {
    if (this.discountLocal.id) {
      this.discountLocal.expiredDate = this.expiredDate + "T" + this.time;
      updateDiscount(this.discountLocal)
        .then(res => {
          console.log(res.data);
          const response: IDiscount = res.data;
          this.messageSync =
            "Cập nhập thành công mã giảm giá: " + response.code;
          const index = this.discountsSync.findIndex(x => x.id == response.id);

          this.discountsSync.splice(index, 1, response);
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
