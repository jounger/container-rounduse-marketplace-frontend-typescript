<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            isUpdate ? "Cập nhập" : "Thêm mới"
          }}</span>
          <v-btn
            icon
            dark
            @click="dialogAddSync = false"
            style="margin-left:412px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Mã giảm giá"
                  name="code"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="discountSync.code"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Chi tiết"
                  name="detail"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="discountSync.detail"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-select
                  :items="currencies"
                  attach
                  label="Loại tiền tệ"
                  chips
                  v-model="discountSync.currency"
                ></v-select>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Phần trăm (%)"
                  name="percent"
                  prepend-icon="mdi-account"
                  type="number"
                  v-model="discountSync.percent"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Giảm giá nhiều nhất (%)"
                  name="maximumDiscount"
                  prepend-icon="mdi-account"
                  type="number"
                  v-model="discountSync.maximumDiscount"
                ></v-text-field>
              </v-flex>
            </v-layout>
            <v-layout row>
              <v-flex xs8>
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
                      v-model="expiredDateSync"
                      label="Ngày hết hạn"
                      hint="YYYY/MM/DD"
                      persistent-hint
                      prepend-icon="event"
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="expiredDateSync"
                    no-title
                    @input="expiredDatePicker = false"
                  ></v-date-picker>
                </v-menu>
              </v-flex>
            </v-layout>
          </v-layout>
          <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
        </v-form>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn @click="updateDiscount()" color="primary" v-if="isUpdate"
          >Cập nhập</v-btn
        >
        <v-btn @click="addDiscount()" color="primary" v-else>Thêm mới</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IDiscount } from "@/entity/discount";
import { createDiscount, updateDiscount } from "@/api/discount";

@Component
export default class CreateDiscount extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("discount", { type: Object }) discountSync!: IDiscount;
  @PropSync("discounts", { type: Array }) discountsSync!: Array<IDiscount>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @PropSync("expiredDate", { type: String }) expiredDateSync!: string;
  currencies = ["USD", "VND", "EURO"];
  expiredDatePicker = false;
  get isUpdate() {
    if (typeof this.discountSync.id !== "undefined") {
      return true;
    }
    return false;
  }
  addDiscount() {
    if (this.discountSync) {
      this.discountSync.expiredDate = this.expiredDateSync + "T00:00";
      console.log(this.discountSync.expiredDate);
      createDiscount(this.discountSync)
        .then(res => {
          console.log(res.data);
          const response: IDiscount = res.data;
          this.discountSync = response;
          this.messageSync =
            "Thêm mới thành công mã giảm giá: " + this.discountSync.code;
          this.discountsSync.push(this.discountSync);
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogAddSync = false))
        );
    }
  }
  updateDiscount() {
    if (this.discountSync.id) {
      updateDiscount(this.discountSync)
        .then(res => {
          console.log(res.data);
          const response: IDiscount = res.data;
          this.discountSync = response;
          this.messageSync =
            "Cập nhập thành công mã giảm giá: " + this.discountSync.code;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(
          () => ((this.snackbarSync = true), (this.dialogAddSync = false))
        );
    }
  }
}
</script>
