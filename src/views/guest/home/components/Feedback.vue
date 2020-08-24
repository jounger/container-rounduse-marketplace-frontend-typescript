<template>
  <section>
    <v-container>
      <v-row justify="center" align="center" class="mt-15">
        <v-col cols="12" md="12">
          <h1 class="black--text display-1 ml-0 mb-5 title">
            Giá trị khi khách hàng sử dụng CRuM
          </h1>
          <div class="line"></div>
          <h4 class="black--text subheading ml-0 ma-3">
            300+ chủ xe, chủ hàng, hãng tàu sử dụng CRuM hàng ngày.
          </h4>
        </v-col>
      </v-row>
      <v-row class="feedback-row">
        <v-col cols="12" md="3" v-for="item in feedbacks" :key="item.title">
          <v-card width="250" class="feedback-card" flat>
            <div class="card-title">
              <v-card-text>"{{ item.title }}"</v-card-text>
            </div>
            <v-divider></v-divider>
            <div>
              <img width="210" :src="getPic(item.img)" alt="pic" /></div
          ></v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
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
.feedback-card img {
  margin-top: 20px !important;
  margin-left: 20px !important;
}
.feedback-card {
  height: 270px;
}
.card-title {
  font-style: italic;
  height: 160px;
}
/* NEW */
section {
  background-color: rgba(221, 221, 221, 0.2) !important;
  height: 600px;
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
