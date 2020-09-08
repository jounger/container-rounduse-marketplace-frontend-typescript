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
  name: "NavigationOperator"
})
export default class NavigationOperator extends Vue {
  private adminNavigation = [
    {
      title: "Quản lý Quản trị viên",
      icon: "verified_user",
      link: "/operator"
    },
    {
      title: "Quản lý Vai trò",
      icon: "security",
      link: "/role"
    },
    {
      title: "Quản lý Đặc quyền",
      icon: "enhanced_encryption",
      link: "/permission"
    }
  ];
  private moderatorNavigation = [
    { title: "Trang tổng quan", icon: "equalizer", link: "/overview" },
    {
      title: "Quản lý Đơn đăng ký",
      icon: "account_balance",
      link: "/supplier-register"
    },
    {
      title: "Quản lý Thành viên",
      icon: "people_alt",
      link: "/supplier"
    },
    {
      title: "Quản lý Hãng tàu",
      icon: "directions_boat",
      link: "/shipping-line"
    },
    { title: "Quản lý Cảng", icon: "flag", link: "/port" },
    {
      title: "Quản lý Loại Cont",
      icon: "directions_bus",
      link: "/container-type"
    },
    { title: "Quản lý Mã giảm giá", icon: "loyalty", link: "/discount" },
    {
      title: "Quản lý Báo cáo",
      icon: "report_problem",
      link: "/report"
    }
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
