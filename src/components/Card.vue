<template>
  <v-card v-if="profileSync" max-width="375" class="mx-auto">
    <v-img
      src="https://cdn.vuetifyjs.com/images/lists/ali.png"
      height="300px"
      dark
    >
      <v-row class="fill-height">
        <v-card-title>
          <v-btn dark icon @click="back">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>

          <v-spacer></v-spacer>

          <v-btn dark icon class="mr-4" @click="edit">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn dark icon @click="moreOption">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
          <v-list dense nav v-if="more">
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>Delete</v-list-item-title>
              </v-list-item-content>
              <v-divider></v-divider>
              <v-list-item-content v-if="checked">
                <v-list-item-title>Change Password</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-title>

        <v-spacer></v-spacer>

        <v-card-title class="white--text pl-12 pt-12">
          <div class="display-1 pl-12 pt-12" v-if="checkEdit">
            <v-text-field
              type="text"
              v-model="name"
              style="background-color: yellow;"
            ></v-text-field>
          </div>
          <div class="display-1 pl-12 pt-12" v-if="!checkEdit">
            {{ profileSync.fullname }}
          </div>
        </v-card-title>
      </v-row>
    </v-img>

    <v-list two-line>
      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">mdi-phone</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>(650) 555-1234</v-list-item-title>
          <v-list-item-subtitle>Mobile</v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-icon>
          <v-icon>mdi-message-text</v-icon>
        </v-list-item-icon>
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">mdi-email</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title v-if="!checkEdit">{{
            profileSync.email
          }}</v-list-item-title>
          <v-text-field
            v-if="checkEdit"
            type="text"
            v-model="email"
            style="background-color: yellow;"
          ></v-text-field>
          <v-list-item-subtitle>Personal</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider inset></v-divider>

      <v-list-item>
        <v-list-item-icon>
          <v-icon color="indigo">mdi-map-marker</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>1400 Main Street</v-list-item-title>
          <v-list-item-subtitle>Orlando, FL 79938</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <div style="float:right;">
      <v-btn v-if="checkEdit" @click="doneEdit" class="primary">OK</v-btn>
      <v-btn v-if="checkEdit" @click="cancelEdit">Cancel</v-btn>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import { UserEntity } from "../store/definitions/user";
@Component
export default class Card extends Vue {
  @PropSync("profile", { type: Object }) profileSync!: UserEntity;
  checkEdit = false;
  name = "";
  email = "";
  more = false;
  checked = false;
  async created() {
    if (this.$store.getters.getFrom == 0) {
      this.checked = true;
    }
  }
  public back(): void {
    if (this.$store.getters.getFrom == 1) {
      this.$router.push("/user");
      this.$store.dispatch("setFrom", 0);
    } else {
      this.$router.push("/home");
    }
  }
  public edit(): void {
    this.checkEdit = !this.checkEdit;
    this.name = this.profileSync.fullname;
    this.email = this.profileSync.email;
    console.log(this.name);
  }
  public cancelEdit(): void {
    this.checkEdit = false;
  }
  public doneEdit(): void {
    this.profileSync.fullname = this.name;
    this.profileSync.email = this.email;
    this.checkEdit = false;
  }
  public moreOption(): void {
    this.more = !this.more;
  }
}
</script>
<style>
.multi-line {
  white-space: pre-line;
}
</style>
