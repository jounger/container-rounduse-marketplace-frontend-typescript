<template>
  <v-app-bar app color="white">
    <router-link to="/" class="home"
      ><v-toolbar-title
        ><span class="title">CRuM</span></v-toolbar-title
      ></router-link
    >
    <v-spacer></v-spacer>
    <v-btn v-for="link in links" :key="link.title" :to="link.link" text rounded
      >{{ link.title }}
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn depressed class="loginBtn" to="/login" @click.native="scrollToTop"
      >Đăng nhập</v-btn
    >
    <v-btn
      depressed
      class="logoutBtn"
      to="/register"
      @click.native="scrollToTop"
      >Đăng ký</v-btn
    >
  </v-app-bar>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Menubar extends Vue {
  menu = [
    { title: "Đăng nhập", icon: "lock_open", link: "/login" },
    {
      title: "Đăng ký",
      icon: "assignment_ind",
      link: "/register"
    }
  ];
  links = [
    { title: "Trang chủ", link: "/homepage" },
    { title: "Về chúng tôi", link: "/aboutus" },
    { title: "Điều khoản", link: "/termofuse" },
    { title: "Hỗ trợ", link: "/help" },
    { title: "Liên lạc", link: "/contact" }
  ];
  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
</script>
<style lang="css" scopedSlots>
.home {
  text-decoration: none;
}
.home div {
  color: #000 !important;
}
.loginBtn {
  background: #eea632 !important;
  color: white !important;
  margin-right: 20px;
  transition: 0.2s;
}
.loginBtn:hover {
  margin-top: -5px !important;
}
.logoutBtn {
  background: #00532f !important;
  color: white !important;
  margin-right: 50px;
  transition: 0.2s;
}
.logoutBtn:hover {
  margin-top: -5px !important;
}
.title {
  color: green;
  margin-left: 50px;
}
</style>
