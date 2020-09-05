<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6"> <OverviewCard /></v-col>
      <v-col cols="12" md="1"> </v-col>
      <v-col cols="12" md="5"> <OverviewChart /></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6"> <CompareChart /></v-col>
      <v-col cols="12" md="1"> </v-col>
      <v-col cols="12" md="5"> <ConversionChart /></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="7"> <OverviewExtraCard /></v-col>
      <v-col cols="12" md="5" class="mt-5"> <Newest /></v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import OverviewChart from "./components/OverviewChart.vue";
import OverviewCard from "./components/OverviewCard.vue";
import CompareChart from "./components/CompareChart.vue";
import ConversionChart from "./components/ConversionChart.vue";
import OverviewExtraCard from "./components/OverviewExtraCart.vue";
import Newest from "./components/Newest.vue";

@Component({
  components: {
    OverviewChart,
    OverviewCard,
    CompareChart,
    ConversionChart,
    OverviewExtraCard,
    Newest
  }
})
export default class Overview extends Vue {}
</script>
<style scoped lang="css"></style>
