<template>
  <v-navigation-drawer v-model="drawerSync" app clipped>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title">
          Application
        </v-list-item-title>
        <v-list-item-subtitle>
          subtext
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item v-for="item in items" :key="item.title" link :to="item.to">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from "vue-property-decorator";
@Component
export default class Navigation extends Vue {
  @PropSync("drawer", { type: Boolean }) drawerSync!: boolean | null;
  public items: Array<object> = [
    { title: "Dashboard", to: "/admin", icon: "mdi-view-dashboard" },
    { title: "User Management", to: "/user", icon: "mdi-image" },
    { title: " My Profile", to: "/my-profile", icon: "mdi-help-box" }
  ];
}
</script>
