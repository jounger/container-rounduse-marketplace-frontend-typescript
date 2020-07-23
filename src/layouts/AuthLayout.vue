<template>
  <div class="mt-12">
    <Snackbars />
    <v-row justify="center" class="mt-12">
      <slot />
    </v-row>
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
