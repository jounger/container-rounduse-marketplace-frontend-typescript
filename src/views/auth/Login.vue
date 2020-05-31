<template>
  <div class="demo">
    <h1>Plugin Demo</h1>
    <v-form @submit.prevent="submit">
      <p>
        <v-text-field label="Login" v-model="username"></v-text-field>
      </p>
      <p>
        <v-text-field
          label="Password"
          type="password"
          v-model="password"
        ></v-text-field>
      </p>
      <p>
        <v-btn type="submit">Login</v-btn>
      </p>
    </v-form>
    <router-link :to="{ name: 'user' }">Go to private section</router-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Login extends Vue {
  public username = "annv";
  public password = "123456";
  public mounted() {
    if (this.$auth.check()) {
      this.$router.push({ name: "Admin" });
    }
  }
  public submit() {
    this.$auth
      .login({
        username: this.username,
        password: this.password
      })
      .then(response => {
        console.warn("SUCCESS login", response);
      })
      .catch(err => {
        console.error("ERROR! in login", err);
      });
  }
}
</script>

<style></style>
