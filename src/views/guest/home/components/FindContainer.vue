<template>
  <section style="height:900px">
    <v-container>
      <v-row justify="center" align="center" class="mt-15">
        <v-col cols="12" md="2"></v-col>
        <v-col cols="12" md="8">
          <h1 class="black--text display-1 ml-0 mb-5 title">
            Khai báo ngắn gon - hiệu quả nâng cao
          </h1>
          <div class="line"></div>
          <h4 class="black--text subheading ml-0 ma-3">
            Chủ hàng và chủ xe khai báo thông tin trên các hộp thoại khai báo,
            khi mở đấu thầu, hệ thống sẽ tự động lựa chọn các hàng xuất và
            container phù hợp để gửi thông báo.
          </h4>
          <v-btn color="primary" to="/term-of-use" large>
            Tìm hiểu thêm
          </v-btn>
        </v-col>
        <v-col cols="12" md="2"></v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="10">
          <v-img src="@/assets/images/notification.png"></v-img>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class FindContainer extends Vue {}
</script>
<style scoped lang="css">
section {
  background-color: #fff !important;
}
.title {
  font-size: 35px !important;
  font-weight: 300;
}
.subheading {
  font-size: 20px !important;
  font-weight: 300;
}
</style>
