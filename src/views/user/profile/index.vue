<template>
  <v-container fluid>
    <v-card
      class="d-flex justify-space-around align-start elevation-0"
      width="100%"
    >
      <CardProfile />
      <CardCompany />
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import CardProfile from "./components/CardProfile.vue";
import CardCompany from "./components/CardCompany.vue";

@Component({
  components: {
    CardProfile,
    CardCompany
  }
})
export default class Profile extends Vue {}
</script>
