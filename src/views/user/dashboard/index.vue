<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row style="margin-left: 30px;">
        <v-card class="d-flex flex-row mb-6" color="lighten-2" flat tile>
          <v-card
            v-for="n in items"
            :key="n.name"
            class="pa-2"
            outlined
            tile
            style="margin-left: 50px; width: 250px;"
          >
            <v-card-title class="title">{{ n.name }}</v-card-title>
            <v-list-item two-line :class="'px-0'">
              <v-btn icon>
                <v-icon>{{ n.icon }}</v-icon>
              </v-btn>

              <v-list-item-content style="margin-left: 40px;">
                <v-list-item-title class="title" style="margin-left: 5px;">{{
                  n.content
                }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-card>
        <v-card
          class="d-flex flex-row mb-6"
          color="lighten-2"
          flat
          tile
          style="margin-left:200px;"
        >
          <v-card class="pa-2" outlined tile style="margin-left: 10px;">
            <v-card-title>Tóm tắt tháng 12</v-card-title>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  ><v-btn icon> <v-icon>mdi-domain</v-icon> </v-btn>Tổng số vỏ
                  rỗng: 1433</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  ><v-btn icon> <v-icon>mdi-dialpad</v-icon> </v-btn>Tổng số
                  hàng cần vỏ: 2536</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  ><v-btn icon> <v-icon>mdi-call-split</v-icon> </v-btn>Tổng số
                  yêu cầu ghép: 1102</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  ><v-btn icon>
                    <v-icon>mdi-arrow-up-bold-box-outline</v-icon> </v-btn
                  >Tỉ lệ ghép hàng thành công: 86%</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title
                  ><v-btn icon>
                    <v-icon>mdi-arrow-up-bold-box-outline</v-icon> </v-btn
                  >Tổng số thành viên mới: 3</v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </v-card>
          <v-card
            class="pa-2"
            outlined
            tile
            style="margin-left: 30px; width: 400px;"
            @click="showSnackbar()"
          >
            <v-card-title>Hoạt động mới nhất</v-card-title>
            <v-list-item v-for="n in actions" :key="n.user">
              <v-list-item-content>
                <v-list-item-title
                  ><v-avatar color="indigo">
                    <v-icon dark>mdi-account-circle</v-icon> </v-avatar
                  >{{ n.user }} vừa {{ n.action }}</v-list-item-title
                >
                <v-list-item-subtitle
                  style="margin-left: 50px;
    margin-top: -10px;"
                >
                  {{ n.time }} trước
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-card>
        </v-card>
      </v-row>
    </v-container>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import snackbar from "@/store/modules/snackbar";

@Component
export default class Dashboard extends Vue {
  showSnackbar() {
    console.log("shit");
    snackbar.setDisplay(true);
  }
  private users = [];
  items = [
    {
      name: "Vỏ rỗng mới",
      content: "53",
      icon: "mdi-domain"
    },
    {
      name: "Hàng cần vỏ mới",
      content: "75",
      icon: "mdi-dialpad"
    },
    {
      name: "Đang đợi ghép",
      content: "18",
      icon: "mdi-call-split"
    },
    {
      name: "Ghép thành công",
      content: "6",
      icon: "mdi-arrow-up-bold-box-outline"
    }
  ];
  actions = [
    {
      user: "Hoang Hai",
      action: "thêm mới một hàng",
      time: "2h"
    },
    {
      user: "Vinatake",
      action: "tạo một yêu cầu ghép",
      time: "5h"
    },
    {
      user: "ICSA",
      action: "tạo một vỏ rỗng",
      time: "5h30p"
    },
    {
      user: "SEA2",
      action: "hủy một yêu cầu ghép",
      time: "6h"
    }
  ];
}
</script>
