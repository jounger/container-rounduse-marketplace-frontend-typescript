<template>
  <v-content>
    <v-container
      class="d-flex justify-space-around align-start"
      v-if="$auth.user()"
    >
      <CardProfile />
      <CardCompany />
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
  created() {
    console.log(this.$auth.user());
  }
}
</script>
