<template>
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
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  name: "NavigationSupplier"
})
export default class NavigationSupplier extends Vue {
  private merchantNavigation = [
    { title: "Dashboard", icon: "dashboard", link: "/dashboard" },
    { title: "Quản lý hàng xuất", icon: "dashboard", link: "/outbound" },
    { title: "Quản lý hàng (new)", icon: "dashboard", link: "/outbound-new" },
    { title: "Quản lý HSMT", icon: "dashboard", link: "/bidding-document" }
  ];
  private forwarderNavigation = [
    { title: "Dashboard", icon: "dashboard", link: "/dashboard" },
    { title: "Quản lý hàng nhập", icon: "dashboard", link: "/inbound" },
    { title: "Quản lý HSDT", icon: "dashboard", link: "/bid" },
    { title: "Quản lý Driver", icon: "dashboard", link: "/driver" }
  ];

  get getNavigation() {
    if (this.$auth.check("ROLE_FORWARDER")) {
      return this.forwarderNavigation;
    } else {
      return this.merchantNavigation;
    }
  }
}
</script>
