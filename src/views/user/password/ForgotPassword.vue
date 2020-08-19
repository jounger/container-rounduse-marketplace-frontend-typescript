<template>
  <v-container fluid>
    <v-card width="550" height="fit-content" class="mt-12 mx-auto">
      <v-toolbar color="primary" light flat>
        <v-toolbar-title
          ><span style="color: white">Quên mật khẩu</span></v-toolbar-title
        >
      </v-toolbar>
      <v-card-text v-if="message">
        {{ message }}
      </v-card-text>
      <v-card-text v-if="!message">
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
      <v-card-actions class="justify-space-between">
        <v-btn text small to="/login">Đã nhớ mật khẩu?</v-btn>
        <v-btn @click.stop="forgotPassword()" color="primary" v-if="!message"
          >Gửi vào email</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import FormValidate from "@/mixin/form-validate";
import { forgotPassword } from "@/api/user";

@Component({
  mixins: [FormValidate]
})
export default class ForgotPassword extends Vue {
  emailAddress = "";
  message = "";
  valid = true;

  async forgotPassword() {
    const _res = await forgotPassword({
      email: this.emailAddress
    });
    if (_res.data) {
      this.message = _res.data.message;
    }
  }
}
</script>
