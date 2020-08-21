<template>
  <v-dialog v-model="dialogEditSync" max-width="500">
    <v-card>
      <v-card-title class="headline"
        >Cập nhật trạng thái đơn vận chuyển</v-card-title
      >
      <v-divider></v-divider>
      <v-card-text>
        <v-form>
          <v-row
            ><v-col cols="12" sm="12">
              <v-text-field
                v-model="shippingInfoLocal.container.number"
                prepend-icon="local_offer"
                type="text"
                label="Container No."
                disabled
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="12">
              <v-select
                v-model="shippingInfoLocal.status"
                prepend-icon="directions_boat"
                :items="shippingInfoStatus"
                item-text="vi"
                item-value="en"
                :rules="[required('trạng thái')]"
                no-data-text="Danh sách trạng thái rỗng."
                label="Trạng thái đơn vận chuyển"
              ></v-select>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogEditSync = false">Trở về</v-btn>
        <v-btn @click="updateShippingInfo()" color="primary"
          >Cập nhật trạng thái</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import { IShippingInfo } from "@/entity/shipping-info";
import { editShippingInfo } from "@/api/shipping-info";
import FormValidate from "@/mixin/form-validate";

@Component({
  mixins: [FormValidate]
})
export default class UpdateShippingInfo extends Vue {
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @Prop(Object) shippingInfo!: IShippingInfo;
  @PropSync("shippingInfos", { type: Array })
  shippingInfosSync!: IShippingInfo[];

  shippingInfoStatus = [] as object[];
  shippingInfoLocal = null as IShippingInfo | null;

  async updateShippingInfo() {
    if (this.shippingInfoLocal) {
      const _res = await editShippingInfo(this.shippingInfo.id as number, {
        status: this.shippingInfoLocal.status
      });
      if (_res.data) {
        const _shippingInfo = _res.data.data;
        const index = this.shippingInfosSync.findIndex(
          x => x.id === _shippingInfo.id
        );
        this.shippingInfosSync.splice(index, 1, _shippingInfo);
        this.dialogEditSync = false;
      }
    }
  }

  created() {
    this.shippingInfoStatus = [
      { en: "PENDING", vi: "Chờ xác nhận" },
      { en: "INFO_RECEIVED", vi: "Đã nhận lệnh" },
      { en: "SHIPPING", vi: "Đang vận chuyển" },
      { en: "DELIVERED", vi: "Đã giao hàng" },
      { en: "EXCEPTION", vi: "Đã có lỗi xảy ra" }
    ];
    this.shippingInfoLocal = Object.assign({}, this.shippingInfo);
  }
}
</script>
