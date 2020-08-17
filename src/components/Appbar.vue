<template>
  <v-app-bar app clipped-left>
    <!-- <v-app-bar-nav-icon @click.stop="changeDrawer()"></v-app-bar-nav-icon> -->
    <router-link to="/" class="home"
      ><v-toolbar-title
        >Container Round-use Marketplace</v-toolbar-title
      ></router-link
    >
    <v-spacer></v-spacer>
    <Notification />
    <v-menu left bottom :offset-y="true">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
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
import { Component, Vue, PropSync } from "vue-property-decorator";
import Notification from "./Notification.vue";
@Component({
  components: {
    Notification
  }
})
export default class Appbar extends Vue {
  @PropSync("drawer", { type: Boolean, default: true }) drawerSync!: boolean;

  menu = [
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

  changeDrawer() {
    return (this.drawerSync = !this.drawerSync);
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
