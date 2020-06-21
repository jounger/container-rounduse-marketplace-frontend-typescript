<template>
  <v-snackbar
    v-model="snackbarSync"
    :bottom="false"
    :color="color"
    :left="false"
    :multi-line="false"
    :right="true"
    :timeout="timeout"
    :top="true"
    :vertical="false"
    >{{ text }}
    <template v-slot:action="{ attrs }">
      <v-btn dark text v-bind="attrs" @click="snackbarSync = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
@Component
export default class Snackbar extends Vue {
  @Prop({ default: "" }) readonly text!: string;
  @PropSync("snackbar", { type: Boolean, default: false })
  snackbarSync!: boolean;
  color = "success";
  timeout = 6000;
}
</script>
