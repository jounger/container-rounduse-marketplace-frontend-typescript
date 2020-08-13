<template>
  <v-card width="550" height="fit-content" class="mt-12">
    <v-toolbar color="primary" light flat>
      <v-toolbar-title
        ><span style="color: white">Đăng nhập</span></v-toolbar-title
      >
    </v-toolbar>
    <v-card-text>
      <v-form v-model="valid" validation>
        <v-text-field
          label="Tên đăng nhập"
          name="login"
          prepend-icon="mdi-account"
          type="text"
          autocomplete="username"
          v-model="username"
          :rules="[required('username')]"
        ></v-text-field>

        <v-text-field
          id="password"
          label="Mật khẩu"
          name="password"
          prepend-icon="mdi-key"
          type="password"
          autocomplete="current-password"
          v-model="password"
          :rules="[required('password'), minLength('password', 6)]"
        ></v-text-field>
        <v-row style="margin-left: -7px">
          <v-checkbox class="mx-2" label="Ghi nhớ đăng nhập"></v-checkbox>
          <v-spacer></v-spacer>
          <a
            style="margin-top: 20px;
    margin-right: 15px;"
            >Quên mật khẩu</a
          >
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn to="/register" outlined>Đăng ký</v-btn>
      <v-spacer></v-spacer>
      <v-btn @click.stop="login()" color="primary">Đăng nhập</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FormValidate from "@/mixin/form-validate";

@Component({
  mixins: [FormValidate]
})
export default class Login extends Vue {
  public username = "admin";
  public password = "123456";
  valid = true;

  public created() {
    if (this.$auth.check()) {
      setTimeout(() => {
        this.$router.push("/dashboard");
      }, 500);
    }
  }

  async login() {
    await this.$auth.login({
      username: this.username,
      password: this.password
    });
  }
}
</script>
