<template>
  <section style="height:320px">
    <v-container>
      <v-row>
        <v-col cols="12" md="2"></v-col>
        <v-col cols="12" md="8">
          <h4 class="black--text display-1 ml-0 mb-5">
            Chờ đợi version 2.0. Version 2.0 có gì?
          </h4>
          <div class="line"></div>
          <h4 class="black--text subheading ml-0 ma-3">
            <p>- Giao tiếp trực tiếp qua CRuM.</p>
            <p>- Report người dùng.</p>
            <p>- Quản lý quy trình với Smart Contract.</p>
            <p>- Tự động sinh hợp đồng online.</p>
          </h4>
        </v-col>
        <v-col cols="12" md="2">
          <h1>2.0</h1>
          <h3 class="ml-2">Version</h3>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class UpdateVersion extends Vue {}
</script>
<style scoped lang="css">
section {
  background-color: #ffe6ba !important;
}
.subheading {
  font-size: 22px !important;
  font-weight: 300;
}
.line {
  content: "";
  width: 30%;
  height: 4px;
  background: #eea632;
  display: block;
}
a {
  color: #037243;
  text-decoration: none !important;
}
a:hover {
  font-weight: bold;
}
.version {
  color: red;
}
h1 {
  font-size: 45px !important;
  color: red;
  font-family: cursive;
}
</style>
