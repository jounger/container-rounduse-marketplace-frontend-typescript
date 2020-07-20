<template>
  <v-list dense>
    <template v-for="item in getNavigation">
      <v-row v-if="item.heading" :key="item.heading" align="center">
        <v-col cols="6">
          <v-subheader v-if="item.heading">
            {{ item.heading }}
          </v-subheader>
        </v-col>
        <v-col cols="6" class="text-center">
          <a href="#!" class="body-2 black--text">EDIT</a>
        </v-col>
      </v-row>
      <v-list-group
        v-else-if="item.children"
        :key="item.title"
        v-model="item.model"
        :prepend-icon="item.model ? item.icon : item['icon-alt']"
        append-icon=""
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(child, i) in item.children"
          :key="i"
          link
          :to="child.link"
        >
          <v-list-item-action v-if="child.icon">
            <v-icon>{{ child.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ child.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-list-item v-else :key="item.title" link :to="item.link">
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>
            {{ item.title }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
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
    { title: "Quản lý Hàng ghép", icon: "table_chart", link: "/combined" },
    // { title: "Quản lý Hợp đồng", icon: "folder", link: "/contract" },
    { title: "Quản lý Hóa đơn", icon: "store", link: "/payment" },
    {
      title: "Quản lý HSMT",
      icon: "business_center",
      link: "/bidding-document"
    }
  ];
  private forwarderNavigation = [
    { title: "Dashboard", icon: "dashboard", link: "/dashboard" },
    { title: "Quản lý hàng nhập", icon: "flight_land", link: "/inbound" },
    { title: "Quản lý Hàng ghép", icon: "table_chart", link: "/combined" },
    // { title: "Quản lý Hợp đồng", icon: "folder", link: "/contract" },
    { title: "Quản lý Hóa đơn", icon: "store", link: "/payment" },
    {
      title: "Quản lý đấu thầu",
      icon: "mdi-chevron-up",
      "icon-alt": "mdi-chevron-down",
      model: false,
      children: [
        {
          title: "HSMT Nhận được",
          icon: "compass_calibration",
          link: "/invited-bidding"
        },
        { title: "Quản lý HSDT", icon: "business_center", link: "/bid" },
        { title: "Quản lý Report", icon: "report_problem", link: "/report" }
      ]
    },
    {
      title: "Quản lý Lái Xe & Xe",
      icon: "mdi-chevron-up",
      "icon-alt": "mdi-chevron-down",
      model: false,
      children: [
        {
          title: "Quản lý Driver",
          icon: "airline_seat_recline_normal",
          link: "/driver"
        },
        {
          title: "Quản lý Đầu kéo",
          icon: "tram",
          link: "/tractor"
        },
        {
          title: "Quản lý Rơ moóc",
          icon: "format_strikethrough",
          link: "/trailer"
        }
      ]
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
