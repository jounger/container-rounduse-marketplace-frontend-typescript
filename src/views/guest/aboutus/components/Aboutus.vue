<template>
  <section height="1260">
    <v-parallax height="400" src="@/assets/images/aboutus.jpg"> </v-parallax
    ><v-row class="about-us">
      <v-col cols="12" md="6">
        <v-card height="300" width="400"
          ><v-img src="@/assets/images/about-us-avatar.jpg"></v-img></v-card
      ></v-col>
      <v-col cols="12" md="4">
        <h1>CHÚNG TÔI LÀ AI?</h1>
        <h4>
          CRuM là một hệ thống và nền tảng tương tác trực tuyến cho phép người
          dùng trao đổi, quản lý và điều phối Container cũng như hàng xuất. Tận
          dụng các Container rỗng trong quá trình di chuyển để tối ưu quá trình
          vận chuyển và mang lại lợi ích cho người dùng.
        </h4></v-col
      >
    </v-row>
    <v-row class="vision">
      <v-col cols="12" md="6">
        <h1>TẦM NHÌN</h1>
        <h4>
          CRuM sẽ luôn hướng đến mục đích tối ưu quy trình vận chuyển nhằm mang
          lại lợi ích tối đa cho người dùng. Chúng tôi hứa sẽ mang đến một kênh
          để giúp đỡ nền xuất nhập khẩu Container không chỉ ở Việt Nam mà còn
          rộng ra là ở Đông Nam Á và toàn châu Á.
        </h4>
      </v-col>
      <v-col>
        <v-img
          src="@/assets/images/vision.jpg"
          height="300"
          width="500"
        ></v-img>
      </v-col>
    </v-row>
    <v-row class="mission">
      <v-col cols="12" md="6">
        <v-img
          src="@/assets/images/mission.jpg"
          height="300"
          width="400"
        ></v-img>
      </v-col>
      <v-col cols="12" md="4">
        <h1>SỨ MỆNH</h1>
        <h4>
          Chúng tôi tập trung phát triển một hệ sinh thái toàn diện với việc tập
          trung vào quá trình ghép nối giữa Container và Hàng xuất. Với chức
          năng đấu thấu công khai, CRuM giúp người dùng Chủ hàng tìm kiếm được
          những Container phù hợp nhất.
        </h4>
        <h4>
          Chúng tôi hướng đến kết nối tất cả những người trong ngành Logistics
          để cùng nhau xây dựng một cộng đồng Logistic lớn mạnh.
        </h4></v-col
      >
    </v-row>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Aboutus extends Vue {}
</script>
<style scoped land="css">
.section {
  background-color: white !important;
}
.about-us .v-card {
  margin-left: 250px !important;
  margin-top: -70px;
  border-style: solid;
  border-width: 5px;
}
.about-us h1 {
  font-weight: 400 !important;
  color: #037243;
  margin-left: -90px;
}
.about-us h4 {
  font-weight: normal;
  margin-left: -90px;
  margin-top: 10px;
}
.vision h1 {
  font-weight: 400 !important;
  color: #037243;
  margin-left: 250px;
}
.vision h4 {
  font-weight: normal;
  margin-left: 250px;
  margin-top: 10px;
}
.mission .v-image {
  margin-left: 250px;
}
.mission h1 {
  font-weight: 400 !important;
  color: #037243;
}
.mission h4 {
  font-weight: normal;
  margin-top: 10px;
}
</style>
