<template>
  <v-list>
    <v-list-item to="/dashboard" v-if="$auth.check()">
      <v-list-item-icon>
        <v-icon>mdi-view-dashboard</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Trang tổng quan</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-group
      prepend-icon="account_circle"
      value="true"
      v-if="$auth.check('ROLE_ADMIN')"
    >
      <template v-slot:activator>
        <v-list-item-title>Quản lý người dùng</v-list-item-title>
      </template>
      <v-list-item to="/operator">
        <v-list-item-title>Quản trị viên</v-list-item-title>
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-list-item to="/role">
        <v-list-item-title>Phân quyền</v-list-item-title>
        <v-list-item-icon>
          <v-icon>mdi-image</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-list-item to="/permission">
        <v-list-item-title>Phân vai trò</v-list-item-title>
        <v-list-item-icon>
          <v-icon>mdi-image</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list-group>
    <v-list-group
      prepend-icon="account_circle"
      value="true"
      v-if="$auth.check('ROLE_MODERATOR')"
    >
      <template v-slot:activator>
        <v-list-item-title>Quản lý chung</v-list-item-title>
      </template>
      <v-list-item to="/supplier-register">
        <v-list-item-icon>
          <v-icon>mdi-help-box</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Đơn đăng ký</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/supplier">
        <v-list-item-icon>
          <v-icon>mdi-help-box</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Quản lý Supplier</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/supplier-ban">
        <v-list-item-icon>
          <v-icon>mdi-help-box</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Quản lý Supplier bị khóa</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/shipping-line">
        <v-list-item-icon>
          <v-icon>mdi-image</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Hãng tàu</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/port">
        <v-list-item-icon>
          <v-icon>mdi-help-box</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Cảng</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/container-type">
        <v-list-item-icon>
          <v-icon>mdi-help-box</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Loại Container</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item to="/discount">
        <v-list-item-icon>
          <v-icon>mdi-help-box</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Mã giảm giá</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-group>
  </v-list>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  name: "NavigationOperator"
})
export default class NavigationOperator extends Vue {}
</script>
