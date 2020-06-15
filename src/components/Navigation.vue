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
              fullname
            }}</router-link></v-list-item-title
          >
          <v-list-item-subtitle style="margin-top:10px;"
            ><v-list-item v-for="(item, i) in roles" :key="i">
              <v-list-item-title
                v-text="item"
              ></v-list-item-title> </v-list-item
          ></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>

    <v-list dense nav>
      <v-list-item
        @click="toDashboard"
        v-if="$auth.check(['ROLE_MODERATOR', 'ROLE_ADMIN'])"
      >
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
        <v-list-item
          @click="toModermator"
          v-if="$auth.check(['ROLE_MODERATOR', 'ROLE_ADMIN'])"
        >
          <v-list-item-title>Đối tác</v-list-item-title>
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item
          @click="toShippingline"
          v-if="$auth.check(['ROLE_MODERATOR', 'ROLE_USER'])"
        >
          <v-list-item-title>Hãng tàu</v-list-item-title>
          <v-list-item-icon>
            <v-icon>mdi-image</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item @click="toAdmin" v-if="$auth.check(['ROLE_ADMIN'])">
          <v-list-item-title>Quản trị viên</v-list-item-title>
          <v-list-item-icon>
            <v-icon>mdi-help-box</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item
          @click.native="toRoles"
          v-if="$auth.check(['ROLE_ADMIN'])"
          style="cursor: pointer;"
        >
          <v-list-item-title>Phân quyền</v-list-item-title>
          <v-list-item-icon>
            <v-icon>mdi-image</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item
          @click.native="toPermission"
          v-if="$auth.check(['ROLE_ADMIN'])"
          style="cursor: pointer;"
        >
          <v-list-item-title>Phân vai trò</v-list-item-title>
          <v-list-item-icon>
            <v-icon>mdi-image</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-group>
      <v-list-item @click="toConsignment" v-if="$auth.check(['ROLE_USER'])">
        <v-list-item-icon>
          <v-icon>mdi-help-box</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Quản lý hàng</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
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
  check = false;
  fullname = "";
  roles = [] as any;
  async created() {
    await UserModule.loadProfile();
    if (UserModule.getCurrentUser != null) {
      this.fullname = UserModule.getCurrentUser.fullname;
      console.log(UserModule.getCurrentUser.roles);
      this.roles = UserModule.getCurrentUser.roles;
    }
  }
  public toDashboard(): void {
    this.$router.push("/admin");
  }
  public toProfile(): void {
    this.$router.push("/profile");
  }
  public toAdmin(): void {
    this.$router.push("/admin-management");
  }
  public toModermator(): void {
    this.$router.push("/moderator-management");
  }
  public toShippingline(): void {
    this.$router.push("/shipping-line-management");
  }
  public toRoles(): void {
    this.$router.push("/roles-management");
  }
  public toPermission(): void {
    this.$router.push("/permission-management");
  }
  public toConsignment(): void {
    this.$router.push("/consignment-management");
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
