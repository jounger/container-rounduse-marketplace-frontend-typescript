<template>
  <v-app-bar app clipped-left>
    <v-app-bar-nav-icon @click.stop="changeDrawer()"></v-app-bar-nav-icon>
    <v-toolbar-title>CRM</v-toolbar-title>
    <v-btn text to="/">Home</v-btn>
    <div v-if="$auth.check('ROLE_ADMIN')">
      <v-btn text to="/admin">Admin</v-btn>
    </div>
    <div v-if="$auth.check(['ROLE_ADMIN', 'ROLE_USER'])">
      <v-btn text to="/user">User</v-btn>
    </div>
    <div v-if="!$auth.check()">
      <v-btn text to="/login">Login</v-btn>
    </div>
    <div v-if="$auth.check()">
      <v-btn text to="/logout">Logout</v-btn>
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
