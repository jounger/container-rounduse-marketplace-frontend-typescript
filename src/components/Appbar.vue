<template>
  <v-app-bar app clipped-left>
    <v-app-bar-nav-icon @click.stop="changeDrawer()"></v-app-bar-nav-icon>
    <v-toolbar-title>CRM</v-toolbar-title>
    <v-btn text to="/">Trang chủ</v-btn>
    <div v-if="$auth.check('ROLE_ADMIN')">
      <v-btn text to="/admin">Quản trị viên</v-btn>
    </div>
    <div v-if="$auth.check(['ROLE_ADMIN', 'ROLE_USER'])">
      <v-btn text to="/list-user">Danh sách người dùng</v-btn>
    </div>
    <div v-if="!$auth.check()">
      <v-btn text to="/login">Đăng nhập</v-btn>
    </div>
    <div v-if="!$auth.check()">
      <v-btn text to="/register">Đăng ký</v-btn>
    </div>
    <div v-if="$auth.check()">
      <v-btn text to="/logout">Đăng xuất</v-btn>
    </div>
    <div style="margin-left:800px;">
      <v-icon>mdi-dots-vertical</v-icon>
    </div>
  </v-app-bar>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
@Component
export default class Appbar extends Vue {
  @PropSync("drawer", { type: Boolean }) drawerSync!: boolean | null;
  changeDrawer(): boolean {
    return (this.drawerSync = !this.drawerSync);
  }
}
</script>
