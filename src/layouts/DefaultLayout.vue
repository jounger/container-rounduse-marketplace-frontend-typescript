<template>
  <div>
    <Menubar />
    <slot />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Menubar from "@/components/Menubar.vue";

@Component({
  name: "DefaultLayout",
  components: {
    Menubar
  }
})
export default class DefaultLayout extends Vue {}
</script>
