<template>
  <v-navigation-drawer v-model="drawerSync" app clipped v-if="$auth.check()">
    <v-list dense nav>
      <v-list-item two-line class="px-0" link to="/profile">
        <v-list-item-avatar>
          <v-img src="@/assets/images/ava.jpg" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ fullname }}</v-list-item-title>
          <v-list-item-subtitle style="margin-top:10px;">
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
import { getOperatorByUsername } from "@/api/operator";
import { IOperator } from "@/entity/operator";
import { getDriverById } from "@/api/driver";
import { getSupplier } from "../api/supplier";
import { getShippingLine } from "../api/shipping-line";

@Component({
  name: "Navigation",
  components: {
    NavigationOperator,
    NavigationSupplier
  }
})
export default class Navigation extends Vue {
  @PropSync("drawer", { type: Boolean }) drawerSync!: boolean;

  protected navigation: object = NavigationSupplier;
  protected generalNavigation = [
    { title: "Trang cá nhân", icon: "account_circle", link: "/profile" }
  ];
  fullname = "";

  async getFullName() {
    if (this.$auth.user() && this.$auth.user().username) {
      if (
        this.$auth.user().roles[0] == "ROLE_ADMIN" ||
        this.$auth.user().roles[0] == "ROLE_MODERATOR"
      ) {
        const _fullname = await getOperatorByUsername(
          this.$auth.user().username
        )
          .then(res => {
            const response: IOperator = res.data;
            console.log(response.fullname);
            return toCapitalize(response.fullname);
          })
          .catch(err => {
            console.log(err);
            return "";
          });
        console.log(_fullname);
        if (_fullname) {
          this.fullname = _fullname;
        }
      } else if (this.$auth.user().roles[0] == "ROLE_DRIVER") {
        const _fullname = await getDriverById(this.$auth.user().id)
          .then(res => {
            const response = res.data;
            return toCapitalize(response.fullname);
          })
          .catch(err => {
            console.log(err);
            return "";
          });
        console.log(_fullname);
        if (_fullname) {
          this.fullname = _fullname;
        }
      } else if (
        this.$auth.user().roles[0] == "ROLE_FORWARDER" ||
        this.$auth.user().roles[0] == "ROLE_MERCHANT"
      ) {
        const _fullname = await getSupplier(this.$auth.user().username)
          .then(res => {
            const response = res.data;
            return toCapitalize(response.contactPerson);
          })
          .catch(err => {
            console.log(err);
            return "";
          });
        console.log(_fullname);
        if (_fullname) {
          this.fullname = _fullname;
        }
      } else {
        const _fullname = await getShippingLine(this.$auth.user().id)
          .then(res => {
            const response = res.data;
            return toCapitalize(response.contactPerson);
          })
          .catch(err => {
            console.log(err);
            return "";
          });
        console.log(_fullname);
        if (_fullname) {
          this.fullname = _fullname;
        }
      }
    }
  }

  get getUserRole() {
    if (
      this.$auth.user() &&
      typeof this.$auth.user().roles !== "undefined" &&
      this.$auth.user().roles.length > 0
    ) {
      return this.$auth
        .user()
        .roles[0].toLowerCase()
        .substring(5);
    }
    return "";
  }

  get getNavigation() {
    if (this.$auth.check()) {
      return this.generalNavigation;
    } else {
      return this.$router.push("/");
    }
  }

  async created() {
    if (this.$auth.check(["ROLE_ADMIN", "ROLE_MODERATOR"])) {
      this.navigation = NavigationOperator;
    }
    await this.getFullName();
  }
}
</script>
<style></style>
