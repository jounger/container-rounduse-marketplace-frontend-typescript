<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <CardProfile :profile.sync="profile" />
      </v-row>
    </v-container>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import CardProfile from "./components/CardProfile.vue";
import { IUser } from "@/entity/user";
import { getProfile } from "@/api/user";

@Component({
  components: {
    CardProfile
  }
})
export default class Profile extends Vue {
  @PropSync("layout") layoutSync!: object;
  public profile: IUser | null = null;
  created() {
    this.layoutSync = NavLayout;
  }
  async mounted() {
    getProfile()
      .then(res => {
        const response: IUser = res.data;
        this.profile = response;
      })
      .catch(err => console.log(err));
  }
}
</script>
