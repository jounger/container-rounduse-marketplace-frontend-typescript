<template>
  <v-dialog v-model="dialogAddSync" max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">{{
            update ? "Cập nhập Mã giảm giá" : "Thêm mới Mã giảm giá"
          }}</span></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Mã giảm giá*"
                name="code"
                :readonly="update"
                prepend-icon="loyalty"
                type="text"
                v-model="discountLocal.code"
                :rules="[required('mã giảm giá')]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Chi tiết"
                name="detail"
                prepend-icon="description"
                type="text"
                v-model="discountLocal.detail"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-select
                prepend-icon="monetization_on"
                :items="currencies"
                attach
                label="Loại tiền tệ"
                v-model="discountLocal.currency"
              ></v-select>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Phần trăm (%)"
                name="percent"
                prepend-icon="shopping_cart"
                type="number"
                v-model="discountLocal.percent"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Giảm giá nhiều nhất (%)"
                name="maximumDiscount"
                prepend-icon="swap_vert"
                type="number"
                v-model="discountLocal.maximumDiscount"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="5" style="margin-top: -12px;">
              <DatetimePicker
                :datetime="discountLocal.expiredDate"
                :return-value.sync="discountLocal.expiredDate"
                dateicon="remove_shopping_cart"
                datelabel="Ngày hết hạn"
                timelabel="Giờ hết hạn"
              />
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
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
import { createDiscount, editDiscount } from "@/api/discount";
import FormValidate from "@/mixin/form-validate";
import { addTimeToDate } from "@/utils/tool";
import DatetimePicker from "@/components/DatetimePicker.vue";
import { getErrorMessage } from "@/utils/tool";
import snackbar from "@/store/modules/snackbar";

@Component({
  mixins: [FormValidate],
  components: {
    DatetimePicker
  }
})
export default class CreateDiscount extends Vue {
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("discounts", { type: Array }) discountsSync!: Array<IDiscount>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;
  @Prop(Object) discount!: IDiscount;
  @Prop(Boolean) update!: boolean;

  currencies: Array<string> = [];
  valid = false;
  dateInit = addTimeToDate(new Date().toString());
  discountLocal = {
    code: "",
    detail: "",
    currency: "VND",
    percent: 0,
    maximumDiscount: 0,
    expiredDate: this.dateInit
  } as IDiscount;
  created() {
    this.currencies = ["USD", "VND"];
    if (this.update) {
      this.discountLocal = Object.assign({}, this.discount);
    }
  }
  async createDiscount() {
    if (this.discountLocal) {
      const _discount = await createDiscount(this.discountLocal)
        .then(res => {
          const response: IDiscount = res.data;
          snackbar.setSnackbar({
            text: "Thêm mới thành công Mã giảm giá: " + response.code,
            color: "success"
          });
          return response;
        })
        .catch(err => {
          console.log(err);
          snackbar.setSnackbar({
            text: getErrorMessage(err),
            color: "error"
          });
          return null;
        });
      if (_discount) {
        this.discountsSync.unshift(_discount);
        this.totalItemsSync += 1;
        this.dialogAddSync = false;
      }
      snackbar.setDisplay(true);
    }
  }
  async updateDiscount() {
    if (this.discountLocal.id) {
      const _discount = await editDiscount(
        this.discountLocal.id,
        this.discountLocal
      )
        .then(res => {
          console.log(res.data);
          const response: IDiscount = res.data;
          snackbar.setSnackbar({
            text: "Cập nhật thành công Mã giảm giá: " + response.code,
            color: "success"
          });
          return response;
        })
        .catch(err => {
          console.log(err);
          snackbar.setSnackbar({
            text: getErrorMessage(err),
            color: "error"
          });
          return null;
        });
      if (_discount) {
        const index = this.discountsSync.findIndex(x => x.id == _discount.id);
        this.discountsSync.splice(index, 1, _discount);
      }
      snackbar.setDisplay(true);
    }
  }
}
</script>
