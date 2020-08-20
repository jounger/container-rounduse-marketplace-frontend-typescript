<template>
  <v-card class="card" flat>
    <v-parallax height="950" class="find-cont-easy">
      <v-row>
        <v-col cols="12" md="8">
          <h1 class="font-weight-thin mb-4">
            Dễ dàng tìm kiếm Container phù hợp
          </h1>
          <div class="line"></div>
          <h3>
            Quá trình tìm kiếm Container phù hợp được tự động tìm kiếm trên hệ
            thống và gửi thông báo đến cho những chủ xe sở hữu Container để đảm
            bảo ghép cặp được Container nhanh chóng và phù hợp nhất.
          </h3>
          <v-btn>Tìm hiểu thêm</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-img src="@/assets/images/findcont.jpg"></v-img>
        </v-col>
        <v-col cols="12" md="6">
          <v-img src="@/assets/images/findcont2.jpg"></v-img>
        </v-col>
      </v-row>
    </v-parallax>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class FindContainer extends Vue {}
</script>
<style scoped lang="css">
.card {
  margin: 0 !important;
}
.find-cont-easy {
  background-color: #ffe6ba;
}
.find-cont-easy h1 {
  margin-top: 60px;
  margin-left: 365px;
  font-size: 35px !important;
  font-weight: 500 !important;
  color: black;
}
.find-cont-easy h3 {
  margin-top: 40px !important;
  margin-left: 365px;
  font-size: 22px !important;
  color: black;
  font-weight: 300 !important;
}
.line {
  width: 400px;
  margin-left: 24%;
  border-bottom: 3.5px solid #eea632;
  position: absolute;
}
.find-cont-easy button {
  margin-left: 365px !important;
  margin-top: 30px !important;
  background-color: #00532f !important;
  color: white;
}
.find-cont-easy button:hover {
  margin-top: 25px !important;
}
.find-cont-easy .v-image {
  margin-top: -20px !important;
  height: 370px;
  width: 750px;
}
</style>
