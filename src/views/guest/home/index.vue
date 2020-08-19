<template>
  <v-content
    ><v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col class="text-center"> <Introduction /> </v-col
        ><v-col class="text-center"> <Mission /> </v-col></v-row
      ><v-row align="center" justify="center"
        ><v-col class="text-center"> <Aboutus /> </v-col
      ></v-row>
    </v-container>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Introduction from "./components/Introduction.vue";
import Mission from "./components/Mission.vue";
import Aboutus from "./components/Aboutus.vue";

@Component({
  components: {
    Introduction,
    Mission,
    Aboutus
  }
})
export default class HomePage extends Vue {}
</script>
