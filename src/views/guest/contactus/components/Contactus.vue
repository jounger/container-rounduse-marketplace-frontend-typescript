<template>
  <section>
    <v-container>
      <v-row justify="center" align="center" class="mt-15">
        <h1 class="black--text display-1 ml-0 mb-5 title">
          Liên hệ ngay
        </h1>
      </v-row>
      <v-row justify="center" align="center"> <div class="line"></div></v-row>
      <v-row justify="center" align="center">
        <h4 class="black--text subheading ml-0 ma-3">
          Để nhận được tư vấn từ những tư vấn cần thiết cho nhu cầu của bạn.
        </h4></v-row
      >
      <v-row justify="center">
        <v-btn
          v-for="icon in socialNetworks"
          :key="icon.icon"
          :href="icon.to"
          target="_blank"
          class="icon mx-4"
          icon
        >
          <v-icon size="24px" :color="icon.color">{{ icon.icon }}</v-icon>
        </v-btn></v-row
      >
      <v-row justify="center">
        <v-list class="list-contact">
          <v-list-item
            v-for="item in contacts"
            :key="item.title"
            class="mx-4"
            icon
          >
            <v-list-item-icon>
              <v-icon :color="item.color">{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item></v-list
        ></v-row
      >
    </v-container>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Contactus extends Vue {
  socialNetworks = [
    { icon: "mdi-facebook", color: "blue", to: "https://facebook.com" },
    { icon: "mdi-twitter", color: "blue", to: "https://twitter.com/" },
    { icon: "mdi-linkedin", color: "blue", to: "https://www.linkedin.com/" },
    { icon: "mdi-instagram", color: "pink", to: "https://www.instagram.com/" }
  ];
  contacts = [
    {
      icon: "account_circle",
      color: "primary",
      title: "Nguyễn Văn An"
    },
    {
      icon: "call",
      color: "green",
      title: "096.739.0098"
    },
    {
      icon: "email",
      color: "blue",
      title: "support@containerrounduse.com"
    },
    {
      icon: "location_on",
      color: "red",
      title: "Thạch Hòa- Thạch Thất- Hà Nội"
    }
  ];
}
</script>
<style scoped lang="css">
section {
  background-color: #f4f4f4 !important;
  height: 700px;
}
.title {
  font-size: 35px !important;
  font-weight: 300;
  color: #037243 !important;
}
.subheading {
  font-size: 20px !important;
  font-weight: 300;
}
.list-contact {
  margin-top: 30px;
  width: 400px;
  background-color: #f4f4f4 !important;
}
.line {
  content: "";
  width: 15%;
  height: 4px;
  background: #eea632;
  display: block;
}
</style>
