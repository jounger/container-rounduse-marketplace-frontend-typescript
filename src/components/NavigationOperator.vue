<template>
  <v-list>
    <v-list-item
      to="/admin"
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
        to="/moderator-management"
        v-if="$auth.check(['ROLE_MODERATOR', 'ROLE_ADMIN'])"
      >
        <v-list-item-title>Đối tác</v-list-item-title>
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-list-item to="/admin-management" v-if="$auth.check(['ROLE_ADMIN'])">
        <v-list-item-title>Quản trị viên</v-list-item-title>
        <v-list-item-icon>
          <v-icon>mdi-help-box</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-list-item to="/roles-management" v-if="$auth.check(['ROLE_ADMIN'])">
        <v-list-item-title>Phân quyền</v-list-item-title>
        <v-list-item-icon>
          <v-icon>mdi-image</v-icon>
        </v-list-item-icon>
      </v-list-item>
      <v-list-item
        to="/permission-management"
        v-if="$auth.check(['ROLE_ADMIN'])"
      >
        <v-list-item-title>Phân vai trò</v-list-item-title>
        <v-list-item-icon>
          <v-icon>mdi-image</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list-group>
    <v-list-item to="/request-user-management">
      <v-list-item-icon>
        <v-icon>mdi-help-box</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Yêu cầu đăng ký</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item to="/shipping-line-management">
      <v-list-item-icon>
        <v-icon>mdi-image</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Quản lý Hãng tàu</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item to="/icd-management">
      <v-list-item-icon>
        <v-icon>mdi-help-box</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Quản lý ICD</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-list-item to="/container-type-management">
      <v-list-item-icon>
        <v-icon>mdi-help-box</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Quản lý loại Container</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item to="/port-management">
      <v-list-item-icon>
        <v-icon>mdi-help-box</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Quản lý bến cảng</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  name: "NavigationOperator"
})
export default class NavigationOperator extends Vue {}
</script>
