<template>
  <v-container fluid>
    <v-row class="mt-5">
      <v-col cols="12" md="6"> <OverviewCard /></v-col>
      <v-col cols="12" md="1"> </v-col>
      <v-col cols="12" md="5"> <OverviewChart /></v-col>
    </v-row>
    <v-row v-if="$auth.check('ROLE_MODERATOR')">
      <v-col cols="12"> <ModeratorOverviewCard /></v-col>
    </v-row>
    <v-row v-else>
      <v-col cols="12" md="6"> <CompareChart /></v-col>
      <v-col cols="12" md="1"> </v-col>
      <v-col cols="12" md="5"> <ConversionChart /></v-col>
    </v-row>
    <v-row v-if="$auth.check('ROLE_MERCHANT') || $auth.check('ROLE_FORWARDER')">
      <v-col cols="12"> <BiddingOverview /></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" v-if="!$auth.check('ROLE_SHIPPINGLINE')">
        <OverviewExtraCard
      /></v-col>
      <v-col
        cols="12"
        md="6"
        :class="!$auth.check('ROLE_SHIPPINGLINE') ? 'mt-5' : 'mt-5 ml-10'"
      >
        <Newest
      /></v-col>
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
import ModeratorOverviewCard from "./components/ModeratorOverviewCard.vue";
import BiddingOverview from "./components/BiddingOverview.vue";

@Component({
  components: {
    OverviewChart,
    OverviewCard,
    CompareChart,
    ConversionChart,
    OverviewExtraCard,
    Newest,
    ModeratorOverviewCard,
    BiddingOverview
  }
})
export default class Overview extends Vue {}
</script>
<style scoped lang="css"></style>
