<template>
  <v-navigation-drawer v-model="drawer" app clipped v-if="$auth.check()">
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
import { Vue, Component, Prop } from "vue-property-decorator";
import NavigationOperator from "./NavigationOperator.vue";
import NavigationSupplier from "./NavigationSupplier.vue";
import { getOperatorByUsername } from "@/api/operator";
import { IOperator } from "@/entity/operator";
import { getSupplier } from "@/api/supplier";
import { getShippingLine } from "@/api/shipping-line";
import { ISupplier } from "@/entity/supplier";
import { IShippingLine } from "@/entity/shipping-line";

@Component({
  components: {
    NavigationOperator,
    NavigationSupplier
  }
})
export default class Navigation extends Vue {
  @Prop() drawer!: boolean;

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
        const _res = await getOperatorByUsername(this.$auth.user().username);
        if (_res.data) {
          const _operator = _res.data as IOperator;
          this.fullname = _operator.fullname;
        }
      } else if (
        this.$auth.user().roles[0] == "ROLE_FORWARDER" ||
        this.$auth.user().roles[0] == "ROLE_MERCHANT"
      ) {
        const _res = await getSupplier(this.$auth.user().username);
        if (_res.data) {
          const _supplier = _res.data as ISupplier;
          this.fullname = _supplier.contactPerson;
        }
      } else {
        const _res = await getShippingLine(this.$auth.user().id);
        if (_res.data) {
          const _shippingLine = _res.data as IShippingLine;
          this.fullname = _shippingLine.contactPerson;
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
