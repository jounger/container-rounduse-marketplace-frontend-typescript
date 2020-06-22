<template>
  <v-container>
    <slot />
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class EmptyLayout extends Vue {}
</script>
