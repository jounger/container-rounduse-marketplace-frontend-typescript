<template>
  <v-app-bar app clipped-left>
    <v-toolbar-title>Container Round-use Marketplace</v-toolbar-title>
    <v-divider class="mx-4" vertical></v-divider>
    <v-btn text to="/">Trang chủ</v-btn>
    <v-btn v-if="$auth.user()" text to="/dashboard">Dashboard</v-btn>

    <v-spacer></v-spacer>
    <v-menu left bottom :offset-y="true">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item v-if="!$auth.user()" to="/login">
          <v-list-item-icon>
            <v-icon small>trending_flat</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Đăng nhập</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="!$auth.user()" to="/register">
          <v-list-item-icon>
            <v-icon small>assignment_ind</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Đăng ký</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-else @click="$auth.logout()">
          <v-list-item-icon>
            <v-icon small>keyboard_return</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Đăng xuất</v-list-item-title>
          </v-list-item-content>
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
