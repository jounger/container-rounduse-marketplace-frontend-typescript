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
import { Component, Vue } from "vue-property-decorator";
import Snackbars from "@/components/Snackbars.vue";
import Loading from "@/components/Loading.vue";

@Component({
  components: {
    Snackbars,
    Loading
  }
})
export default class App extends Vue {
  get layout() {
    return this.$route.meta.layout || "DefaultLayout";
  }
}
</script>
<style lang="css">
@import "./assets/css/vuetify-remake.css";
</style>
