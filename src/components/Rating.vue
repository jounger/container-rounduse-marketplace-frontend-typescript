<template>
  <v-dialog v-model="dialogSync" persistent max-width="600px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span class="headline" style="color:white;">Đánh giá</span>
          <v-btn
            icon
            dark
            @click="dialogSync = false"
            style="margin-left:308px;"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-rating v-model="ratingSync"></v-rating>
      </v-card-text>
      <v-card-actions style="margin-top: 65px;">
        <v-spacer></v-spacer>
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
