<template>
  <section style="height:400px">
    <v-container>
      <v-row justify="center" align="center" class="mt-15">
        <v-col cols="12" md="2"> </v-col>
        <v-col cols="12" md="8">
          <h1 class="black--text display-1 ml-0 mb-5 title">
            Giải pháp Logistic thời đại 4.0
          </h1>
          <div class="line"></div>
          <h4 class="black--text subheading ml-0 ma-3">
            Giải pháp tối ưu vỏ container rỗng, tiết kiệm chi phí quy trình xuất
            nhập khẩu của doanh nghiệp.
          </h4>
          <v-btn color="primary" to="/register" large>
            Đăng ký ngay
          </v-btn>
        </v-col>
        <v-col cols="12" md="2"> </v-col>
      </v-row>
    </v-container>
  </section>
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
section {
  background-color: #cbe4d6 !important;
}
.title {
  font-size: 45px !important;
  font-weight: 600;
}
.subheading {
  font-size: 22px !important;
  font-weight: 300;
}
</style>
