<template>
  <v-app-bar app color="#fff" light class="elevation-1">
    <v-app-bar-nav-icon @click.stop="changeDrawer()"></v-app-bar-nav-icon>
    <v-btn text to="/"
      ><v-toolbar-title>Container Round-use Marketplace</v-toolbar-title></v-btn
    >
    <v-spacer></v-spacer>
    <Notification />
    <v-menu bottom offset-y>
      <template v-slot:activator="{ on, attrs }">
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
      <v-list dense>
        <v-list-item
          v-for="item in getMenu"
          :key="item.title"
          :to="item.link"
          link
          color="primary"
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

  get userProfileImage() {
    return process.env.VUE_APP_ENDPOINT + this.$auth.user().profileImagePath;
  }

  changeDrawer() {
    return (this.drawerSync = !this.drawerSync);
  }
}
</script>
