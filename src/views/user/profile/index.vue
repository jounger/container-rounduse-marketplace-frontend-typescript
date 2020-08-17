<template>
  <v-content>
    <v-container class="d-flex justify-space-around align-start">
      <CardProfile />
      <CardCompany v-if="isSupplier" />
    </v-container>
  </v-content>
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
      "ROLE_SHIPPINGLINE",
      "ROLE_DRIVER"
    ]);
  }
}
</script>
