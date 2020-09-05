<template>
  <div id="chart" class="ml-10 compare">
    <v-row> <h1>Bảng so sánh hàng xuất</h1> </v-row
    ><v-divider inset class="mt-5 mb-5"></v-divider>
    <v-card width="450">
      <v-card-text>
        <apexchart
          v-if="series[0].data.length == 4"
          type="bar"
          height="300"
          :options="chartOptions"
          :series="series"
        ></apexchart> </v-card-text
    ></v-card>
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
export default class CompareChart extends Vue {
  dateInit = addTimeToDate(new Date().toString());
  series = [
    {
      name: "Tổng số hàng xuất",
      data: [] as Array<number>
    },
    {
      name: "Số hàng xuất đã giao",
      data: [] as Array<number>
    }
  ];
  chartOptions = {
    chart: {
      type: "bar",
      height: 350
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded"
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"]
    },
    xaxis: {
      categories: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"]
    },
    fill: {
      opacity: 1
    },
    tooltip: {
      y: {
        formatter: function(val: number) {
          return val + " hàng xuất";
        }
      }
    }
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
    const _resWeek1 = await overview({
      startDate: startDate,
      endDate: year + "-" + month + "-07T23:59"
    });
    if (_resWeek1) {
      this.series[0].data.push(_resWeek1.data.outboundQty);
      this.series[1].data.push(_resWeek1.data.combinedOutbountQty);
    }
    const _resWeek2 = await overview({
      startDate: year + "-" + month + "-08T23:59",
      endDate: year + "-" + month + "-15T23:59"
    });
    if (_resWeek2) {
      this.series[0].data.push(_resWeek2.data.outboundQty);
      this.series[1].data.push(_resWeek2.data.combinedOutbountQty);
    }
    const _resWeek3 = await overview({
      startDate: year + "-" + month + "-16T23:59",
      endDate: year + "-" + month + "-23T23:59"
    });
    if (_resWeek3) {
      this.series[0].data.push(_resWeek3.data.outboundQty);
      this.series[1].data.push(_resWeek3.data.combinedOutbountQty);
    }
    const _resWeek4 = await overview({
      startDate: year + "-" + month + "-24T23:59",
      endDate: endDate
    });
    if (_resWeek4) {
      this.series[0].data.push(_resWeek4.data.outboundQty);
      this.series[1].data.push(_resWeek4.data.combinedOutbountQty);
    }
  }
}
</script>
<style scoped lang="css">
.compare h1 {
  font-weight: 400 !important;
  font-size: 23px !important;
  color: #037243;
}
</style>
