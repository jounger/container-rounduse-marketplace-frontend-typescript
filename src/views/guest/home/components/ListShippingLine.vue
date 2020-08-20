<template>
  <v-card outlined height="200" class="shipping-line">
    <v-row justify="center" align="center">
      <p>
        Đọc <a>điều kiện</a> để trở thành thành viên của trang Web và gia nhập
        vào cộng đồng Logistics lớn nhất Việt Nam
      </p>
    </v-row>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ListShippingLine extends Vue {
  shippingLines = ["@/assets/images/logos_rahmen01.jpg"];
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
