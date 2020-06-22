<template>
  <v-navigation-drawer v-model="drawerSync" app clipped>
    <v-list dense nav>
      <v-list-item two-line :class="'px-0'">
        <v-list-item-avatar>
          <v-img src="@/assets/images/ava.jpg" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title to="/profile">{{
            capitalizeUsername
          }}</v-list-item-title>
          <v-list-item-subtitle style="margin-top:10px;">
            {{ getUserRole }}</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>

    <v-list dense nav>
      <component :is="navigation"> </component>
      <v-list-item to="/profile">
        <v-list-item-icon>
          <v-icon>mdi-help-box</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Trang cá nhân</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="pa-2" v-if="$auth.check()">
        <v-btn block @click="$auth.logout()">Đăng xuất</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from "vue-property-decorator";
import NavigationOperator from "./NavigationOperator.vue";
import NavigationSupplier from "./NavigationSupplier.vue";
import { toCapitalize } from "@/utils/tool";

@Component({
  name: "Navigation",
  components: {
    NavigationOperator,
    NavigationSupplier
  }
})
export default class Navigation extends Vue {
  @PropSync("drawer", { type: Boolean }) drawerSync!: boolean;

  protected navigation = NavigationSupplier;

  get capitalizeUsername() {
    return toCapitalize(this.$auth.user().username);
  }

  get getUserRole() {
    return this.$auth
      .user()
      .roles[0].toLowerCase()
      .substring(5);
  }

  created() {
    if (this.$auth.check(["ROLE_ADMIN", "ROLE_MODERATOR"])) {
      this.navigation = NavigationOperator;
    }
  }
}
</script>
<style></style>
