<template>
  <section style="height:600px">
    <v-container>
      <v-row justify="center" align="center" class="mt-15">
        <v-col cols="12" md="4">
          <h1 class="black--text display-1 ml-0 mb-5 title">
            Quản lý tập trung - dễ dàng
          </h1>
          <div class="line"></div>
          <h4 class="black--text subheading ml-0 ma-3">
            Khai báo container rỗng theo hàng nhập giúp việc quản lý tập trung,
            việc chọn lựa đấu thầu với nhóm container chưa bao giờ dễ đến thế!
          </h4>
          <v-btn color="primary" to="/register" large>
            Tìm hiểu thêm
          </v-btn>
        </v-col>
        <v-col cols="12" md="8">
          <v-img src="@/assets/images/managecont2.jpg"></v-img>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ManageContainer extends Vue {}
</script>
<style scoped lang="css">
section {
  background-color: rgba(221, 221, 221, 0.2) !important;
}
.title {
  font-size: 35px !important;
  font-weight: 300;
}
.subheading {
  font-size: 20px !important;
  font-weight: 300;
}
</style>
