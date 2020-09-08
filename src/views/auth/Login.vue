<template>
  <v-container fluid class="background-img">
    <v-card width="500" height="350" class="card mt-14 mx-auto">
      <v-card-title>
        <v-row>
          <v-col cols="12" md="3"></v-col>
          <router-link to="/"
            ><v-toolbar-title
              ><span class="title">CRuM</span></v-toolbar-title
            ></router-link
          ><v-divider vertical class="mx-2"></v-divider>
          <span class="btn-login">Đăng nhập</span></v-row
        >
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
        <router-link to="/forgot-password" class="link"
          >Quên mật khẩu</router-link
        >
        <v-btn class="login" @click.stop="login()" :disabled="!valid"
          >Đăng nhập</v-btn
        >
      </v-card-actions>
      <v-row justify="center"
        ><router-link to="/register" class="link">Đăng ký</router-link></v-row
      >
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FormValidate from "@/mixin/form-validate";

@Component({
  mixins: [FormValidate]
})
export default class Login extends Vue {
  public username = "";
  public password = "";
  valid = true;

  public created() {
    if (this.$auth.user()) {
      setTimeout(() => {
        this.$router.push("/");
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
  color: white;
  background-color: #037243 !important;
}
.login:hover {
  width: 110px;
  height: 36px;
}
.title {
  color: #037243;
  font-size: 40px !important;
}
.card {
  border-radius: 10px;
}
.card a {
  margin-left: 10px !important;
}
.card a:hover {
  font-size: 17px;
}
.btn-login {
  color: black;
  font-weight: 200 !important;
}
</style>
