<template>
  <div>
    <Introduction />
    <ManageContainer />
    <FindContainer />
    <Bidding />
    <Feedback />
    <ListShippingLine />
    <Register />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Introduction from "./components/Introduction.vue";
import ListShippingLine from "./components/ListShippingLine.vue";
import ManageContainer from "./components/ManageContainer.vue";
import FindContainer from "./components/FindContainer.vue";
import Bidding from "./components/Bidding.vue";
import Feedback from "./components/Feedback.vue";
import Register from "./components/Register.vue";

@Component({
  components: {
    Introduction,
    ListShippingLine,
    ManageContainer,
    FindContainer,
    Bidding,
    Feedback,
    Register
  }
})
export default class HomePage extends Vue {}
</script>
<style lang="css">
.line {
  content: "";
  width: 40%;
  height: 4px;
  background: #eea632;
  display: block;
}
.v-btn:hover {
  font-weight: bold;
}
</style>
