<template>
  <v-list>
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
