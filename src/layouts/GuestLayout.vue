<template>
  <div>
    <GuestHeader :drawer.sync="drawer" />
    <slot />
    <div style="margin-top:30px;">
      <GuestFooter />
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GuestHeader from "@/components/GuestHeader.vue";
import GuestFooter from "@/components/GuestFooter.vue";

@Component({
  name: "GuestLayout",
  components: {
    GuestHeader,
    GuestFooter
  }
})
export default class GuestLayout extends Vue {
  public drawer = true;
  created() {
    this.$vuetify.theme.dark = false;
  }
}
</script>
