<template>
  <v-card class="elevation-12">
    <v-toolbar color="primary" light flat>
      <v-toolbar-title>Login form</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form>
        <v-text-field
          label="Login"
          name="login"
          prepend-icon="mdi-account"
          type="text"
          v-model="username"
        ></v-text-field>

        <v-text-field
          id="password"
          label="Password"
          name="password"
          prepend-icon="mdi-lock"
          type="password"
          v-model="password"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click.prevent="submit()" color="primary">Login</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import AuthLayout from "@/layouts/AuthLayout.vue";
@Component
export default class Login extends Vue {
  @PropSync("layout") layoutSync!: object;
  public username = "annv";
  public password = "123456";
  created() {
    this.layoutSync = AuthLayout;
  }
  public mounted() {
    if (this.$auth.check()) {
      this.$router.push({ name: "Home" });
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
