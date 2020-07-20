<template>
  <div>
    <Snackbars />
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <slot />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Snackbars from "../components/Snackbars.vue";

@Component({
  name: "AuthLayout",
  components: {
    Snackbars
  }
})
export default class AuthLayout extends Vue {}
</script>
