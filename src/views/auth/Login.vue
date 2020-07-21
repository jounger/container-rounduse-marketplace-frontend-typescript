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
          autocomplete="username"
          v-model="username"
        ></v-text-field>

        <v-text-field
          id="password"
          label="Mật khẩu"
          name="password"
          prepend-icon="mdi-key"
          type="password"
          autocomplete="current-password"
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
import { Component, Vue } from "vue-property-decorator";
import snackbar from "@/store/modules/snackbar";
import { getErrorMessage } from "@/utils/tool";
@Component
export default class Login extends Vue {
  public username = "admin";
  public password = "123456";
  public created() {
    if (this.$auth.check()) {
      setTimeout(() => {
        this.$router.push("/dashboard");
      }, 500);
    }
  }
  public register() {
    this.$router.push("/register");
  }
  async login() {
    await this.$auth
      .login({
        username: this.username,
        password: this.password
      })
      .then(res => {
        console.warn("SUCCESS login", res);
        snackbar.setSnackbar({
          text: "Xin chào, " + this.username,
          color: "success"
        });
      })
      .catch(err => {
        snackbar.setSnackbar({
          text: getErrorMessage(err),
          color: "error"
        });
      });
    snackbar.setDisplay(true);
  }
}
</script>

<style>
.mdi-key {
  transform: rotate(45deg);
}
</style>
