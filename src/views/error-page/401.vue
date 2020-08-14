<template>
  <v-container
    class="text-center"
    fill-height
    style="height: calc(100vh - 58px);"
  >
    <v-row align="center">
      <v-col>
        <h1 class="display-2 primary--text">Whoops, 401</h1>

        <p>Bạn không có quyền truy cập vào tài nguyên này.</p>

        <v-btn to="/login" color="primary" outlined>
          Tới trang đăng nhập
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Page401 extends Vue {}
</script>
