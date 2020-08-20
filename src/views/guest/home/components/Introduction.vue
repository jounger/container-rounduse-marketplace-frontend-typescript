<template>
  <v-card class="card">
    <v-row justify="center">
      <Login v-if="dialogLogin" :dialogLogin.sync="dialogLogin" />
    </v-row>
    <v-parallax height="600" class="introduction">
      <v-row align="center" justify="center">
        <v-col class="text-center" cols="12">
          <h1 class="font-weight-thin mb-4">Giải pháp Logistic của thời đại</h1>
          <div class="line"></div>
          <h4>Mang lại giá trị từ chính những gì bạn có</h4>
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
</style>
