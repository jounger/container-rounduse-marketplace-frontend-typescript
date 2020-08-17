<template>
  <v-dialog v-model="dialogAddSync" max-width="600">
    <v-card>
      <v-card-title class="headline">{{
        update ? "Cập nhật Mã giảm giá" : "Thêm mới Mã giảm giá"
      }}</v-card-title>
      <v-card-text>
        <v-form v-model="valid" validation>
          <small>*Dấu sao là trường bắt buộc</small>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                label="Mã giảm giá*"
                name="code"
                :disabled="update"
                prepend-icon="loyalty"
                type="text"
                v-model="discountLocal.code"
                :rules="[required('mã giảm giá')]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                label="Giảm (%)"
                name="percent"
                prepend-icon="shopping_cart"
                type="number"
                v-model="discountLocal.percent"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <DatetimePicker
                :datetime="discountLocal.expiredDate"
                :return-value.sync="discountLocal.expiredDate"
                dateicon="remove_shopping_cart"
                datelabel="Ngày hết hạn"
                timelabel="Giờ hết hạn"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field
                label="Giảm nhiều nhất (money)"
                name="maximumDiscount"
                prepend-icon="swap_vert"
                type="number"
                v-model="discountLocal.maximumDiscount"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                prepend-icon="monetization_on"
                :items="currencies"
                attach
                label="Loại tiền tệ"
                v-model="discountLocal.currency"
              ></v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <v-textarea
                label="Chi tiết"
                name="detail"
                prepend-icon="description"
                outlined
                v-model="discountLocal.detail"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn
          @click="updateDiscount()"
          color="primary"
          v-if="update"
          :disabled="!valid"
          >Cập nhật</v-btn
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
      const _res = await createDiscount(this.discountLocal);
      if (_res.data) {
        const _discount = _res.data.data;
        this.discountsSync.unshift(_discount);
        this.totalItemsSync += 1;
        this.dialogAddSync = false;
      }
    }
  }

  async updateDiscount() {
    if (this.discountLocal.id) {
      const _res = await editDiscount(
        this.discountLocal.id,
        this.discountLocal
      );
      if (_res.data) {
        const _discount = _res.data.data;
        const index = this.discountsSync.findIndex(x => x.id == _discount.id);
        this.discountsSync.splice(index, 1, _discount);
      }
    }
  }
}
</script>
