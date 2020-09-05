<template>
  <section class="overview">
    <v-row>
      <h1 class="ml-10">Tổng quan hàng xuất trong tháng qua</h1>
    </v-row>
    <v-divider inset class="mt-5"></v-divider>
    <v-row>
      <v-col cols="12" md="6"
        ><v-row>
          <v-col cols="12" md="1"></v-col>
          <v-col cols="12" md="2">
            <v-avatar color="blue" size="36"
              ><v-icon dark>flight_takeoff</v-icon></v-avatar
            >
          </v-col>
          <v-col cols="12" md="8">
            <h2><router-link to="/outbound">Tổng số hàng xuất</router-link></h2>
            <p>{{ totalOutbound }} hàng xuất</p>
          </v-col></v-row
        ></v-col
      ><v-col cols="12" md="6"
        ><v-row>
          <v-col cols="12" md="1"></v-col>
          <v-col cols="12" md="2">
            <v-avatar color="success" size="36"
              ><v-icon dark>offline_pin</v-icon></v-avatar
            >
          </v-col>
          <v-col cols="12" md="8">
            <h2><router-link to="/combined">Số hàng đã giao</router-link></h2>
            <p>{{ delivered }} mặt hàng</p>
          </v-col></v-row
        ></v-col
      >
    </v-row>
    <v-row>
      <v-col cols="12" md="6"
        ><v-row>
          <v-col cols="12" md="1"></v-col>
          <v-col cols="12" md="2">
            <v-avatar color="deep-purple" size="36"
              ><v-icon dark>business_center</v-icon></v-avatar
            >
          </v-col>
          <v-col cols="12" md="8">
            <h2>
              <router-link to="/bidding-document"
                >Hàng đang đấu thầu</router-link
              >
            </h2>
            <p>{{ bidding }} mặt hàng</p>
          </v-col></v-row
        ></v-col
      ><v-col cols="12" md="6"
        ><v-row>
          <v-col cols="12" md="1"></v-col>
          <v-col cols="12" md="2">
            <v-avatar color="red" size="36"
              ><v-icon dark>table_chart</v-icon></v-avatar
            >
          </v-col>
          <v-col cols="12" md="8">
            <h2><router-link to="/combined">Hàng đã ghép</router-link></h2>
            <p>{{ combined }} mặt hàng</p>
          </v-col></v-row
        ></v-col
      >
    </v-row>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { overview } from "@/api/overview";
import { addTimeToDate } from "@/utils/tool";

@Component
export default class OverviewCard extends Vue {
  totalOutbound = 0;
  delivered = 0;
  bidding = 0;
  combined = 0;
  dateInit = addTimeToDate(new Date().toString());

  async created() {
    const year = this.dateInit.slice(0, 4);
    const month = this.dateInit.slice(5, 7);
    const startDate = year + "-" + month + "-01T00:00";
    let endDate = year + "-" + month + "-31T23:59";
    if (Number(month) == 2) {
      if (Number(year) % 4 == 0) {
        if (Number(year) % 100 == 0) {
          if (Number(year) % 400 == 0) {
            endDate = year + "-02-29T23:59";
          } else {
            endDate = year + "-02-28T23:59";
          }
        } else {
          endDate = year + "-02-29T23:59";
        }
      } else {
        endDate = year + "-02-28T23:59";
      }
    }
    if (
      Number(month) == 4 ||
      Number(month) == 6 ||
      Number(month) == 9 ||
      Number(month) == 11
    ) {
      endDate = year + "-" + month + "-30T23:59";
    }
    const _res = await overview({
      startDate: startDate,
      endDate: endDate
    });
    if (_res) {
      this.totalOutbound = _res.data.outboundQty;
      this.delivered = _res.data.combinedOutbountQty;
      this.bidding = _res.data.pendingOutboundQty;
      this.combined = _res.data.biddedOutboundQty;
    }
  }
}
</script>
<style scoped lang="css">
.overview h1 {
  font-weight: 400 !important;
  color: #037243;
}
.overview h2 {
  font-weight: 300 !important;
  font-size: 18px;
}
.overview p {
  font-size: 14px;
  font-weight: bold;
}
</style>
