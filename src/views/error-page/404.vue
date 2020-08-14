<template>
  <v-container
    class="text-center"
    fill-height
    style="height: calc(100vh - 58px);"
  >
    <v-row align="center">
      <v-col>
        <h1 class="display-2 primary--text">Whoops, 404</h1>

        <p>Trang bạn tìm kiếm hiện không có sẵn.</p>

        <v-btn to="/" color="primary" outlined>
          Quay lại trang chủ
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Page404 extends Vue {}
</script>
