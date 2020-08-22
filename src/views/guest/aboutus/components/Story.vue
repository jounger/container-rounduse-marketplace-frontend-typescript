<template>
  <section class="story">
    <v-row justify="center">
      <h1>CÂU CHUYỆN CỦA CHÚNG TÔI</h1>
      <div class="line">&nbsp;</div>
    </v-row>
    <v-row class="first-idea">
      <v-col cols="12" md="2"> </v-col
      ><v-col cols="12" md="4">
        <p></p>
        <span>05/2020</span>
        <h2>Ý tưởng đầu tiên</h2>
        <h4>
          Đầu tháng 05 năm 2020, anh Nguyễn Văn An nảy ra một ý tưởng về một hệ
          thống kết nối Container với các Chủ hàng với mục tiêu là tận dụng vỏ
          container rỗng trong quá trình di chuyển. Anh cùng nhóm đồ án đã đặt
          viên gạch đầu tiên xây dựng CRuM vào ngày 18/05/2020.
        </h4>
        <v-card height="200" width="160">
          <v-img src="@/assets/images/story01.jpg"></v-img>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="study">
      <v-col cols="12" md="2"> </v-col><v-col cols="12" md="4"> </v-col>
      <v-col cols="12" md="4">
        <span>06/2020</span>
        <p></p>
        <h2>Nghiên cứu tài liệu</h2>
        <h4>
          Ngay lập tức, An cùng cả nhóm đồ án triển khai và phân tích ý tưởng,
          từ đó tìm ra các công việc cần làm. Cả nhóm cùng nhau miệt mài tìm
          hiểu trong suốt một tháng. 06/2020, cả nhóm bắt đầu chính thức viết
          những dòng code đầu tiên của hệ thống.
        </h4>
        <v-card height="200" width="263">
          <v-img src="@/assets/images/story02.jpg"></v-img
        ></v-card>
      </v-col>
    </v-row>
    <v-row class="complete">
      <v-col cols="12" md="2"> </v-col
      ><v-col cols="12" md="4">
        <p></p>
        <span>08/2020</span>
        <h2>Hoàn thiện dự án</h2>
        <h4>
          Sau suốt 3 tháng cố gắng, cả nhóm từng bước hoàn thành hệ thống. Cuối
          cùng vào cuối tháng 08/2020, hệ thống được hoàn thiện và được deploy
          lên server vào ngày 29/08/2020 cùng niềm vui và sự tự hào của tất cả
          thành viên.
        </h4>
        <v-card height="200" width="280">
          <v-img src="@/assets/images/story03.jpg"></v-img>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="final">
      <v-col cols="12" md="2"> </v-col><v-col cols="12" md="4"> </v-col>
      <v-col cols="12" md="4">
        <span>09/2020</span>
        <p></p>
        <h2>Bảo vệ đồ án</h2>
        <h4>
          Sau suốt thời gian ròng rã cố gắng cùng sản phẩm, An cùng cả nhóm đã
          đứng trước hội đồng và bảo vệ thành công đồ án của mình. Cả nhóm vượt
          qua kỳ đồ án, ra trường với niềm vui và sự tự tin cùng sản phẩm của
          mình, hướng đến một tương lai tươi đẹp.
        </h4>
        <v-card height="200" width="263">
          <v-img src="@/assets/images/story04.jpg"></v-img
        ></v-card>
      </v-col>
    </v-row>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Story extends Vue {}
</script>
<style scoped lang="css">
.story {
  background-color: white;
  height: 1650px !important;
}
.story h1 {
  font-weight: 400 !important;
  color: #037243;
  margin-top: 30px;
}
.first-idea h2 {
  font-weight: 400 !important;
  color: #037243;
  font-size: 20px;
  margin-top: 35px;
  float: right;
  margin-right: -50px;
}
.first-idea h4 {
  font-size: 14px;
  margin-top: 75px;
  font-weight: normal;
  text-align: right;
}
.first-idea .v-card {
  float: right;
  margin-top: 10px;
  border-style: solid;
  border-width: 5px;
}
.line {
  width: 1px;
  background-color: #000;
  position: absolute;
  height: 1160px;
  margin-top: 80px;
}
.first-idea p {
  margin-top: 10px;
  margin-right: -17px;
  width: 10px;
  height: 10px;
  background-color: #4d96ff;
  border-radius: 50%;
  float: right;
}
.first-idea span {
  float: right;
  margin-top: 10px;
  font-size: 13px;
}
.study p {
  margin-left: -17px;
  margin-top: -20px;
  width: 10px;
  height: 10px;
  background-color: #4d96ff;
  border-radius: 50%;
}
.study h2 {
  font-weight: 400 !important;
  color: #037243;
  font-size: 20px;
}
.study h4 {
  font-size: 14px;
  margin-top: 10px;
  font-weight: normal;
}
.study span {
  margin-top: -30px !important;
  font-size: 13px;
}
.study .v-card {
  margin-top: 10px;
  border-style: solid;
  border-width: 5px;
}
.complete h2 {
  font-weight: 400 !important;
  color: #037243;
  font-size: 20px;
  margin-top: 35px;
  float: right;
  margin-right: -50px;
}
.complete h4 {
  font-size: 14px;
  margin-top: 75px;
  font-weight: normal;
  text-align: right;
}
.complete .v-card {
  float: right;
  margin-top: 10px;
  border-style: solid;
  border-width: 5px;
}
.complete p {
  margin-top: 10px;
  margin-right: -17px;
  width: 10px;
  height: 10px;
  background-color: #4d96ff;
  border-radius: 50%;
  float: right;
}
.complete span {
  float: right;
  margin-top: 10px;
  font-size: 13px;
}
.final p {
  margin-left: -17px;
  margin-top: -20px;
  width: 10px;
  height: 10px;
  background-color: #4d96ff;
  border-radius: 50%;
}
.final h2 {
  font-weight: 400 !important;
  color: #037243;
  font-size: 20px;
}
.final h4 {
  font-size: 14px;
  margin-top: 10px;
  font-weight: normal;
}
.final span {
  margin-top: -30px !important;
  font-size: 13px;
}
.final .v-card {
  margin-top: 10px;
  border-style: solid;
  border-width: 5px;
}
</style>
