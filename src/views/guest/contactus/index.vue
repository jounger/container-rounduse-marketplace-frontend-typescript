<template
  ><v-container class="fill-height; card" fluid>
    <Contactus />
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Contactus from "./components/Contactus.vue";

@Component({
  components: {
    Contactus
  }
})
export default class Contact extends Vue {}
</script>
<style scoped lang="css">
.card {
  padding: 0 !important;
  margin: 0 !important;
}
</style>
