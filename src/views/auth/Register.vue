<template>
  <v-card class="elevation-12">
    <v-toolbar color="primary" light flat>
      <v-toolbar-title>Sign up form</v-toolbar-title>
    </v-toolbar>
    <v-card-text>
      <v-form>
        <v-text-field
          label="Username"
          name="username"
          prepend-icon="mdi-account"
          type="text"
          v-model="username"
        ></v-text-field>

        <v-text-field
          label="Password"
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
          label="Fullname"
          name="fullname"
          prepend-icon="mdi-lock"
          type="text"
          v-model="fullname"
        ></v-text-field>

        <v-select
          v-model="roles"
          :items="enumRole"
          attach
          chips
          label="Roles"
          multiple
        ></v-select>
        <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="submit()" color="primary">Sign up</v-btn>
    </v-card-actions>
    <Dialog :dialog.sync="dialog" />
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import EmptyLayout from "@/layouts/EmptyLayout.vue";
import { EnumRole } from "@/common/EnumRole";
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
  private fullname = null;
  private roles: string[] = [];
  public enumRole: string[] = [];
  public dialog = false;

  created() {
    this.layoutSync = EmptyLayout;
  }
  public mounted() {
    Object.entries(EnumRole).forEach(([key, value]) => {
      if (key.toString().includes("ROLE_")) {
        this.enumRole.push(key.toString().split("_")[1]);
      }
    });
  }
  public submit() {
    this.$http({
      url: "/auth/signup",
      method: "POST",
      data: {
        username: this.username,
        password: this.password,
        email: this.email,
        fullname: this.fullname,
        roles: this.roles
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
}
</script>

<style></style>
