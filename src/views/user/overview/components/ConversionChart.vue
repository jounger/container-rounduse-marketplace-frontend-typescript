<template>
  <div id="chart" class="conversion">
    <v-row>
      <h1>
        Tỉ lệ
        {{
          $auth.check("ROLE_FORWARDER")
            ? "quay đầu"
            : $auth.check("ROLE_MERCHANT")
            ? "chuyển đổi hàng xuất"
            : ""
        }}
      </h1> </v-row
    ><v-divider inset class="mt-5 mb-5"></v-divider>
    <v-card width="450">
      <apexchart
        v-if="series.length == 1"
        type="radialBar"
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
export default class ConversionChart extends Vue {
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
    labels: ["Tỉ lệ chuyển đổi hàng xuất"]
  };
  async created() {
    if (this.$auth.check("ROLE_MERCHANT")) {
      this.chartOptions.labels[0] = "Tỉ lệ chuyển đổi hàng xuất";
    } else if (this.$auth.check("ROLE_FORWARDER")) {
      this.chartOptions.labels[0] = "Tỉ lệ quay đầu";
    }
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
        if (_res.data.outboundQty != 0) {
          const x = _res.data.combinedOutbountQty / _res.data.outboundQty;
          this.series.push(x * 100);
        } else {
          this.series.push(0);
        }
      } else if (this.$auth.check("ROLE_FORWARDER")) {
        if (_res.data.containerQty != 0) {
          const x = _res.data.combinedContainerQty / _res.data.containerQty;
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
.conversion h1 {
  font-weight: 400 !important;
  font-size: 23px !important;
  color: #037243;
}
</style>
