<template>
  <v-dialog v-model="dialogSync" persistent max-width="400">
    <v-card>
      <v-card-title class="headline">Đánh giá</v-card-title>
      <v-card-text>
        <v-rating v-model="ratingSync"></v-rating>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogSync = false">Trở về</v-btn>
        <v-btn @click="dialogSync = false" color="primary">Rating</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
@Component
export default class Rating extends Vue {
  @PropSync("dialog", { type: Boolean, default: false })
  dialogSync!: boolean;
  @PropSync("rating", { type: Number, default: false })
  ratingSync!: boolean;
}
</script>
