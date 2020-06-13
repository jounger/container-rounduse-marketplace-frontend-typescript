<template>
  <v-container fixed-header style="width: 800px; margin-top:100px;">
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-form>
      <v-layout row>
        <v-flex xs6>
          <v-text-field
            label="Tên quyền"
            name="rolesname"
            prepend-icon="mdi-account"
            type="text"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6>
          <v-select
            :items="permission"
            attach
            chips
            label="Vai trò"
            multiple
          ></v-select>
        </v-flex>
      </v-layout>
      <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
    </v-form>
    <v-card-actions style="margin-top:310px;">
      <v-spacer></v-spacer>
      <v-btn @click="submit()" color="primary">Thêm mới</v-btn>
      <v-btn @click="cancel()">Trở về</v-btn>
    </v-card-actions>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
@Component
export default class Register extends Vue {
  @PropSync("layout") layoutSync!: object;
  private roles: string[] = [];
  public permission: string[] = ["Create", "Delete", "Edit"];
  items = [
    { text: "Quản lý người dùng", disabled: false, href: "/user" },
    {
      text: "Phân quyền",
      disabled: false,
      href: "/user",
    },
    {
      text: "Thêm mới",
      disabled: true,
      href: "/add-roles",
    }
  ];
  created() {
    this.layoutSync = NavLayout;
  }
  public submit(): void {
    console.log(1);
  }
  public cancel(): void {
    this.$router.push("/admin");
  }
}
</script>

<style></style>
