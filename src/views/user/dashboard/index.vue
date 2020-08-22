<template>
  <v-container fluid>
    <Welcome />
    <DetailVersion />
    <UpdateVersion />
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Welcome from "./components/Welcome.vue";
import DetailVersion from "./components/DetailVersion.vue";
import UpdateVersion from "./components/UpdateVersion.vue";

@Component({
  components: {
    Welcome,
    DetailVersion,
    UpdateVersion
  }
})
export default class Dashboard extends Vue {}
</script>
<style scoped lang="css"></style>
