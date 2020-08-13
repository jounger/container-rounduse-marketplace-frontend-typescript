<template>
  <v-card width="550" height="fit-content" class="mt-12">
    <v-toolbar color="primary" light flat>
      <v-toolbar-title
        ><span style="color: white">Đặt lại mật khẩu</span></v-toolbar-title
      >
    </v-toolbar>
    <v-card-text>
      <v-form v-model="valid" validation>
        <v-text-field
          class="d-none"
          label="Tên đăng nhập"
          name="username"
          prepend-icon="mdi-account"
          type="text"
          autocomplete="username"
          v-model="username"
        ></v-text-field>
        <v-text-field
          id="new-password"
          label="Mật khẩu mới"
          name="new-password"
          prepend-icon="mdi-key"
          type="password"
          autocomplete="new-password"
          v-model="newPassword"
          :rules="[required('password'), minLength('password', 6)]"
        ></v-text-field>
        <v-text-field
          id="re-password"
          label="Nhập lại Mật khẩu"
          name="re-password"
          prepend-icon="mdi-key"
          type="password"
          autocomplete="new-password"
          v-model="reNewPassword"
          :rules="[
            required('password'),
            minLength('password', 6),
            equals('re-password', 'password', newPassword)
          ]"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn text small to="/">Trang chủ</v-btn>
      <v-spacer></v-spacer>
      <v-btn @click.stop="changePassword()" color="primary">Thay đổi</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FormValidate from "@/mixin/form-validate";
import { changePassword } from "@/api/user";

@Component({
  mixins: [FormValidate]
})
export default class ResetPassword extends Vue {
  public username = "";
  public newPassword = "";
  public reNewPassword = "";
  valid = true;

  async changePassword() {
    // const _res = await changePasswordLink({
    //   newPassword: this.newPassword
    // });
    // if (_res.data) {
    //   this.$router.push("/login");
    // }
  }

  created() {
    this.username = this.$auth.user().username;
  }
}
</script>
