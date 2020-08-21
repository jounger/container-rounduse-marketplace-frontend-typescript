<template>
  <section style="height:250px">
    <v-container>
      <v-row justify="center" align="center" class="mt-2">
        <v-col cols="12" md="12">
          <h4 class="black--text subheading mx-auto my-3">
            Đồng hành cùng chúng tôi
          </h4>
          <v-row>
            <v-col cols="12" md="1" v-for="pic in shippingLines" :key="pic">
              <img width="70" :src="getPic(pic)" alt="pic" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ListShippingLine extends Vue {
  shippingLines = [
    "logos_rahmen01",
    "logos_rahmen02",
    "logos_rahmen03",
    "logos_rahmen04",
    "logos_rahmen05",
    "logos_rahmen06",
    "logos_rahmen07",
    "logos_rahmen09",
    "logos_rahmen10",
    "logos_rahmen11",
    "logos_rahmen12",
    "logos_rahmen13"
  ];
  getPic(item: string) {
    return require("@/assets/images/" + item + ".jpg");
  }
  scrollToTop() {
    window.scrollTo(0, 0);
  }
}
</script>
<style scoped lang="css">
.subheading {
  font-size: 20px !important;
  font-weight: 300;
  text-align: center;
}
section {
  background-color: #fff !important;
}
</style>
