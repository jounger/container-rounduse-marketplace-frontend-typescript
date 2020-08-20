<template>
  <v-card class="card" flat>
    <v-parallax height="850" class="automate">
      <v-row>
        <v-col cols="12" md="6">
          <h1 class="font-weight-thin mb-4">
            Tự động hóa quá trình xử lý
          </h1>
          <div class="line"></div>
          <h3>
            CRuM giúp bạn tiết kiệm thời gian. Trong khi quá trình xử lý thủ
            công có thể gây ra lỗi khi nhầm lẫn, quá trình tự động hóa sẽ thay
            bạn giải quyết hầu hết các tác vụ hệ thống. Quá trình tự động hóa
            này được áp dụng trong hầu hết quá trình thay đổi trạng thái, tính
            toán, cũng như lọc Hồ sơ mời thầu trước khi gửi đến chủ xe và chỉ
            gửi thông báo cho những hành động cần xác nhận từ người dùng.
          </h3>
          <v-btn>Tìm hiểu thêm</v-btn>
        </v-col>
        <v-col cols="12" md="6">
          <v-img src="@/assets/images/auto.jpg"></v-img>
          <v-img src="@/assets/images/auto2.jpg"></v-img>
        </v-col>
      </v-row>
    </v-parallax>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Automate extends Vue {}
</script>
<style scoped lang="css">
.card {
  margin: 0 !important;
}
.automate {
  background-color: white;
}
.automate h1 {
  margin-top: 180px;
  margin-left: 150px;
  font-size: 35px !important;
  font-weight: 500 !important;
  color: black;
}
.automate h3 {
  margin-top: 40px !important;
  margin-left: 150px;
  font-size: 22px !important;
  color: black;
  font-weight: 300 !important;
}
.line {
  width: 250px;
  margin-left: 10%;
  border-bottom: 3px solid #eea632;
  position: absolute;
}
.automate button {
  margin-left: 150px !important;
  margin-top: 30px !important;
  background-color: #00532f !important;
  color: white;
}
.automate button:hover {
  margin-top: 25px !important;
}
.automate .v-image {
  margin-top: 30px !important;
  margin-left: 30px !important;
  height: 330px;
}
</style>
