<template>
  <v-snackbar
    v-model="display"
    :bottom="false"
    :color="snackbarInfo.color"
    :left="false"
    :multi-line="false"
    :right="true"
    :timeout="snackbarInfo.timeout"
    :top="true"
    :vertical="false"
    >{{ snackbarInfo.text }}
    <v-btn dark text @click="closeSnackbar()">
      Close
    </v-btn>
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
