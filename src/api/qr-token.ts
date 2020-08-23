import Vue from "vue";

export function createQRToken(id: number) {
  return Vue.axios.post(`/qr-token/shipping-info/${id}`);
}
