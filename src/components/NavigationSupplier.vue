<template>
  <v-list>
    <v-list-item to="/outbound">
      <v-list-item-icon>
        <v-icon>mdi-help-box</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Quản lý hàng xuất</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item to="/consignment-new">
      <v-list-item-icon>
        <v-icon>mdi-help-box</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Quản lý hàng (bản mới)</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item to="/inbound">
      <v-list-item-icon>
        <v-icon>mdi-image</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Quản lý hàng nhập</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item to="/driver">
      <v-list-item-icon>
        <v-icon>mdi-image</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Quản lý lái xe</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
    <v-list-item to="/bidding-document">
      <v-list-item-icon>
        <v-icon>mdi-help-box</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title>Quản lý HSMT</v-list-item-title>
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
