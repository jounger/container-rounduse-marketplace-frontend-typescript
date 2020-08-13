<template>
  <v-card width="550" height="fit-content" class="mt-12">
    <v-toolbar color="primary" light flat>
      <v-toolbar-title
        ><span style="color: white">Quên mật khẩu</span></v-toolbar-title
      >
    </v-toolbar>
    <v-card-text>
      <v-form v-model="valid" validation>
        <v-text-field
          label="Địa chỉ email"
          name="email"
          prepend-icon="mdi-email"
          type="text"
          v-model="emailAddress"
          :rules="[required('email'), email('email')]"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn text small to="/login">Đã nhớ mật khẩu?</v-btn>
      <v-spacer></v-spacer>
      <v-btn @click.stop="forgotPassword()" color="primary"
        >Gửi vào email</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FormValidate from "@/mixin/form-validate";

@Component({
  mixins: [FormValidate]
})
export default class ForgotPassword extends Vue {
  public emailAddress = "";
  valid = true;

  async forgotPassword() {
    // const _res = await forgotPassword({
    //   email: this.email
    // });
    // if (_res.data) {
    //   this.$router.push("/login");
    // }
  }
}
</script>
