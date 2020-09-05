<template>
  <v-list dense v-if="$auth.user()">
    <template v-for="item in getNavigation">
      <v-row v-if="item.heading" :key="item.heading" align="center">
        <v-col cols="6">
          <v-subheader v-if="item.heading">
            {{ item.heading }}
          </v-subheader>
        </v-col>
        <v-col cols="6" class="text-center">
          <a href="#!" class="body-2 black--text">Chỉnh sửa</a>
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
          color="primary"
        >
          <v-list-item-action v-if="child.icon">
            <v-icon color="primary">{{ child.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>
              {{ child.title }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-list-item
        v-else
        :key="item.title"
        link
        :to="item.link"
        color="primary"
      >
        <v-list-item-action>
          <v-icon color="primary">{{ item.icon }}</v-icon>
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
    { title: "Trang tổng quan", icon: "dashboard", link: "/overview" },
    { title: "Quản lý Hàng xuất", icon: "flight_takeoff", link: "/outbound" },
    { title: "Quản lý Hàng ghép", icon: "table_chart", link: "/combined" },
    {
      title: "Quản lý đấu thầu",
      icon: "mdi-chevron-up",
      "icon-alt": "mdi-chevron-down",
      model: true,
      children: [
        {
          title: "Quản lý HSMT",
          icon: "business_center",
          link: "/bidding-document"
        },
        { title: "Quản lý Hợp đồng", icon: "folder", link: "/contract" },
        { title: "Quản lý Hóa đơn", icon: "store", link: "/invoice" }
      ]
    }
  ];
  private forwarderNavigation = [
    { title: "Trang tổng quan", icon: "dashboard", link: "/overview" },
    { title: "Quản lý Hàng nhập", icon: "flight_land", link: "/inbound" },
    { title: "Quản lý Hàng ghép", icon: "table_chart", link: "/combined" },
    {
      title: "Quản lý Đấu thầu",
      icon: "mdi-chevron-up",
      "icon-alt": "mdi-chevron-down",
      model: true,
      children: [
        {
          title: "HSMT Nhận được",
          icon: "compass_calibration",
          link: "/invited-bidding"
        },
        { title: "Quản lý HSDT", icon: "business_center", link: "/bid" },
        { title: "Quản lý Hợp đồng", icon: "folder", link: "/contract" },
        { title: "Quản lý Hóa đơn", icon: "store", link: "/invoice" },
        { title: "Quản lý Báo cáo", icon: "report_problem", link: "/report" }
      ]
    },
    {
      title: "Quản lý Lái Xe & Xe",
      icon: "mdi-chevron-up",
      "icon-alt": "mdi-chevron-down",
      model: false,
      children: [
        {
          title: "Quản lý Lái xe",
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

  private shippingLineNavigation = [
    { title: "Thông báo mượn", icon: "tram", link: "/borrow-notify" }
  ];

  private driverNavigation = [
    {
      title: "Hàng đang vận chuyển",
      icon: "format_strikethrough",
      link: "/transporting"
    },
    { title: "Danh sách vận đơn", icon: "tram", link: "/delivery" }
  ];

  private supplierRegisterNavigation = [
    { title: "Đơn đăng ký", icon: "assignment", link: "/application" }
  ];

  get getNavigation() {
    const status = this.$auth.user().status;
    if (status == "ACTIVE") {
      if (this.$auth.check("ROLE_FORWARDER")) {
        return this.forwarderNavigation;
      } else if (this.$auth.check("ROLE_MERCHANT")) {
        return this.merchantNavigation;
      } else if (this.$auth.check("ROLE_SHIPPINGLINE")) {
        return this.shippingLineNavigation;
      } else if (this.$auth.check("ROLE_DRIVER")) {
        return this.driverNavigation;
      } else {
        return [];
      }
    } else if (status == "PENDING") {
      return this.supplierRegisterNavigation;
    } else {
      return [];
    }
  }
}
</script>
