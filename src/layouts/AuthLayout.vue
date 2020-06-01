<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <slot />
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  name: "AuthLayout"
})
export default class AuthLayout extends Vue {}
</script>
