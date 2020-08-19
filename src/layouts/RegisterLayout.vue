<template>
  <v-main>
    <router-view></router-view>
  </v-main>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component({
  name: "RegisterLayout"
})
export default class RegisterLayout extends Vue {}
</script>
