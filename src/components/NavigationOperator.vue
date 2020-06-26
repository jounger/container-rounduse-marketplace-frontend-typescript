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
    { title: "Quản lý QTV", icon: "dashboard", link: "/operator" },
    { title: "Quản lý Role", icon: "dashboard", link: "/role" },
    { title: "Quản lý Permission", icon: "dashboard", link: "/permission" }
  ];
  private moderatorNavigation = [
    { title: "Dashboard", icon: "dashboard", link: "/dashboard" },
    { title: "Quản lý đơn Đky", icon: "dashboard", link: "/supplier-register" },
    { title: "Quản lý Supply", icon: "dashboard", link: "/supplier" },
    { title: "Quản lý Hãng tàu", icon: "dashboard", link: "/shipping-line" },
    { title: "Quản lý Port", icon: "dashboard", link: "/port" },
    { title: "Quản lý Loại Cont", icon: "dashboard", link: "/container-type" },
    { title: "Quản lý Mã giảm giá", icon: "dashboard", link: "/discount" }
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
