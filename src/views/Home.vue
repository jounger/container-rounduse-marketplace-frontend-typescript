<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col class="text-center">
          <h1>Trang chủ</h1>
          <p v-if="$auth.user()">Bạn đã đăng nhập</p>
          <p v-else>Bạn chưa đăng nhập</p>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Home extends Vue {}
</script>
