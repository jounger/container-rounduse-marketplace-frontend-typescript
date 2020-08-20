<template>
  <v-app>
    <Loading />
    <Snackbars />
    <transition mode="out-in">
      <component :is="layout"> </component>
    </transition>
  </v-app>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Snackbars from "@/components/Snackbars.vue";
import Loading from "@/components/Loading.vue";
import { Route } from "vue-router";

@Component({
  components: {
    Snackbars,
    Loading
  }
})
export default class App extends Vue {
  PREFIX_TITLE = "CRuM";
  DEFAULT_TITLE = "CRuM - Trang trống";

  get layout() {
    return this.$route.meta.layout || "DefaultLayout";
  }

  @Watch("$route", { immediate: true })
  onRouterChange(to: Route) {
    const _title = to.meta.title
      ? this.PREFIX_TITLE + " - " + to.meta.title
      : this.DEFAULT_TITLE;
    document.title = _title;
  }
}
</script>
<style lang="css">
@import "./assets/css/vuetify-remake.css";
</style>
