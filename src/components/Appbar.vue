<template>
  <v-app-bar app clipped-left>
    <v-app-bar-nav-icon @click.stop="changeDrawer()"></v-app-bar-nav-icon>
    <v-toolbar-title>CRM</v-toolbar-title>
    <v-btn text to="/">Trang chủ</v-btn>
    <div v-if="$auth.check('ROLE_ADMIN')">
      <v-btn text to="/admin">Quản trị viên</v-btn>
    </div>
    <div v-if="$auth.check(['ROLE_ADMIN', 'ROLE_MODERATOR'])">
      <v-btn text to="/user-management">Danh sách người dùng</v-btn>
    </div>
    <div>
      <v-btn text to="/request-status">Trạng thái đơn đăng ký</v-btn>
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
    <div style="margin-left:400px;">
      <v-badge :content="messages" :value="messages" color="green" overlap>
        <v-btn icon @click="seeNotify"><v-icon>mdi-email</v-icon></v-btn>
      </v-badge>
    </div>
    <div style="margin-top: 50px;" v-if="notify">
      <v-card class="mb-6" style="margin-top: 120px;">
        <v-card-title>abc</v-card-title>
      </v-card>
    </div>

    <div style="margin-left:50px;">
      <v-icon>mdi-dots-vertical</v-icon>
    </div>
  </v-app-bar>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
@Component
export default class Appbar extends Vue {
  @PropSync("drawer", { type: Boolean }) drawerSync!: boolean | null;
  messages = 3;
  notify = false;
  changeDrawer(): boolean {
    return (this.drawerSync = !this.drawerSync);
  }
  create() {
    this.messages = 3;
  }
  public seeNotify() {
    this.messages = 0;
    this.notify = !this.notify;
  }
}
</script>
