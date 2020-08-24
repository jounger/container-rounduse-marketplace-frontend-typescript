<template>
  <v-dialog v-model="dialogGenderSync" persistent max-width="450">
    <v-card v-if="value">
      <v-card-title class="headline"
        >Mã QR cho container: #{{ shippingInfo.container.number }}</v-card-title
      >
      <v-divider></v-divider>
      <v-card-text>
        <qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogGenderSync = false">Trở về</v-btn>
        <v-btn @click="requestNewQRCode()" color="primary">Tạo lại</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Prop } from "vue-property-decorator";
import QrcodeVue from "qrcode.vue";
import { createQRToken } from "@/api/qr-token";
import { IShippingInfo } from "@/entity/shipping-info";
import { IToken } from "@/entity/token";

@Component({
  components: {
    QrcodeVue
  }
})
export default class QRCodeGenerator extends Vue {
  @PropSync("dialogGender", { type: Boolean, default: false })
  dialogGenderSync!: boolean;
  @Prop() shippingInfo!: IShippingInfo;

  size = 400;
  value = "";

  async requestNewQRCode() {
    const _res = await createQRToken(this.shippingInfo.id as number);
    if (_res.data) {
      const _token = _res.data.data as IToken;
      this.value = _token.token;
    }
  }

  created() {
    this.requestNewQRCode();
  }
}
</script>
