<template>
  <v-app>
    <component :is="layout">
      <router-view :layout.sync="layout"></router-view>
    </component>
  </v-app>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import EmptyLayout from "@/layouts/EmptyLayout.vue";
@Component
export default class App extends Vue {
  layout = EmptyLayout as object;
}
</script>
