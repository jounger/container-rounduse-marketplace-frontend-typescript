<template
  ><v-container class="fill-height; card" fluid>
    <Introduction />
    <ListShippingLine />
    <ManageContainer />
    <FindContainer />
    <Bidding />
    <Automate />
    <Feedback />
    <Register />
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Introduction from "./components/Introduction.vue";
import ListShippingLine from "./components/ListShippingLine.vue";
import ManageContainer from "./components/ManageContainer.vue";
import FindContainer from "./components/FindContainer.vue";
import Bidding from "./components/Bidding.vue";
import Automate from "./components/Automate.vue";
import Feedback from "./components/Feedback.vue";
import Register from "./components/Register.vue";

@Component({
  components: {
    Introduction,
    ListShippingLine,
    ManageContainer,
    FindContainer,
    Bidding,
    Automate,
    Feedback,
    Register
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
