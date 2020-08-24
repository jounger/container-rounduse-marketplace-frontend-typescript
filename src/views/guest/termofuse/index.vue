<template
  ><v-container class="fill-height; card" fluid>
    <Termofuse />
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Termofuse from "./components/Termofuse.vue";

@Component({
  components: {
    Termofuse
  }
})
export default class Term extends Vue {}
</script>
<style scoped lang="css">
.card {
  padding: 0 !important;
  margin: 0 !important;
}
section {
  height: fit-content;
}
</style>
