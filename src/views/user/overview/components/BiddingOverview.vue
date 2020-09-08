<template>
  <section class="bidding-overview">
    <v-row>
      <h1 class="ml-10">Tổng quan đấu thầu trong tháng</h1>
    </v-row>
    <v-divider inset class="mt-5"></v-divider>
    <v-row>
      <v-col cols="12" md="6">
        <v-row>
          <v-col cols="12" md="6"
            ><v-row>
              <v-col cols="12" md="1"></v-col>
              <v-col cols="12" md="2">
                <v-avatar color="blue" size="36"
                  ><v-icon dark>business_center</v-icon></v-avatar
                >
              </v-col>
              <v-col cols="12" md="9">
                <h2>
                  <router-link
                    to="/bidding-document"
                    v-if="$auth.check('ROLE_MERCHANT')"
                    >Tổng HSMT mới thêm</router-link
                  >
                  <router-link to="/bid" v-if="$auth.check('ROLE_FORWARDER')"
                    >Tổng HSDT mới thêm</router-link
                  >
                </h2>
                <p>
                  {{ total }}
                  {{ $auth.check("ROLE_MERCHANT") ? "HSMT" : "HSDT" }}
                </p>
              </v-col></v-row
            ></v-col
          ><v-col cols="12" md="6"
            ><v-row>
              <v-col cols="12" md="1"></v-col>
              <v-col cols="12" md="2">
                <v-avatar color="success" size="36"
                  ><v-icon dark>table_chart</v-icon></v-avatar
                >
              </v-col>
              <v-col cols="12" md="9">
                <h2>
                  <router-link
                    to="/bidding-document"
                    v-if="$auth.check('ROLE_MERCHANT')"
                    >HSMT thành công</router-link
                  >
                  <router-link to="/bid" v-if="$auth.check('ROLE_FORWARDER')"
                    >HSDT thành công</router-link
                  >
                </h2>
                <p>
                  {{ success }}
                  {{ $auth.check("ROLE_MERCHANT") ? "HSMT" : "HSDT" }}
                </p>
              </v-col></v-row
            ></v-col
          >
        </v-row>
        <v-row>
          <v-col cols="12" md="6"
            ><v-row>
              <v-col cols="12" md="1"></v-col>
              <v-col cols="12" md="2">
                <v-avatar color="red" size="36"
                  ><v-icon dark>business_center</v-icon></v-avatar
                >
              </v-col>
              <v-col cols="12" md="9">
                <h2>
                  <router-link
                    to="/bidding-document"
                    v-if="$auth.check('ROLE_MERCHANT')"
                    >HSMT thất bại</router-link
                  >
                  <router-link to="/bid" v-if="$auth.check('ROLE_FORWARDER')"
                    >HSDT thất bại</router-link
                  >
                </h2>
                <p>
                  {{ fail }}
                  {{ $auth.check("ROLE_MERCHANT") ? "HSMT" : "HSDT" }}
                </p>
              </v-col></v-row
            ></v-col
          >
        </v-row>
      </v-col>
      <v-col cols="12" md="6"
        ><apexchart
          v-if="series.length == 1"
          class="chart"
          type="radialBar"
          height="300"
          :options="chartOptions"
          :series="series"
        ></apexchart
      ></v-col>
    </v-row>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import VueApexCharts from "vue-apexcharts";
import { overview } from "@/api/overview";
import { addTimeToDate } from "@/utils/tool";

@Component({
  components: {
    apexchart: VueApexCharts
  }
})
export default class BiddingOverview extends Vue {
  total = 0;
  success = 0;
  fail = 0;
  dateInit = addTimeToDate(new Date().toString());

  series = [] as Array<number>;
  chartOptions = {
    chart: {
      height: 350,
      type: "radialBar"
    },
    plotOptions: {
      radialBar: {
        hollow: {
          size: "70%"
        }
      }
    },
    labels: ["Tỉ lệ đấu thầu thành công"]
  };
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
      if (this.$auth.check("ROLE_MERCHANT")) {
        this.total = _res.data.biddingDocumentQty;
        this.success = _res.data.successfulBiddingDocumentQty;
        this.fail = _res.data.failBiddingDocumentQty;
        if (_res.data.biddingDocumentQty != 0) {
          const x =
            _res.data.successfulBiddingDocumentQty /
            _res.data.biddingDocumentQty;
          this.series.push(x * 100);
        } else {
          this.series.push(0);
        }
      } else if (this.$auth.check("ROLE_FORWARDER")) {
        this.total = _res.data.bidQty;
        this.success = _res.data.successfulBidQty;
        this.fail = _res.data.failBidQty;
        if (_res.data.bidQty != 0) {
          const x = _res.data.successfulBidQty / _res.data.bidQty;
          this.series.push(x * 100);
        } else {
          this.series.push(0);
        }
      }
    }
  }
}
</script>
<style scoped lang="css">
.bidding-overview {
  height: 400px !important;
}
.bidding-overview h1 {
  font-weight: 400 !important;
  color: #037243;
  margin-top: 30px;
}
.bidding-overview h2 {
  font-weight: 300 !important;
  font-size: 18px;
  color: #037243;
}
.bidding-overview h3 {
  font-weight: bold !important;
  font-size: 16px;
  color: navy;
}
.bidding-overview p {
  font-size: 14px;
  font-weight: bold;
}
.bidding-overview .chart {
  background-color: white;
}
</style>
