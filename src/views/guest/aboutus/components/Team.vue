<template>
  <section class="team">
    <v-row justify="center">
      <h1>ĐỘI NGŨ CỦA CHÚNG TÔI</h1>
    </v-row>
    <v-row justify="center" class="ml-12">
      <div v-for="item in team" :key="item.name">
        <v-col class="person">
          <v-avatar class="profile" color="grey" size="150">
            <v-img :src="getPic(item.pic)" alt="pic" height="150" width="90" />
          </v-avatar>
          <h1>{{ item.name }}</h1>
          <h4>{{ item.role }}</h4></v-col
        >
      </div>
    </v-row>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Team extends Vue {
  team = [
    { pic: "an", name: "Nguyễn Văn An", role: "Quản lý dự án" },
    { pic: "duy", name: "Đào Lương Duy", role: "Lập trình viên Frontend" },
    { pic: "quyen", name: "Nguyễn Văn Quyền", role: "Lập trình viên Backend" },
    {
      pic: "minh",
      name: "Khổng Quang Minh",
      role: "Lập trình viên Backend"
    },
    { pic: "duong", name: "Nguyễn Đức Dương", role: "Lập trình viên Android" }
  ];
  getPic(item: string) {
    return require("@/assets/images/" + item + ".jpg");
  }
}
</script>
<style scoped lang="css">
.team {
  background-color: #f4f4f4;
  height: 400px !important;
}
.team h1 {
  font-weight: 400 !important;
  color: #037243;
  margin-top: 30px;
}
.team h4 {
  font-weight: 300 !important;
  font-size: 15px;
}
.person {
  width: 250px !important;
}
</style>
