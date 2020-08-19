<template>
  <div>
    <GuestHeader :drawer.sync="drawer" />
    <v-main>
      <router-view></router-view>
    </v-main>
    <GuestFooter />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GuestHeader from "@/components/GuestHeader.vue";
import GuestFooter from "@/components/GuestFooter.vue";

@Component({
  name: "EmptyLayout",
  components: {
    GuestHeader,
    GuestFooter
  }
})
export default class EmptyLayout extends Vue {
  public drawer = true;
  created() {
    this.$vuetify.theme.dark = false;
  }
}
</script>
