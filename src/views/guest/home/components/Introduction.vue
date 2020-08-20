<template>
  <v-card class="card" flat>
    <v-row justify="center">
      <Login v-if="dialogLogin" :dialogLogin.sync="dialogLogin" />
    </v-row>
    <v-parallax height="600" class="introduction">
      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <h1 class="font-weight-thin mb-4">Giải pháp Logistic của thời đại</h1>
          <div class="line"></div>
          <v-row>
            <v-col cols="12" md="9">
              <h4>
                CRuM là trang web đóng vai trò cầu nối giữa những Container rỗng
                trong quá trình di chuyển và những người dùng có nhu cầu vận
                chuyển hàng hóa nhằm mục đích tối ưu quy trình vận chuyển của
                Container. Với sứ mệnh làm mới ngành công nghiệp Logictis, CRuM
                cung cấp một giải pháp tối ưu cho quy trình quản lý và điều phối
                Container, đồng thời tạo điều kiện cho quá trình xuất nhập khẩu
                của doanh nghiệp được nhanh chóng với chi phí thấp hơn.
              </h4>
            </v-col>
          </v-row>
        </v-col>
        <v-btn class="loginBtn" @click="dialogLogin = true"
          >Đăng nhập ngay</v-btn
        >
      </v-row>
    </v-parallax>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Login from "./Login.vue";

@Component({
  components: {
    Login
  }
})
export default class Introduction extends Vue {
  dialogLogin = false;
}
</script>
<style scoped lang="css">
.card {
  margin: 0 !important;
}
.introduction {
  background-color: #cbe4d6;
}
.introduction h1 {
  font-size: 50px !important;
  font-weight: bold !important;
  color: black;
}
.introduction h4 {
  margin-top: 40px !important;
  margin-left: 400px;
  color: black;
  font-weight: normal;
}
.line {
  width: 550px;
  margin-left: 31%;
  border-bottom: 5px solid #eea632;
  position: absolute;
}
.introduction .loginBtn {
  margin-bottom: -20px !important;
}
.introduction .loginBtn:hover {
  margin-bottom: -15px !important;
}
</style>
