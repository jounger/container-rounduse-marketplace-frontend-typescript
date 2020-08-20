<template
  ><v-container class="fill-height; card" fluid>
    <Introduction />
    <ListShippingLine />
    <v-row align="center" justify="center"
      ><v-col class="text-center"> <Aboutus /> </v-col
    ></v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Introduction from "./components/Introduction.vue";
import ListShippingLine from "./components/ListShippingLine.vue";
import Aboutus from "./components/Aboutus.vue";

@Component({
  components: {
    Introduction,
    ListShippingLine,
    Aboutus
  }
})
export default class HomePage extends Vue {}
</script>
<style scoped lang="css">
.card {
  padding: 0 !important;
}
</style>
