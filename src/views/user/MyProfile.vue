<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <Card :info.sync="info" />
        <!-- <h1>USER SECTION</h1> -->
      </v-row>
    </v-container>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import Card from "@/components/Card.vue";
import { AuthUser } from "@d0whc3r/vue-auth-plugin";
@Component({
  components: {
    Card
  }
})
export default class User extends Vue {
  @PropSync("layout") layoutSync!: object;
  public info: AuthUser = {};
  created() {
    this.layoutSync = NavLayout;
  }
  beforeMount() {
    this.info = this.$auth.user();
  }
}
</script>
