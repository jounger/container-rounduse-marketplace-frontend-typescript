<template>
  <v-app>
    <Snackbars />
    <component :is="layout">
      <transition mode="out-in">
        <router-view></router-view>
      </transition>
    </component>
  </v-app>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Snackbars from "@/components/Snackbars.vue";

@Component({
  components: {
    Snackbars
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
