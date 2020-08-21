<template>
  <div>
    <GuestHeader />
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
  name: "DefaultLayout",
  components: {
    GuestHeader,
    GuestFooter
  }
})
export default class DefaultLayout extends Vue {
  created() {
    this.$vuetify.theme.dark = false;
  }
}
</script>
<style lang="css">
.v-application--wrap {
  background-color: #fff;
}
</style>
