<template>
  <v-card>
    <v-row justify="center">
      <Login v-if="dialogLogin" :dialogLogin.sync="dialogLogin" /> </v-row
    ><v-img height="100%" width="100%" src="@/assets/images/aboutus.jpg">
      <span
        style="color: gold;
    font-size: 50px;
    float: left;
    margin-top: 30px;
    margin-left: 20px;
    font-weight: bold;
    font-family: revert;
    "
      >
        Đội ngũ Lập trình viên
      </span>
    </v-img></v-card
  >
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Login from "./Login.vue";

@Component({
  components: {
    Login
  }
})
export default class Aboutus extends Vue {
  dialogLogin = false;
}
</script>
