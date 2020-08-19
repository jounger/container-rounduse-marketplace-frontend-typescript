<template>
  <v-snackbar
    v-model="display"
    :top="true"
    :left="false"
    :bottom="false"
    :right="true"
    :vertical="false"
    :multi-line="true"
    :color="snackbarInfo.color"
    :timeout="snackbarInfo.timeout"
    >{{ snackbarInfo.text }}
    <template v-slot:action="{ attrs }">
      <v-btn dark text @click="closeSnackbar()" v-bind="attrs">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import snackbar from "@/store/modules/snackbar";

@Component
export default class Snackbars extends Vue {
  display = false;

  get snackbarDisplay() {
    return snackbar.displayMode;
  }

  get snackbarInfo() {
    return snackbar.snackbarInfo;
  }

  closeSnackbar() {
    snackbar.setDisplay(false);
  }

  @Watch("snackbarDisplay")
  onSnackbarChange(val: boolean) {
    this.display = val;
  }

  @Watch("display")
  onDisplayChange(val: boolean) {
    if (val == false) {
      snackbar.setDisplay(val);
    }
  }
}
</script>
