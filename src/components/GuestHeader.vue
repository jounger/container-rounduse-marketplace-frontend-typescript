<template>
  <v-app-bar app clipped-left color="blue">
    <router-link to="/" class="home"
      ><v-toolbar-title
        ><span style="color:white"
          >Container Round-use Marketplace</span
        ></v-toolbar-title
      ></router-link
    >
    <v-spacer></v-spacer>
    <v-btn
      v-for="link in links"
      :key="link.title"
      :to="link.link"
      color="white"
      text
      rounded
      class="my-2"
    >
      {{ link.title }}
    </v-btn>
    <v-menu left bottom :offset-y="true">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="white" icon outlined v-bind="attrs" v-on="on">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item
          v-for="item in menu"
          :key="item.title"
          :to="item.link"
          link
        >
          <v-list-item-icon>
            <v-icon small>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Menubar extends Vue {
  menu = [
    { title: "Đăng nhập", icon: "lock_open", link: "/login" },
    {
      title: "Đăng ký",
      icon: "assignment_ind",
      link: "/register"
    }
  ];
  links = [
    { title: "Trang chủ", link: "/homepage" },
    { title: "Về chúng tôi", scroll: "mission" },
    { title: "Điều khoản", scroll: "/rule" },
    { title: "Hỗ trợ", scroll: "/help" },
    { title: "Liên lạc", scroll: "/contact" }
  ];
}
</script>
<style lang="css" scopedSlots>
.home {
  text-decoration: none;
}
.home div {
  color: #000 !important;
}
</style>
