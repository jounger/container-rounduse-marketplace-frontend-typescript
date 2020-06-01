<template>
  <div>Logging out...</div>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import EmptyLayout from "@/layouts/EmptyLayout.vue";
@Component
export default class Logout extends Vue {
  @PropSync("layout") layoutSync!: object;
  created() {
    this.layoutSync = EmptyLayout;
  }
  public mounted() {
    this.$auth.logout();
    if (!this.$auth.check()) {
      this.$router.push({ name: "Login" });
    }
  }
}
</script>

<style></style>
