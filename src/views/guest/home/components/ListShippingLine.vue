<template>
  <v-card outlined height="200" class="shipping-line" flat>
    <v-row justify="center" align="center">
      <p>
        Đọc <a>điều khoản hoạt động</a> và
        <router-link to="/register" @click.native="scrollToTop"
          >đăng ký ngay</router-link
        >
        để trở thành thành viên của trang Web và gia nhập vào cộng đồng
        Logistics lớn nhất Việt Nam
      </p>
    </v-row>
    <v-row justify="center">
      <div v-for="pic in shippingLines" :key="pic">
        <v-col cols="12" md="1">
          <img width="70" :src="getPic(pic)" alt="pic"
        /></v-col></div
    ></v-row>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ListShippingLine extends Vue {
  shippingLines = [
    "logos_rahmen01",
    "logos_rahmen02",
    "logos_rahmen03",
    "logos_rahmen04",
    "logos_rahmen05",
    "logos_rahmen06",
    "logos_rahmen07",
    "logos_rahmen09",
    "logos_rahmen10",
    "logos_rahmen11",
    "logos_rahmen12",
    "logos_rahmen13"
  ];
  getPic(item: string) {
    return require("@/assets/images/" + item + ".jpg");
  }
  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
</script>
<style scoped lang="css">
.shipping-line {
  background-color: rgba(221, 221, 221, 0.2) !important;
}
.shipping-line p {
  margin-top: 50px;
  font-size: 14px;
}
.shipping-line p a {
  color: #00532f;
  text-decoration: none;
}
.shipping-line p a:hover {
  text-decoration: underline;
}
</style>
