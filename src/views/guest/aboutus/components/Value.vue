<template>
  <section class="value">
    <v-row justify="center">
      <h1>GIÁ TRỊ</h1>
    </v-row>
    <v-row>
      <v-col cols="12" md="2"> </v-col
      ><v-col cols="12" md="4">
        <v-card flat>
          <v-row>
            <v-col cols="12" md="1"></v-col>
            <v-col cols="12" md="2">
              <v-avatar color="blue" size="62"
                ><v-icon dark>attach_money</v-icon></v-avatar
              >
            </v-col>
            <v-col cols="12" md="8">
              <h2>Tiền bạc</h2>
              <p>
                Tối ưu quy trình vận chuyển Container rỗng mang lại giá trị lợi
                ích về tiền bạc.
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="4"
        ><v-card flat>
          <v-row>
            <v-col cols="12" md="1"></v-col>
            <v-col cols="12" md="2">
              <v-avatar color="primary" size="62"
                ><v-icon dark>av_timer</v-icon></v-avatar
              >
            </v-col>
            <v-col cols="12" md="8">
              <h2>Thời gian</h2>
              <p>
                Tận dụng Container rỗng tiết kiệm thời gian cho đơn hàng và các
                chuyến đi.
              </p>
            </v-col>
          </v-row>
        </v-card></v-col
      >
    </v-row>
    <v-row>
      <v-col cols="12" md="2"> </v-col
      ><v-col cols="12" md="4">
        <v-card flat>
          <v-row>
            <v-col cols="12" md="1"></v-col>
            <v-col cols="12" md="2">
              <v-avatar color="green" size="62"
                ><v-icon dark>wifi_tethering</v-icon></v-avatar
              >
            </v-col>
            <v-col cols="12" md="8">
              <h2>Kết nối</h2>
              <p>
                Một cộng đồng Logistic lớn mạnh, hợp tác giúp đỡ cùng phát
                triển.
              </p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="4"
        ><v-card flat>
          <v-row>
            <v-col cols="12" md="1"></v-col>
            <v-col cols="12" md="2">
              <v-avatar color="error" size="62"
                ><v-icon dark>people_alt</v-icon></v-avatar
              >
            </v-col>
            <v-col cols="12" md="8">
              <h2>Sự hài lòng của người dùng</h2>
              <p>
                Một người bạn đồng hành đáng tin cậy, nơi cung cấp giải pháp
                Logistics cho các đơn vị và giúp mỗi người dùng đạt được mục
                tiêu của riêng mình.
              </p>
            </v-col>
          </v-row>
        </v-card></v-col
      >
    </v-row>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Value extends Vue {}
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
