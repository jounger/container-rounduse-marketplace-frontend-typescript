<template>
  <v-container fixed-header style="width: 800px; margin-top:100px;">
    <v-breadcrumbs :items="items">
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-form>
      <v-layout col>
        <v-layout row>
          <v-flex xs8>
            <v-text-field
              label="Tên đăng nhập"
              name="username"
              prepend-icon="mdi-account"
              type="text"
              v-model="username"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs8>
            <v-text-field
              label="Tên hãng tàu"
              name="shippingLineName"
              prepend-icon="mdi-lock"
              type="text"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-layout>
      <v-layout col>
        <v-layout row>
          <v-flex xs8>
            <v-text-field
              label="Mật khẩu"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
              v-model="password"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs8>
            <v-text-field
              label="Mã tên"
              name="namecode"
              prepend-icon="mdi-lock"
              type="text"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-layout>
      <v-layout col>
        <v-layout row>
          <v-flex xs8>
            <v-text-field
              label="Email"
              name="email"
              prepend-icon="mdi-lock"
              type="email"
              v-model="email"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs8>
            <v-text-field
              label="Website"
              name="website"
              prepend-icon="mdi-lock"
              type="text"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-layout>
      <v-layout col>
        <v-layout row>
          <v-flex xs8>
            <v-text-field
              label="Số điện thoại"
              name="phone"
              prepend-icon="mdi-lock"
              type="phone"
            ></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs8>
            <v-select :items="icd" attach chips label="ICD"></v-select>
          </v-flex>
        </v-layout>
      </v-layout>
      <v-layout col>
        <v-layout row>
          <v-flex xs6>
            <v-text-field
              label="Địa chỉ"
              name="address"
              prepend-icon="mdi-lock"
              type="text"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-layout>
      <v-btn type="submit" class="d-none" id="submitForm"></v-btn>
    </v-form>
    <v-card-actions>
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
  private username = null;
  private password = null;
  private email = null;
  private fullname = null;
  private roles: string[] = [];
  public icd: string[] = ["Dry port", "Inland port", "Seaport"];
  items = [
    { text: "Quản lý người dùng", disabled: false, href: "/user" },
    {
      text: "Hãng tàu",
      disabled: false,
      href: "/user",
    },
    {
      text: "Thêm mới",
      disabled: true,
      href: "/add-shipping-line",
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
