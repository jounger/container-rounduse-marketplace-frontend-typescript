<template>
  <v-dialog
    v-model="dialog"
    width="500"
    height="320"
    transition="scale-transition"
  >
    <v-card width="500" height="320" class="card">
      <v-card-title>
        Đăng nhập
      </v-card-title>
      <v-divider light></v-divider>
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
        <router-link to="/forgot-password">Quên mật khẩu</router-link>
        <v-btn
          class="login"
          @click.stop="login()"
          color="success"
          :disabled="!valid"
          >Đăng nhập</v-btn
        >
      </v-card-actions>
      <span class="register">
        <router-link to="/register">Đăng ký</router-link></span
      >
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import FormValidate from "@/mixin/form-validate";

@Component({
  mixins: [FormValidate]
})
export default class Login extends Vue {
  @PropSync("dialogLogin", { type: Boolean }) dialog!: boolean;
  public username = "";
  public password = "";
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
<style scoped lang="css">
.login {
  margin-right: 10px;
}
.login:hover {
  width: 110px;
  height: 36px;
}
.title {
  color: #037243;
  margin-left: 10px;
}
.card {
  border-radius: 10px;
}
.card a {
  color: #037243;
  text-decoration: none;
  margin-left: 10px !important;
}
.card a:hover {
  font-weight: bold;
  font-size: 17px;
}
.card .register {
  margin-left: 43%;
}
</style>
