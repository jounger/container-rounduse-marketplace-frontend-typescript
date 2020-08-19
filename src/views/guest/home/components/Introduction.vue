<template>
  <v-card>
    <v-row justify="center">
      <Login v-if="dialogLogin" :dialogLogin.sync="dialogLogin" /> </v-row
    ><v-img
      height="100%"
      width="100%"
      src="@/assets/images/background-stock.jpg"
    >
      <span
        style="color: gold;
    font-size: 70px;
    float: left;
    margin-top: 250px;
    margin-left: 20px;
    font-weight: bold;
    font-family: fantasy;
    "
      >
        Container Round-use
      </span>
      <span
        style="color: gold;
    font-size: 70px;
    float: left;
    margin-top: 350px;
    margin-left: -320px;
    font-weight: bold;
    font-family: fantasy;
    "
      >
        Marketplace
      </span>
      <v-btn
        style="
        margin-top: 750px;
    margin-left: -715px;
    font-weight: bold;
    height: 55px;
    width: 180px;
    font-size: 25px;
    background-color: chartreuse;
    font: icon;
    "
        @click="dialogLogin = true"
        >Đăng nhập</v-btn
      >
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
export default class Introduction extends Vue {
  dialogLogin = false;
}
</script>
