<template>
  <v-main>
    <router-view></router-view>
  </v-main>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  name: "EmptyLayout"
})
export default class EmptyLayout extends Vue {}
</script>
