<template>
  <v-app-bar app>
    <v-app-bar-nav-icon @click.stop="changeDrawer()"></v-app-bar-nav-icon>
    <router-link to="/" class="home"
      ><v-toolbar-title
        >Container Round-use Marketplace</v-toolbar-title
      ></router-link
    >
    <v-spacer></v-spacer>
    <Notification />
    <v-menu bottom offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on" color="rgba(0,0,0,0)">
          <v-list-item dense>
            <v-list-item-avatar color="indigo">
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
    {
      title: "Trang cá nhân",
      icon: "assignment_ind",
      link: "/profile",
      auth: true
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
