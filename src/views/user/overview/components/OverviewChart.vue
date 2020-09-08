<template>
  <div id="chart" class="overview-chart">
    <v-row>
      <h1>
        {{
          $auth.check("ROLE_FORWARDER") || $auth.check("ROLE_SHIPPINGLINE")
            ? "Container đã hoàn thành"
            : $auth.check("ROLE_MERCHANT")
            ? "Hàng đã giao"
            : "Số nhà cung cấp mới"
        }}
        trong tháng
      </h1> </v-row
    ><v-divider inset class="mt-5 mb-5"></v-divider>
    <v-card width="450">
      <apexchart
        v-if="series[0].data.length > 1"
        type="line"
        height="300"
        :options="chartOptions"
        :series="series"
      ></apexchart>
    </v-card>
  </div>
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
export default class OverviewChart extends Vue {
  dateInit = addTimeToDate(new Date().toString());
  series = [
    {
      name: "",
      data: [0] as Array<number | null>
    }
  ];
  chartOptions = {
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: "straight"
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5
      }
    },
    xaxis: {
      categories: ["0", "Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"]
    }
  };
  async created() {
    if (this.$auth.check("ROLE_MERCHANT")) {
      this.series[0].name = "Hàng xuất";
    } else if (
      this.$auth.check("ROLE_FORWARDER") ||
      this.$auth.check("ROLE_SHIPPINGLINE")
    ) {
      this.series[0].name = "Container";
    } else {
      this.series[0].name = "Nhà cung cấp";
    }
    const year = this.dateInit.slice(0, 4);
    const month = this.dateInit.slice(5, 7);
    const day = this.dateInit.slice(8, 10);
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
    const _resWeek1 = await overview({
      startDate: startDate,
      endDate: year + "-" + month + "-07T23:59"
    });
    if (_resWeek1) {
      if (this.$auth.check("ROLE_MERCHANT")) {
        this.series[0].data.push(_resWeek1.data.deliveredOutbountQty);
      } else if (
        this.$auth.check("ROLE_FORWARDER") ||
        this.$auth.check("ROLE_SHIPPINGLINE")
      ) {
        this.series[0].data.push(_resWeek1.data.deliveredContainerQty);
      } else {
        this.series[0].data.push(_resWeek1.data.newMemberQty);
      }
    }
    if (Number(day) > 8) {
      const _resWeek2 = await overview({
        startDate: year + "-" + month + "-08T23:59",
        endDate: year + "-" + month + "-15T23:59"
      });
      if (_resWeek2) {
        if (this.$auth.check("ROLE_MERCHANT")) {
          this.series[0].data.push(_resWeek2.data.deliveredOutbountQty);
        } else if (
          this.$auth.check("ROLE_FORWARDER") ||
          this.$auth.check("ROLE_SHIPPINGLINE")
        ) {
          this.series[0].data.push(_resWeek2.data.deliveredContainerQty);
        } else {
          this.series[0].data.push(_resWeek2.data.newMemberQty);
        }
      }
    } else {
      this.series[0].data.push(null);
    }
    if (Number(day) > 16) {
      const _resWeek3 = await overview({
        startDate: year + "-" + month + "-16T23:59",
        endDate: year + "-" + month + "-23T23:59"
      });
      if (_resWeek3) {
        if (this.$auth.check("ROLE_MERCHANT")) {
          this.series[0].data.push(_resWeek3.data.deliveredOutbountQty);
        } else if (
          this.$auth.check("ROLE_FORWARDER") ||
          this.$auth.check("ROLE_SHIPPINGLINE")
        ) {
          this.series[0].data.push(_resWeek3.data.deliveredContainerQty);
        } else {
          this.series[0].data.push(_resWeek3.data.newMemberQty);
        }
      }
    } else {
      this.series[0].data.push(null);
    }
    if (Number(day) > 24) {
      const _resWeek4 = await overview({
        startDate: year + "-" + month + "-24T23:59",
        endDate: endDate
      });
      if (_resWeek4) {
        if (this.$auth.check("ROLE_MERCHANT")) {
          this.series[0].data.push(_resWeek4.data.deliveredOutbountQty);
        } else if (
          this.$auth.check("ROLE_FORWARDER") ||
          this.$auth.check("ROLE_SHIPPINGLINE")
        ) {
          this.series[0].data.push(_resWeek4.data.deliveredContainerQty);
        } else {
          this.series[0].data.push(_resWeek4.data.newMemberQty);
        }
      }
    } else {
      this.series[0].data.push(null);
    }
  }
}
</script>
<style scoped lang="css">
.overview-chart h1 {
  font-weight: 400 !important;
  font-size: 23px !important;
  color: #037243;
}
</style>
