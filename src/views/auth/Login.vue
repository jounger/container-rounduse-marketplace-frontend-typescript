<template>
  <v-card class="elevation-12">
    <v-toolbar color="primary" light flat>
      <v-toolbar-title>Đăng nhập</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form>
        <v-text-field
          label="Tên đăng nhập"
          name="login"
          prepend-icon="mdi-account"
          type="text"
          v-model="username"
        ></v-text-field>

        <v-text-field
          id="password"
          label="Mật khẩu"
          name="password"
          prepend-icon="mdi-key"
          type="password"
          v-model="password"
        ></v-text-field>
        <v-checkbox class="mx-2" label="Ghi nhớ đăng nhập"></v-checkbox>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click.prevent="login()" color="primary">Đăng nhập</v-btn>
      <v-btn @click.prevent="register()" color="white">Đăng ký</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import AuthLayout from "@/layouts/AuthLayout.vue";
@Component
export default class Login extends Vue {
  @PropSync("layout") layoutSync!: object;
  public username = "admin";
  public password = "123456";
  created() {
    this.layoutSync = AuthLayout;
  }
  public mounted() {
    if (this.$auth.check()) {
      this.$router.push("/dashboard");
    }
  }
  public register() {
    this.$router.push("/register");
  }
  public login() {
    this.$auth
      .login({
        username: this.username,
        password: this.password
      })
      .then(res => {
        console.warn("SUCCESS login", res);
      })
      .catch(err => {
        console.error("ERROR! in login", err);
      });
  }
}
</script>

<style>
.mdi-key {
  transform: rotate(45deg);
}
</style>
