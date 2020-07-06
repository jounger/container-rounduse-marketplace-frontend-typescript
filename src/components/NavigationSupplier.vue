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
    { title: "Quản lý hàng xuất", icon: "flight_takeoff", link: "/outbound" },
    {
      title: "Quản lý HSMT",
      icon: "business_center",
      link: "/bidding-document"
    },
    { title: "Quản lý Hàng ghép", icon: "table_chart", link: "/combined" }
  ];
  private forwarderNavigation = [
    { title: "Dashboard", icon: "dashboard", link: "/dashboard" },
    { title: "Quản lý hàng nhập", icon: "flight_land", link: "/inbound" },
    { title: "Quản lý HSDT", icon: "business_center", link: "/bid" },
    {
      title: "HSMT Nhận được",
      icon: "compass_calibration",
      link: "/invited-bidding"
    },
    { title: "Quản lý Hàng ghép", icon: "table_chart", link: "/combined" },
    {
      title: "Quản lý Driver",
      icon: "airline_seat_recline_normal",
      link: "/driver"
    }
  ];

  private supplierRegisterNavigation = [
    { title: "Đơn đăng ký", icon: "dashboard", link: "/application" }
  ];

  get getNavigation() {
    if (this.$auth.check() && this.$auth.user().status === "PENDING") {
      return this.supplierRegisterNavigation;
    } else {
      if (this.$auth.check("ROLE_FORWARDER")) {
        return this.forwarderNavigation;
      } else {
        return this.merchantNavigation;
      }
    }
  }
}
</script>
