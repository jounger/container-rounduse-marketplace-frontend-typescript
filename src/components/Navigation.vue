<template>
  <v-navigation-drawer v-model="drawerSync" app clipped>
    <v-list dense nav>
      <v-list-item two-line :class="'px-0'">
        <v-list-item-avatar size="90">
          <v-img src="@/assets/images/ava.jpg" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="title" style="margin-left: 5px;"
            ><router-link to="/profile">{{
              username
            }}</router-link></v-list-item-title
          >
          <v-list-item-subtitle style="margin-top:10px;"
            ><v-list-item v-for="(item, i) in roles" :key="i">
              <v-list-item-title
                v-text="item"
              ></v-list-item-title> </v-list-item
          ></v-list-item-subtitle>
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
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from "vue-property-decorator";
import UserModule from "@/store/modules/user";
import NavigationOperator from "./NavigationOperator.vue";
import NavigationSupplier from "./NavigationSupplier.vue";

@Component({
  name: "Navigation",
  components: {
    NavigationOperator,
    NavigationSupplier
  }
})
export default class Navigation extends Vue {
  @PropSync("drawer", { type: Boolean }) drawerSync!: boolean | null;
  check = false;
  fullname = "";
  username = "";
  roles = [] as any;
  protected navigation = NavigationSupplier;
  async created() {
    if (this.$auth.check(["ROLE_MODERATOR", "ROLE_ADMIN"])) {
      this.navigation = NavigationOperator;
    }
    await UserModule.loadProfile();
    if (UserModule.getCurrentUser != null) {
      console.log(UserModule.getCurrentUser.role);
      this.roles = UserModule.getCurrentUser.role;
      this.username = UserModule.getCurrentUser.username;
    }
  }
}
</script>
<style>
.ava {
  border-radius: 50% !important;
  height: 110px !important;
  width: 0px !important;
}
</style>
