<template>
  <v-dialog v-model="dialogSync" width="500">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Notify
      </v-card-title>

      <v-card-text>
        Create new account successful!
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="handleClick()">
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
@Component
export default class Dialog extends Vue {
  @PropSync("dialog") dialogSync!: boolean;
  public handleClick() {
    this.dialogSync = false;
    setTimeout(() => {
      this.$router.push({ name: "Login" });
    }, 2000);
  }
}
</script>
