<template>
  <v-snackbar
    v-model="snackbarSync"
    :bottom="false"
    :class="typeClass"
    :left="false"
    :multi-line="false"
    :right="true"
    :timeout="timeout"
    :top="true"
    :vertical="false"
    >{{ text }}
    <v-btn dark text @click="snackbarSync = false">
      Close
    </v-btn>
  </v-snackbar>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";

@Component
export default class NotificationMessage extends Vue {
  @Prop(Object) notification!: any;
  @PropSync("snackbar", { type: Boolean, default: false })
  snackbarSync!: boolean;
  color = "success";
  timeout = 6000;
  text = this.notification.message || "";
  created() {
    this.timeout = setTimeout(() => {
      this.$store.dispatch("removeNotification", this.notification);
    }, 3000);
  }
  get typeClass() {
    return `alert-${this.notification.type}`;
  }
  beforeDestroy() {
    clearTimeout(this.timeout);
  }
}
</script>
