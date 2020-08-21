<template>
  <section class="value">
    <v-row justify="center">
      <h1>ĐỘI NGŨ CỦA CHÚNG TÔI</h1>
    </v-row>
    <v-row justify="center">
      <div v-for="item in team" :key="item.name">
        <v-img :src="getPic(item.pic)" alt="pic"/>
      </div>
    </v-row>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Team extends Vue {
  team = [{ pic: "an", name: "Nguyễn Văn An" }];
  getPic(item: string) {
    return require("@/assets/images/" + item + ".jpg");
  }
}
</script>
<style scoped lang="css">
.value {
  background-color: rgba(0, 0, 0, 0);
  height: 400px !important;
}
.value h1 {
  font-weight: 400 !important;
  color: #037243;
  margin-top: 30px;
}
.value h2 {
  font-weight: 400 !important;
  font-size: 18px;
}
.value p {
  font-size: 14 px;
}
</style>
