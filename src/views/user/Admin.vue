<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <h1>ADMIN SECTION</h1>
      </v-row>
    </v-container>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";

@Component
export default class Admin extends Vue {
  @PropSync("layout") layoutSync!: object;
  private users = [];
  created() {
    this.layoutSync = NavLayout;
  }
}
</script>
