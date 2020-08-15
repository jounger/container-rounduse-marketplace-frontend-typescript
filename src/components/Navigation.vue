<template>
  <v-navigation-drawer v-model="drawerSync" app clipped v-if="$auth.user()">
    <v-list dense nav>
      <v-list-item two-line link to="/profile">
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
          <v-list-item-subtitle>
            <v-icon small color="success">security</v-icon>
            {{ getUserRole }}</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <component :is="navigation"> </component>
    <v-list dense>
      <v-list-item
        v-for="item in getNavigation"
        :key="item.title"
        :to="item.link"
        link
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="pa-2" v-if="$auth.user()">
        <v-btn block @click="$auth.logout()">Đăng xuất</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from "vue-property-decorator";
import NavigationOperator from "./NavigationOperator.vue";
import NavigationSupplier from "./NavigationSupplier.vue";

@Component({
  components: {
    NavigationOperator,
    NavigationSupplier
  }
})
export default class Navigation extends Vue {
  @PropSync("drawer", { type: Boolean, default: true }) drawerSync!: boolean;

  protected navigation: object = NavigationSupplier;
  protected generalNavigation = [
    { title: "Trang cá nhân", icon: "account_circle", link: "/profile" }
  ];

  get getUserRole() {
    const roles = this.$auth.user().roles;
    if (this.$auth.user() && roles && roles.length > 0) {
      return this.$auth
        .user()
        .roles[0].toLowerCase()
        .substring(5);
    }
    return "";
  }

  get getNavigation() {
    if (this.$auth.user()) {
      return this.generalNavigation;
    } else {
      return this.$router.push("/");
    }
  }

  async created() {
    if (this.$auth.check(["ROLE_ADMIN", "ROLE_MODERATOR"])) {
      this.navigation = NavigationOperator;
    }
  }
}
</script>
<style></style>
