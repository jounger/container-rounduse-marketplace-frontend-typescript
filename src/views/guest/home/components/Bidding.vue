<template>
  <section>
    <v-container>
      <v-row justify="center" align="center" class="mt-15">
        <v-col cols="12" md="4">
          <h1 class="black--text display-1 ml-0 mb-5 title">
            Đấu thầu kín - cạnh tranh công bằng
          </h1>
          <div class="line"></div>
          <h4 class="black--text subheading ml-0 ma-3">
            Quá trình ghép cặp Container và hàng được diễn ra dưới hình thức đấu
            thầu kín, đảm bảo công bằng cho các bên tham gia.
          </h4>
          <v-btn
            color="primary"
            to="/term-of-use"
            large
            @click.native="scrollTo(0, 0)"
          >
            Tìm hiểu thêm
          </v-btn>
        </v-col>
        <v-col cols="12" md="8">
          <v-img src="@/assets/images/bidding.png"></v-img>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Bidding extends Vue {
  scrollTo(x: number, y: number) {
    window.scrollTo(x, y);
  }
}
</script>
<style scoped lang="css">
section {
  background-color: #ffe6ba !important;
  height: 550px;
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
