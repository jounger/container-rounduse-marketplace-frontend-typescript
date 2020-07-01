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
import { Component, Vue } from "vue-property-decorator";
import CardProfile from "./components/CardProfile.vue";
import { IUser } from "@/entity/user";
import { getProfile } from "@/api/user";

@Component({
  components: {
    CardProfile
  }
})
export default class Profile extends Vue {
  public profile: IUser | null = null;

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
