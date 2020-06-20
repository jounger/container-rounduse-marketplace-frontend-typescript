<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <Card :profile.sync="profile" />
        <!-- <h1>USER SECTION</h1> -->
      </v-row>
    </v-container>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import Card from "@/components/Card.vue";
import UserModule from "@/store/modules/user";
import { UserEntity } from "@/store/definitions/user";

@Component({
  components: {
    Card
  }
})
export default class User extends Vue {
  @PropSync("layout") layoutSync!: object;
  public profile: UserEntity | null = null;
  created() {
    this.layoutSync = NavLayout;
  }
  async mounted() {
    await UserModule.loadProfile();
    this.profile = UserModule.getCurrentUser;
  }
}
</script>
