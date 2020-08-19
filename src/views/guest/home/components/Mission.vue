<template id="mission">
  <v-card>
    <v-img height="100%" width="100%" src="@/assets/images/mission.jpg">
      <span
        style="color: gold;
    font-size: 70px;
    float: right;
    margin-top: 400px;
    margin-right: 50px;
    font-weight: bold;
    font-family: revert;
    "
      >
        Sứ mệnh
      </span>
      <span
        style="color: gold;
    font-size: 30px;
    float: right;
    margin-top: 500px;
    margin-right: -290px;
    font-weight: bold;
    font-family: revert;
    "
      >
        Mang lại lợi ích từ những giá trị rỗng.
      </span>
      <v-btn
        style="
        margin-top: 800px;
    margin-right: -1800px;
    font: 400 16px Arial;
    height: 55px;
    width: 180px;
    background-color: chartreuse;
    "
        >Đăng nhập</v-btn
      >
    </v-img></v-card
  >
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Mission extends Vue {}
</script>
