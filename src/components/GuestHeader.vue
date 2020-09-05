<template>
  <v-app-bar app color="white" class="elevation-1">
    <router-link to="/" class="home" @click.native="scrollToTop"
      ><v-toolbar-title
        ><v-img
          class="title"
          src="@/assets/images/logo.jpg"
          width="63"
        ></v-img></v-toolbar-title
    ></router-link>
    <Login v-if="dialogLogin" :dialogLogin.sync="dialogLogin" />
    <v-spacer></v-spacer>
    <v-btn
      class="head-link mr-2"
      v-for="link in links"
      :key="link.title"
      :to="link.link"
      @click.native="scrollToTop"
      text
      rounded
      >{{ link.title }}
    </v-btn>
    <v-menu bottom offset-y>
      <template v-slot:activator="{ on, attrs }" v-if="$auth.user()">
        <v-btn text v-bind="attrs" v-on="on" color="rgba(0,0,0,0)">
          <v-list-item dense>
            <v-list-item-avatar color="tertiary">
              <v-img
                v-if="$auth.user().profileImagePath"
                :src="userProfileImage"
              ></v-img>
              <span v-else class="white--text headline">{{
                $auth.user().username
                  ? $auth
                      .user()
                      .username.substring(0, 1)
                      .toUpperCase()
                  : ""
              }}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ $auth.user().fullname }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-btn>
      </template>
      <template v-slot:activator="{ on, attrs }" v-else>
        <v-btn
          color="primary"
          icon
          outlined
          v-if="$auth.user()"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item
          v-for="item in getMenu"
          :key="item.title"
          :to="item.link"
          link
        >
          <v-list-item-icon>
            <v-icon small>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn
      v-if="!$auth.user()"
      depressed
      class="loginBtn ml-5"
      @click="dialogLogin = true"
      >Đăng nhập</v-btn
    >
    <v-btn
      v-if="!$auth.user()"
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
import Login from "../views/guest/home/components/Login.vue";
@Component({
  components: {
    Login
  }
})
export default class Menubar extends Vue {
  dialogLogin = false;
  links = [
    { title: "Trang chủ", link: "/" },
    { title: "Về chúng tôi", link: "/about-us" },
    { title: "Điều khoản", link: "/term-of-use" },
    { title: "Liên hệ", link: "/contact-us" }
  ];
  menu = [
    { title: "Dashboard", icon: "dashboard", link: "/dashboard", auth: true },
    { title: "Đăng nhập", icon: "lock_open", link: "/login", auth: false },
    {
      title: "Đăng ký",
      icon: "assignment_ind",
      link: "/register",
      auth: false
    },
    {
      title: "Đổi mật khẩu",
      icon: "vpn_key",
      link: "/change-password",
      auth: true
    },
    { title: "Đăng xuất", icon: "launch", link: "/logout", auth: true }
  ];

  scrollToTop() {
    window.scrollTo(0, 0);
  }

  get getMenu() {
    return this.menu.filter(x => x.auth == (this.$auth.user() != null));
  }

  get userProfileImage() {
    return process.env.VUE_APP_ENDPOINT + this.$auth.user().profileImagePath;
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
.head-link:hover {
  background-color: #00532f;
  color: white;
}
</style>
