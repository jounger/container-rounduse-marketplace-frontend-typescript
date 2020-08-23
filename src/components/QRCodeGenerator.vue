<template>
  <v-dialog v-model="dialogGenderSync" persistent max-width="450">
    <v-card>
      <v-card-title class="headline">Mã QR (Dành cho lái xe)</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <qrcode-vue :value="value" :size="size" level="H"></qrcode-vue>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogGenderSync = false">Trở về</v-btn>
        <v-btn @click="requestNewQRCode" color="primary">Tạo lại</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import QrcodeVue from "qrcode.vue";

@Component({
  components: {
    QrcodeVue
  }
})
export default class QRCodeGenerator extends Vue {
  @PropSync("dialogGender", { type: Boolean, default: false })
  dialogGenderSync!: boolean;

  size = 400;
  value = "https://example.com";

  requestNewQRCode() {
    // TODO: API Call
  }
}
</script>
