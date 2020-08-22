<template>
  <v-app-bar app clipped-left class="elevation-1">
    <router-link to="/" class="home"
      ><v-toolbar-title
        >Container Round-use Marketplace</v-toolbar-title
      ></router-link
    >
    <v-spacer></v-spacer>
    <v-menu bottom offset-y>
      <template v-slot:activator="{ on, attrs }" v-if="$auth.user()">
        <v-btn text v-bind="attrs" v-on="on" color="rgba(0,0,0,0)">
          <v-list-item dense>
            <v-list-item-avatar color="tertiary">
              <v-img
                v-if="$auth.user().profileImagePath"
                :src="$auth.user().profileImagePath"
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
        <v-btn color="primary" icon outlined v-bind="attrs" v-on="on">
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
  </v-app-bar>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Menubar extends Vue {
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

  get getMenu() {
    return this.menu.filter(x => x.auth == (this.$auth.user() != null));
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
</style>
