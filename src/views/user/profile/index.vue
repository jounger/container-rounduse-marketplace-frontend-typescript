<template>
  <v-container fluid>
    <v-card class="d-flex justify-space-around align-start elevation-0" width="fit-content">
      <CardProfile />
      <CardCompany v-if="isSupplier" />
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
export default class Profile extends Vue {
  get isSupplier() {
    return this.$auth.check([
      "ROLE_FORWARDER",
      "ROLE_MERCHANT",
      "ROLE_SHIPPINGLINE"
    ]);
  }
}
</script>
