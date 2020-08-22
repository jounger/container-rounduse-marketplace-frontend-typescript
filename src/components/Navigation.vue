<template>
  <v-navigation-drawer
    app
    :mini-variant="drawerSync"
    :expand-on-hover="drawerSync"
    permanent
    clipped-left
    v-if="$auth.user()"
    class="nav-custom"
  >
    <v-list dense nav>
      <v-list-item two-line :class="drawerSync && 'px-0'">
        <v-list-item-avatar color="tertiary">
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
          <v-list-item-title link to="/profile">{{
            $auth.user().fullname
          }}</v-list-item-title>
          <v-list-item-subtitle>
            <v-icon small color="success">
              {{ getUserRole.icon || "account_circle" }}</v-icon
            >
            {{ getUserRole.vi }}</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <v-list dense>
      <v-list-item
        v-for="item in getHeaderNavigation"
        :key="item.title"
        :to="item.link"
        link
        color="primary"
      >
        <v-list-item-icon>
          <v-icon color="primary">{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="ml-6">{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <component :is="navigation"> </component>
    <v-list dense>
      <v-list-item
        v-for="item in getNavigation"
        :key="item.title"
        :to="item.link"
        link
        color="primary"
      >
        <v-list-item-icon>
          <v-icon color="primary">{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="ml-6">{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="pa-2" v-if="$auth.user()">
        <v-btn block to="/logout" v-if="!drawerSync">Đăng xuất</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from "vue-property-decorator";
import NavigationOperator from "./NavigationOperator.vue";
import NavigationSupplier from "./NavigationSupplier.vue";
import { Matching } from "./ChipStatus.vue";

@Component({
  components: {
    NavigationOperator,
    NavigationSupplier
  }
})
export default class Navigation extends Vue {
  @PropSync("drawer", { type: Boolean, default: true }) drawerSync!: boolean;

  roleMatching = [
    {
      en: "ROLE_ADMIN",
      vi: "Quản trị viên",
      color: "primary",
      icon: "security"
    },
    {
      en: "ROLE_MODERATOR",
      vi: "Người điều hành",
      color: "secondary",
      icon: "supervised_user_circle"
    },
    {
      en: "ROLE_FORWARDER",
      vi: "Chủ xe",
      color: "warning",
      icon: "verified_user"
    },
    {
      en: "ROLE_MERCHANT",
      vi: "Chủ hàng",
      color: "warning",
      icon: "verified_user"
    },
    {
      en: "ROLE_SHIPPINGLINE",
      vi: "Hãng tàu",
      color: "info",
      icon: "directions_boat"
    },
    {
      en: "ROLE_DRIVER",
      vi: "Lái xe",
      color: "success",
      icon: "account_circle"
    }
  ] as Matching[];

  protected navigation: object = NavigationSupplier;
  protected generalNavigation = [
    { title: "Trang cá nhân", icon: "account_circle", link: "/profile" }
  ];
  protected headerNavigation = [
    { title: "Bảng điều khiển", icon: "dashboard", link: "/dashboard" }
  ];

  get getUserRole() {
    const _role = this.roleMatching.filter(
      x => x.en == this.$auth.user().roles
    )[0];
    if (_role) return _role;
    else return "";
  }

  get getNavigation() {
    if (this.$auth.user()) {
      return this.generalNavigation;
    } else {
      return this.$router.push("/");
    }
  }
  get getHeaderNavigation() {
    if (this.$auth.user()) {
      return this.headerNavigation;
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
<style scopedSlots>
/* width */
.nav-custom ::-webkit-scrollbar {
  width: 5px;
}

/* Track */
.nav-custom ::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
.nav-custom ::-webkit-scrollbar-thumb {
  background: rgb(204, 204, 204);
  border-radius: 10px;
}

/* Handle on hover */
.nav-custom ::-webkit-scrollbar-thumb:hover {
  background: rgb(151, 151, 151);
}
</style>
