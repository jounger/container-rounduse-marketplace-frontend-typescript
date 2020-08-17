<template>
  <v-container>
    <v-layout wrap>
      <v-flex sm12 md6 offset-md3>
        <v-card width="550" height="fit-content" class="mt-12 ma-2 mx-auto">
          <v-toolbar color="primary" light flat>
            <v-toolbar-title class="white--text">Đăng nhập </v-toolbar-title
            ><v-spacer></v-spacer>
            <p class="caption ma-3">
              <router-link to="/" class="white--text"
                >Quay lại trang chủ</router-link
              >
            </p>
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
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-space-between">
            <v-btn text to="/forgot-password">Quên mật khẩu</v-btn>
            <v-btn @click.stop="login()" color="primary">Đăng nhập</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex sm12 md6 offset-md3>
        <v-layout align-center justify-space-between> </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
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
    if (this.$auth.user()) {
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
