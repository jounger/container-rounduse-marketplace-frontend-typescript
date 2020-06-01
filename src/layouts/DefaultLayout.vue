<template>
  <div>
    <Appbar />
    <slot />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Appbar from "@/components/Appbar.vue";
@Component({
  name: "DefaultLayout",
  components: {
    Appbar
  }
})
export default class DefaultLayout extends Vue {}
</script>
