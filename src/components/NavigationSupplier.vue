<template>
  <v-list>
    <v-list-item to="/consignment-management">
      <v-list-item-icon>
        <v-icon>mdi-help-box</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Quản lý hàng</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item to="/consignment-management-new">
      <v-list-item-icon>
        <v-icon>mdi-help-box</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Quản lý hàng (bản mới)</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item to="/container-management">
      <v-list-item-icon>
        <v-icon>mdi-image</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Quản lý Container</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item to="/driver-management">
      <v-list-item-icon>
        <v-icon>mdi-image</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Quản lý Lái xe</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item to="/bidding-document-management">
      <v-list-item-icon>
        <v-icon>mdi-help-box</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Quản lý Hồ sơ mời thầu</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  name: "NavigationSupplier"
})
export default class NavigationSupplier extends Vue {}
</script>