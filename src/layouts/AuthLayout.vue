<template>
  <div class="mt-12">
    <v-row justify="center" class="mt-12">
      <slot />
    </v-row>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "AuthLayout"
})
export default class AuthLayout extends Vue {}
</script>
