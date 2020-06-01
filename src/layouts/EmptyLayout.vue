<template>
  <div>
    <v-container>
      <h1>Empty Layout</h1>
      <slot />
    </v-container>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class EmptyLayout extends Vue {}
</script>
