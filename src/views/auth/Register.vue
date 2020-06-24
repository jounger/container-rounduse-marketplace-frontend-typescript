<template>
  <v-card class="elevation-12">
    <v-toolbar color="primary" light flat>
      <v-toolbar-title style="color: white;">Sign up form</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form>
        <v-container>
          <v-row>
            <v-text-field
              label="Tên đăng nhập"
              name="username"
              prepend-icon="mdi-account"
              type="text"
              v-model="username"
            ></v-text-field>

            <v-text-field
              label="Mật khẩu"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
              v-model="password"
            ></v-text-field>

            <v-text-field
              label="Email"
              name="email"
              prepend-icon="mdi-lock"
              type="email"
              v-model="email"
            ></v-text-field>

            <v-text-field
              label="Số điện thoại"
              name="phone"
              prepend-icon="mdi-lock"
              type="text"
              v-model="phone"
            ></v-text-field>

            <v-select
              v-model="roles"
              :items="role"
              attach
              chips
              label="Chọn quyền"
              multiple
            ></v-select>
            <v-text-field
              label="Quốc tịch"
              name="country"
              prepend-icon="mdi-lock"
              type="text"
              v-model="country"
            ></v-text-field>
            <v-text-field
              label="Tỉnh/ Thành phố"
              name="city"
              prepend-icon="mdi-lock"
              type="text"
              v-model="city"
            ></v-text-field>
            <v-text-field
              label="Postal Code"
              name="code"
              prepend-icon="mdi-lock"
              type="text"
              v-model="code"
            ></v-text-field>
            <v-text-field
              label="Địa chỉ chi tiết"
              name="address"
              prepend-icon="mdi-lock"
              type="text"
              v-model="address"
            ></v-text-field>
            <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
          </v-row>
        </v-container>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="submit()" color="primary">Sign up</v-btn>
      <v-btn @click="cancel()" color="primary">Login</v-btn>
    </v-card-actions>
    <Dialog :dialog.sync="dialog" />
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import AuthLayout from "@/layouts/AuthLayout.vue";
import Dialog from "@/components/Dialog.vue";
@Component({
  components: {
    Dialog
  }
})
export default class Register extends Vue {
  @PropSync("layout") layoutSync!: object;
  private username = null;
  private password = null;
  private email = null;
  private phone = null;
  private address = null;
  private city = null;
  private code = null;
  private country = null;
  private roles: string[] = [];
  public role = ["ROLE_FORWARDER", "merchant"];
  public dialog = false;

  created() {
    this.layoutSync = AuthLayout;
  }
  public submit() {
    this.$http({
      url: "/auth/signup",
      method: "POST",
      data: {
        username: this.username,
        password: this.password,
        email: this.email,
        phone: this.phone,
        roles: this.roles,
        address: {
          address: this.address,
          city: this.city,
          country: this.country,
          postalCode: this.code
        },
        status: 1
      }
    })
      .then(response => {
        console.warn("SUCCESS register", response);
        this.dialog = true;
      })
      .catch(err => {
        console.error("ERROR! in register", err);
      });
  }
  public cancel(): void {
    this.$router.push("/login");
  }
}
</script>

<style></style>
