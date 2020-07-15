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
  name: "NavigationOperator"
})
export default class NavigationOperator extends Vue {
  private adminNavigation = [
    { title: "Dashboard", icon: "dashboard", link: "/dashboard" },
    {
      title: "Quản lý Quản trị viên",
      icon: "verified_user",
      link: "/operator"
    },
    { title: "Quản lý Quyền", icon: "security", link: "/role" },
    {
      title: "Quản lý Vai trò",
      icon: "enhanced_encryption",
      link: "/permission"
    }
  ];
  private moderatorNavigation = [
    { title: "Dashboard", icon: "dashboard", link: "/dashboard" },
    {
      title: "Quản lý Đơn đăng ký",
      icon: "account_balance",
      link: "/supplier-register"
    },
    {
      title: "Quản lý Report",
      icon: "report_problem",
      link: "/supplier-report"
    },
    {
      title: "Quản lý Người dùng",
      icon: "people_alt",
      link: "/supplier"
    },
    {
      title: "Quản lý Hãng tàu",
      icon: "directions_boat",
      link: "/shipping-line"
    },
    { title: "Quản lý Bến cảng", icon: "flag", link: "/port" },
    {
      title: "Quản lý Loại Cont",
      icon: "directions_bus",
      link: "/container-type"
    },
    { title: "Quản lý Mã giảm giá", icon: "loyalty", link: "/discount" }
  ];

  get getNavigation() {
    if (this.$auth.check("ROLE_ADMIN")) {
      return this.adminNavigation;
    } else {
      return this.moderatorNavigation;
    }
  }
}
</script>
