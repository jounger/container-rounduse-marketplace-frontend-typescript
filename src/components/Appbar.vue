<template>
  <v-app-bar app clipped-left>
    <v-app-bar-nav-icon @click.stop="changeDrawer()"></v-app-bar-nav-icon>
    <v-toolbar-title>Container Round-use Marketplace</v-toolbar-title>
    <v-divider class="mx-4" vertical></v-divider>
    <v-btn text to="/">Trang chủ</v-btn>
    <v-btn v-if="$auth.check()" text to="/dashboard">Dashboard</v-btn>

    <v-spacer></v-spacer>
    <Notification />
    <v-menu left bottom :offset-x="true">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item v-if="!$auth.check()" to="/login">
          <v-list-item-title>Đăng nhập</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="!$auth.check()" to="/register">
          <v-list-item-title>Đăng ký</v-list-item-title>
        </v-list-item>
        <v-list-item v-else @click="$auth.logout()">
          <v-list-item-title>Đăng xuất</v-list-item-title>
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
  changeDrawer() {
    return (this.drawerSync = !this.drawerSync);
  }
}
</script>
