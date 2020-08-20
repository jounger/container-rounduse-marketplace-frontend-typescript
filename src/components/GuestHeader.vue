<template>
  <v-app-bar app color="white" flat>
    <router-link to="/homepage" class="home"
      ><v-toolbar-title
        ><span class="title"
          >Container Round-use Marketplace</span
        ></v-toolbar-title
      ></router-link
    >
    <v-spacer></v-spacer>
    <v-btn
      v-for="link in links"
      :key="link.title"
      :to="link.link"
      color="black"
      text
      rounded
      class="my-2"
    >
      <span class="btn">{{ link.title }}</span>
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn class="loginBtn" to="/login" @click.native="scrollToTop"
      >Đăng nhập</v-btn
    >
    <v-btn class="logoutBtn" to="/register" @click.native="scrollToTop"
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
    { title: "Về chúng tôi", scroll: "mission" },
    { title: "Điều khoản", scroll: "/rule" },
    { title: "Hỗ trợ", scroll: "/help" },
    { title: "Liên lạc", scroll: "/contact" }
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
span.btn {
  font-size: 13px !important;
}
span.btn:hover {
  font-size: 15px !important;
  font-weight: bold;
}
.loginBtn {
  background: #eea632 !important;
  color: white !important;
  margin-right: 20px;
}
.loginBtn:hover {
  margin-top: -5px !important;
}
.logoutBtn {
  background: #00532f !important;
  color: white !important;
  margin-right: 50px;
}
.logoutBtn:hover {
  margin-top: -5px !important;
}
.title {
  color: green;
  margin-left: 50px;
}
</style>
