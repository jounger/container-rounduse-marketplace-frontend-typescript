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
            style="margin-left:412px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-layout col>
            <v-layout row>
              <v-flex xs8>
                <v-text-field
                  label="Mã giảm giá*"
                  name="code"
                  prepend-icon="mdi-account"
                  type="text"
                  v-model="discountLocal.code"
                  :rules="[required('code')]"
                  :readonly="readonly"
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
                  v-model="discountLocal.detail"
                  :readonly="readonly"
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
                  v-model="discountLocal.currency"
                  :readonly="readonly"
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
                  v-model="discountLocal.percent"
                  :readonly="readonly"
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
                  v-model="discountLocal.maximumDiscount"
                  :readonly="readonly"
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
                      v-model="discountLocal.expiredDate"
                      label="Ngày hết hạn"
                      hint="YYYY/MM/DD"
                      persistent-hint
                      prepend-icon="event"
                      v-bind="attrs"
                      v-on="on"
                      :readonly="readonly"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-if="!readonly"
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
        <v-btn @click="updateDiscount()" color="primary" v-if="update"
          >Cập nhập</v-btn
        >
        <v-btn
          @click="createDiscount()"
          color="primary"
          v-else
          :disabled="readonly"
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
import { convertToDateTime } from "@/utils/tool";

@Component
export default class CreateDiscount extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("discount", { type: Object }) discountSync!: IDiscount;
  @PropSync("discounts", { type: Array }) discountsSync!: Array<IDiscount>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  @Prop(Boolean) update!: boolean;

  currencies = ["USD", "VND", "EURO"];
  expiredDatePicker = false;
  readonly = false;
  discountLocal = {} as IDiscount;
  created() {
    this.discountLocal = Object.assign({}, this.discountSync);
  }
  createDiscount() {
    if (this.discountLocal) {
      this.discountLocal.expiredDate = convertToDateTime(
        this.discountLocal.expiredDate
      );
      createDiscount(this.discountLocal)
        .then(res => {
          const response: IDiscount = res.data;
          this.discountLocal.id = response.id;
          this.messageSync =
            "Thêm mới thành công mã giảm giá: " + this.discountLocal.code;
          this.discountsSync.unshift(this.discountLocal);
          this.readonly = true;
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
      this.discountLocal.expiredDate = convertToDateTime(
        this.discountLocal.expiredDate
      );
      this.discountSync = Object.assign({}, this.discountLocal);
      updateDiscount(this.discountSync)
        .then(res => {
          console.log(res.data);
          const response: IDiscount = res.data;
          this.discountSync = response;
          this.messageSync =
            "Cập nhập thành công mã giảm giá: " + this.discountSync.code;
          const index = this.discountsSync.findIndex(
            x => x.id === this.discountSync.id
          );
          this.discountsSync.splice(index, 1, this.discountSync);
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
