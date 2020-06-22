<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col class="text-center">
          <p v-if="$auth.check()">User is logged in</p>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
@Component
export default class Home extends Vue {
  @PropSync("layout") layoutSync!: object;
  created() {
    this.layoutSync = DefaultLayout;
  }
}
</script>
