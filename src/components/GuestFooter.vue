<template>
  <v-footer padless>
    <v-card
      flat
      tile
      color="black"
      class="footer lighten-1 white--text text-center"
      width="100%"
    >
      <v-card-text>
        <v-btn
          v-for="icon in icons"
          :key="icon.icon"
          :href="icon.to"
          target="_blank"
          class="mx-4 white--text"
          icon
        >
          <v-icon size="24px">{{ icon.icon }}</v-icon>
        </v-btn>
      </v-card-text>

      <v-card-text class="white--text pt-0"> </v-card-text>
      Sứ mệnh mang lại giá trị từ những gì sẵn có
      <v-divider></v-divider>

      <v-card-text class="white--text">
        Cung cấp bởi
        <router-link to="/" @click.native="scrollToTop"
          ><strong>CRuM</strong></router-link
        >
        ©{{ new Date().getFullYear() }}.Đã đăng ký bản quyền rev 21/08/2020
        9:38:35 AM
      </v-card-text>
      <v-row justify="center" class="function-link">
        <div v-for="(item, index) in links" :key="index">
          <span v-if="index != 0">| </span>
          <router-link :to="item.to" @click.native="scrollToTop" class="mr-1">{{
            item.title
          }}</router-link>
        </div>
      </v-row>
    </v-card>
  </v-footer>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Footer extends Vue {
  icons = [
    { icon: "mdi-facebook", to: "https://facebook.com" },
    { icon: "mdi-twitter", to: "https://twitter.com/" },
    { icon: "mdi-linkedin", to: "https://www.linkedin.com/" },
    { icon: "mdi-instagram", to: "https://www.instagram.com/" }
  ];
  links = [
    { title: "Điều khoản sử dụng", to: "/term-of-use" },
    { title: "Liên hệ", to: "/contact-us" },
    { title: "Về chúng tôi", to: "/about-us" }
  ];
  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
</script>
<style scoped lang="css">
.footer a {
  font-size: 15px;
  text-decoration: none;
  color: white;
}
.footer a:hover {
  font-size: 16px;
  color: #037243;
  font-weight: bold;
}
.function-link {
  margin-bottom: 20px !important;
}
</style>
