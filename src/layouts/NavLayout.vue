<template>
  <div v-if="isUser">
    <Navigation :drawer.sync="drawer" />
    <Appbar :drawer.sync="drawer" />
    <v-main>
      <router-view></router-view>
    </v-main>
    <Footer />
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Navigation from "@/components/Navigation.vue";
import Appbar from "@/components/Appbar.vue";
import Footer from "@/components/Footer.vue";

@Component({
  name: "NavLayout",
  components: {
    Navigation,
    Appbar,
    Footer
  }
})
export default class NavLayout extends Vue {
  public drawer = false;

  get isUser() {
    return this.$auth.check([
      "ROLE_ADMIN",
      "ROLE_MODERATOR",
      "ROLE_FORWARDER",
      "ROLE_MERCHANT",
      "ROLE_SHIPPINGLINE",
      "ROLE_DRIVER"
    ]);
  }

  @Watch("isUser", { immediate: true })
  onUserChange(val: boolean) {
    if (val == false) {
      // Logout if session expired
      this.$auth.logout();
    }
  }

  created() {
    this.$vuetify.theme.dark = false;
  }
}
</script>
<style lang="css">
.v-application--wrap {
  background-color: #f2f4f7;
}
.container.container--fluid > div {
  background-color: #f2f4f7;
}
.v-dialog .v-card__title,
.container.container--fluid .v-card__title,
.container.container--fluid .v-toolbar__title {
  font-weight: bolder;
  color: #00532f;
}
.v-list.v-sheet.theme--light.v-list--dense .v-list-item__icon .v-icon {
  color: #005caf;
}
th.text-start {
  background: #00532f;
  color: #fff !important;
}
.v-data-table__expanded .v-data-table.v-data-table--dense.theme--light {
  background: #f2f4f7;
}
.v-data-table__expanded th.text-start {
  background: #005caf !important;
  color: #fff !important;
}
.v-data-table__expanded .v-data-footer__select .v-select {
  margin: 5px 0 5px 34px !important;
}
</style>
