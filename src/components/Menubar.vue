<template>
  <v-app-bar app clipped-left>
    <v-toolbar-title>Container Round-use Marketplace</v-toolbar-title>
    <v-divider class="mx-4" vertical></v-divider>
    <v-btn text to="/">Trang chủ</v-btn>
    <v-btn v-if="$auth.check()" text to="/dashboard">Dashboard</v-btn>

    <v-spacer></v-spacer>
    <v-menu left bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
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
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Menubar extends Vue {}
</script>
