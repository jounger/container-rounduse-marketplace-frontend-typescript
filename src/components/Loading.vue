<template>
  <div class="text-center">
    <v-dialog v-model="loading" :overlay-opacity="0.1" persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          {{ loadingInfo.text }}
          <v-progress-linear
            indeterminate
            :color="loadingInfo.color"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import loading from "@/store/modules/loading";

@Component
export default class Loading extends Vue {
  get loading() {
    return loading.loadingMode;
  }

  get loadingInfo() {
    return loading.loadingInfo;
  }
}
</script>
