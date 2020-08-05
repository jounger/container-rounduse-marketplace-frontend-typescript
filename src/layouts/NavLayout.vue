<template>
  <div>
    <Navigation :drawer="drawer" />
    <Appbar :drawer.sync="drawer" />
    <slot />
    <div style="margin-top:30px;">
      <Footer />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Navigation from "@/components/Navigation.vue";
import Appbar from "@/components/Appbar.vue";
import Footer from "@/components/Footer.vue";

@Component({
  name: "NavLayout",
  components: {
    Navigation,
    Appbar,
    Footer
  }
})
export default class NavLayout extends Vue {
  public drawer = true;
  created() {
    this.$vuetify.theme.dark = false;
  }
}
</script>
