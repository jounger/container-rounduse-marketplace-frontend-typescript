<template>
  <div v-if="isUser">
    <Navigation :drawer.sync="drawer" />
    <Appbar :drawer.sync="drawer" />
    <slot />
    <div style="margin-top:30px;">
      <Footer />
    </div>
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
  public drawer = true;

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
    if (typeof val !== "undefined" && this.isUser == false) {
      // Logout if session expired
      this.$auth.logout();
    }
  }

  created() {
    this.$vuetify.theme.dark = false;
  }
}
</script>
