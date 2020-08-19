<template>
  <v-container fluid>
    <v-card width="550" height="fit-content" class="mt-12 mx-auto">
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span style="color: white">Đặt lại mật khẩu</span></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text>
        <v-form v-model="valid" validation>
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
      <v-card-actions class="justify-space-between">
        <v-btn text small to="/">Trang chủ</v-btn>
        <v-btn
          @click.stop="changePassword()"
          color="primary"
          :disabled="!valid || !getRouterHash"
          >Thay đổi</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FormValidate from "@/mixin/form-validate";
import { resetPassword } from "@/api/user";

@Component({
  mixins: [FormValidate]
})
export default class ResetPassword extends Vue {
  public newPassword = "";
  public reNewPassword = "";
  valid = true;

  async changePassword() {
    const _res = await resetPassword(this.getRouterHash, {
      newPassword: this.newPassword
    });
    if (_res.data) {
      setTimeout(() => {
        this.$router.push("/login");
      }, 2000);
    }
  }

  get getRouterHash() {
    const authHash = this.$route.params.hash;
    if (authHash) return authHash;
    return "";
  }
}
</script>
