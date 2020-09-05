<template>
  <v-main>
    <router-view></router-view>
  </v-main>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "AuthLayout"
})
export default class AuthLayout extends Vue {}
</script>
<style lang="css">
.background-img {
  background: linear-gradient(#7c7979cc, rgba(57, 57, 57, 0.8)),
    url("../assets/images/login-bg.jpg");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  height: 100%;
}
</style>
