<template>
  <div>
    <v-main>
      <router-view></router-view>
    </v-main>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "AuthLayout"
})
export default class AuthLayout extends Vue {}
</script>
