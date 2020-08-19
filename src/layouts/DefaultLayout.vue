<template>
  <div>
    <Menubar />
    <v-main>
      <router-view></router-view>
    </v-main>
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
