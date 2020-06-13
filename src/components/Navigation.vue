<template>
  <v-navigation-drawer v-model="drawerSync" app clipped>
    <v-list dense nav>
      <v-list-item two-line :class="'px-0'">
        <v-list-item-avatar size="90">
          <v-img src="@/img/ava.jpg" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="title" style="margin-left: 5px;"
            ><router-link to="/profile">{{
              profile.fullname
            }}</router-link></v-list-item-title
          >
          <v-list-item-subtitle style="margin-top:10px;"
            ><v-list-item v-for="(item, i) in profile.roles" :key="i">
              <v-list-item-title
                v-text="item"
              ></v-list-item-title> </v-list-item
          ></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item @click="dashboard">
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Trang tổng quan</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-group prepend-icon="account_circle" value="true">
        <template v-slot:activator>
          <v-list-item-title>Quản lý người dùng</v-list-item-title>
        </template>
        <v-list-item v-for="(item, i) in items" :key="i" link :to="item.to">
          <v-list-item-title v-text="item.title"></v-list-item-title>
          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-group>
      <v-list-item @click="toProfile">
        <v-list-item-icon>
          <v-icon>mdi-help-box</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Trang cá nhân</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Vue, Component, PropSync } from "vue-property-decorator";
import UserModule from "@/store/modules/user";
import { UserEntity } from "@/store/definitions/user";
@Component
export default class Navigation extends Vue {
  @PropSync("drawer", { type: Boolean }) drawerSync!: boolean | null;
  public profile: UserEntity | null = null;
  check = false;
  public items: Array<object> = [
    { title: "Đối tác", to: "/list-moderator", icon: "mdi-view-dashboard" },
    { title: "Hãng tàu", to: "/list-shipping-line", icon: "mdi-image" },
    { title: "Quản trị viên", to: "/list-admin", icon: "mdi-help-box" },
    { title: "Phân quyền", to: "/list-roles", icon: "mdi-help-box" },
    { title: "Phân vai trò", to: "/list-user", icon: "mdi-help-box" }
  ];
  async created() {
    await UserModule.loadProfile();
    this.profile = UserModule.getCurrentUser;
  }
  public dashboard(): void {
    this.$router.push("/admin");
  }
  public toProfile(): void {
    this.$router.push("/profile");
  }
  public checked(): void {
    this.check = !this.check;
  }
}
</script>
<style>
.ava {
  border-radius: 50% !important;
  height: 110px !important;
  width: 0px !important;
}
</style>
