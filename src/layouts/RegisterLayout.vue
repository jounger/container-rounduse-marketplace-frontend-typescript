<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="8">
          <slot />
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Snackbars from "../components/Snackbars.vue";

@Component({
  name: "RegisterLayout",
  components: {
    Snackbars
  }
})
export default class RegisterLayout extends Vue {}
</script>
