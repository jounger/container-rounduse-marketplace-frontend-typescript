<template>
  <div>
    <Navigation :drawer.sync="drawer" />
    <Appbar :drawer.sync="drawer" />
    <Snackbars />
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
import Snackbars from "../components/Snackbars.vue";

@Component({
  name: "NavLayout",
  components: {
    Navigation,
    Appbar,
    Footer,
    Snackbars
  }
})
export default class NavLayout extends Vue {
  public drawer = null;
  created() {
    this.$vuetify.theme.dark = false;
  }
}
</script>
