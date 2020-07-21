<template>
  <div>
    <Snackbars />
    <Appbar />
    <slot />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Appbar from "@/components/Appbar.vue";
import Snackbars from "../components/Snackbars.vue";

@Component({
  name: "DefaultLayout",
  components: {
    Appbar,
    Snackbars
  }
})
export default class DefaultLayout extends Vue {}
</script>
