<template>
  <v-card class="card" flat>
    <v-parallax height="600" class="feedback">
      <v-row>
        <v-col cols="12" md="6">
          <h1 class="font-weight-thin mb-4">
            Phản hồi người dùng về CRuM
          </h1>
          <div class="line"></div>
          <h3>
            300+ chủ xe, chủ hàng, hãng tàu sử dụng CRuM hàng ngày.
          </h3>
        </v-col>
      </v-row>
      <v-row class="feedback-row">
        <div v-for="item in feedbacks" :key="item.title">
          <v-card width="250" class="feedback-card" flat>
            <div class="card-title">
              <v-card-text>"{{ item.title }}"</v-card-text>
            </div>
            <v-divider></v-divider>
            <div>
              <img width="210" :src="getPic(item.img)" alt="pic" /></div
          ></v-card>
        </div>
      </v-row>
    </v-parallax>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Feedback extends Vue {
  feedbacks = [
    {
      title:
        "CRuM là giải pháp tuyệt vời cho tôi trong quá trình xử lý Container rỗng. Nó giúp tôi tối ưu quá trình vận chuyển và mang lại giá trị ngay cả trong quá trình di chuyển về cảng.",
      img: "feedback01"
    },
    {
      title:
        "CRuM giúp tôi tìm được những Container phù hợp cùng với một mức giá hợp lý.",
      img: "feedback02"
    },
    {
      title:
        "Chỉ sau 3 tháng, CRuM đã chúng tôi thu được hơn 100.000.000 VNĐ. Đó thực sự là một con số rất ấn tượng.",
      img: "feedback03"
    },
    {
      title:
        "Sử dụng CRuM giúp tôi dễ dàng quản lý và điều phối Container của mình hơn. Thật tuyệt khi có thể thu lại lợi nhuận hay cả khi Container rỗng.",
      img: "feedback04"
    }
  ];
  getPic(item: string) {
    return require("@/assets/images/" + item + ".jpg");
  }
}
</script>
<style scoped lang="css">
.card {
  margin: 0 !important;
}
.feedback {
  background-color: rgba(221, 221, 221, 0.2);
}
.feedback h1 {
  margin-top: 30px;
  margin-left: 150px;
  font-size: 35px !important;
  font-weight: 500 !important;
  color: black;
}
.feedback h3 {
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
.feedback img {
  margin-top: 20px !important;
  margin-left: 20px !important;
}
.feedback-card {
  margin-left: 50px;
  height: 300px;
}
.card-title {
  font-style: italic;
  height: 160px;
}
.feedback-row {
  margin-left: 100px !important;
}
</style>
