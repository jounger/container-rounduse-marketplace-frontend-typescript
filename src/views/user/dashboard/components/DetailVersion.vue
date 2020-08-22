<template>
  <section style="height:420px">
    <v-container>
      <v-row>
        <v-col cols="12" md="2">
          <h1>1.0</h1>
          <h3 class="ml-2">Version</h3>
        </v-col>
        <v-col cols="12" md="8">
          <h4 class="black--text display-1 ml-0 mb-5">
            Version 1.0 có gì?
          </h4>
          <div class="line"></div>
          <h4 class="black--text subheading ml-0 ma-3">
            <p>- Quản lý chi tiết hàng và xe.</p>
            <p>
              - Đánh giá hợp đồng, hồ sơ mời thầu và phản hồi từ Quản trị viên.
            </p>
            <p>- Đấu thầu kín. Tự động gửi Hồ sơ mời thầu phù hợp.</p>
            <p>
              - Tự sinh hợp đồng cho Hàng ghép. Xác thực hợp đồng từ 2 phía.
            </p>
            <p>- Xem chi tiết vị trí và trạng thái của đơn hàng.</p>
            <p>- Quản lý trạng thái đơn vận chuyển bằng mã QR.</p>
          </h4>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class DetailVersion extends Vue {}
</script>
<style scoped lang="css">
section {
  background-color: white !important;
}
.subheading {
  font-size: 22px !important;
  font-weight: 300;
}
.line {
  content: "";
  width: 20%;
  height: 4px;
  background: #eea632;
  display: block;
}
h1 {
  font-size: 45px !important;
  color: red;
  font-family: cursive;
}
</style>
