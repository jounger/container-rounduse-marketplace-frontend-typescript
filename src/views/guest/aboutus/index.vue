<template
  ><v-container class="fill-height; card" fluid>
    <Aboutus />
    <Value />
    <Story />
    <Team />
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Aboutus from "./components/Aboutus.vue";
import Value from "./components/Value.vue";
import Story from "./components/Story.vue";
import Team from "./components/Team.vue";

@Component({
  components: {
    Aboutus,
    Value,
    Story,
    Team
  }
})
export default class HomePage extends Vue {}
</script>
<style scoped lang="css">
.card {
  padding: 0 !important;
  margin: 0 !important;
}
</style>
