<template>
  <section class="moderator-overview">
    <v-row>
      <h1 class="ml-10">Tổng quan hệ thống trong tháng</h1>
    </v-row>
    <v-divider inset class="mt-5"></v-divider>
    <v-row>
      <v-col cols="12" md="6">
        <h3 class="ml-10">Tổng quan hàng xuất</h3>
        <v-divider inset class="mt-2"></v-divider>
        <v-row>
          <v-col cols="12" md="6"
            ><v-row>
              <v-col cols="12" md="1"></v-col>
              <v-col cols="12" md="2">
                <v-avatar color="blue" size="36"
                  ><v-icon dark>flight_takeoff</v-icon></v-avatar
                >
              </v-col>
              <v-col cols="12" md="9">
                <h2>Tổng hàng xuất mới thêm</h2>
                <p>{{ totalOutbound }} hàng xuất</p>
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
                <h2>Tổng hàng xuất được ghép</h2>
                <p>{{ combinedOutbound }} hàng xuất</p>
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
                  ><v-icon dark>local_shipping</v-icon></v-avatar
                >
              </v-col>
              <v-col cols="12" md="9">
                <h2>Tổng số hàng xuất đã giao</h2>
                <p>{{ deliveredOutbound }} hàng xuất</p>
              </v-col></v-row
            ></v-col
          >
        </v-row>
        <apexchart
          v-if="seriesOutbound.length == 1"
          class="chart"
          type="radialBar"
          height="300"
          :options="chartOptionsOutbound"
          :series="seriesOutbound"
        ></apexchart
      ></v-col>
      <v-col cols="12" md="6">
        <h3 class="ml-10">Tổng quan hàng nhập</h3>
        <v-divider inset class="mt-2"></v-divider
        ><v-row>
          <v-col cols="12" md="6"
            ><v-row>
              <v-col cols="12" md="1"></v-col>
              <v-col cols="12" md="2">
                <v-avatar color="blue" size="36"
                  ><v-icon dark>flight_land</v-icon></v-avatar
                >
              </v-col>
              <v-col cols="12" md="9">
                <h2>Tổng hàng nhập mới thêm</h2>
                <p>{{ totalInbound }} hàng nhập</p>
              </v-col></v-row
            ></v-col
          ><v-col cols="12" md="6"
            ><v-row>
              <v-col cols="12" md="1"></v-col>
              <v-col cols="12" md="2">
                <v-avatar color="success" size="36"
                  ><v-icon dark>local_shipping</v-icon></v-avatar
                >
              </v-col>
              <v-col cols="12" md="9">
                <h2>Tổng Container mới thêm</h2>
                <p>{{ totalContainer }} container</p>
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
                  ><v-icon dark>local_shipping</v-icon></v-avatar
                >
              </v-col>
              <v-col cols="12" md="9">
                <h2>Tổng số Container đã ghép</h2>
                <p>{{ combinedContainer }} container</p>
              </v-col></v-row
            ></v-col
          >
          <v-col cols="12" md="6"
            ><v-row>
              <v-col cols="12" md="1"></v-col>
              <v-col cols="12" md="2">
                <v-avatar color="red" size="36"
                  ><v-icon dark>local_shipping</v-icon></v-avatar
                >
              </v-col>
              <v-col cols="12" md="9">
                <h2>Số Container hoàn thành</h2>
                <p>{{ deliveredContainer }} container</p>
              </v-col></v-row
            ></v-col
          >
        </v-row>
        <apexchart
          v-if="seriesContainer.length == 1"
          class="chart"
          type="radialBar"
          height="300"
          :options="chartOptionsContainer"
          :series="seriesContainer"
        ></apexchart
      ></v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <h3 class="ml-10">Tổng quan đấu thầu</h3>
        <v-divider inset class="mt-2"></v-divider>
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
                <h2>Tổng HSMT mới thêm</h2>
                <p>{{ totalBiddingDocument }} HSMT</p>
              </v-col></v-row
            ></v-col
          ><v-col cols="12" md="6"
            ><v-row>
              <v-col cols="12" md="1"></v-col>
              <v-col cols="12" md="2">
                <v-avatar color="success" size="36"
                  ><v-icon dark>business_center</v-icon></v-avatar
                >
              </v-col>
              <v-col cols="12" md="9">
                <h2>Tổng HSDT mới thêm</h2>
                <p>{{ totalBid }} HSDT</p>
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
                  ><v-icon dark>table_chart</v-icon></v-avatar
                >
              </v-col>
              <v-col cols="12" md="9">
                <h2>Số hàng ghép mới tạo</h2>
                <p>{{ totalCombined }} hàng ghép</p>
              </v-col></v-row
            ></v-col
          >
        </v-row>
      </v-col>
      <v-col cols="12" md="6">
        <h3 class="ml-10">Tỉ lệ đấu thầu thành công</h3>
        <v-divider inset class="mt-2 mb-5"></v-divider
        ><apexchart
          v-if="seriesBidding.length == 1"
          class="chart"
          type="radialBar"
          height="300"
          :options="chartOptionsBidding"
          :series="seriesBidding"
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
export default class ModeratorOverviewCard extends Vue {
  totalOutbound = 0;
  combinedOutbound = 0;
  deliveredOutbound = 0;
  totalInbound = 0;
  totalContainer = 0;
  combinedContainer = 0;
  deliveredContainer = 0;
  totalBiddingDocument = 0;
  totalBid = 0;
  totalCombined = 0;
  dateInit = addTimeToDate(new Date().toString());

  seriesOutbound = [] as Array<number>;
  chartOptionsOutbound = {
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
    labels: ["Tỉ lệ ghép hàng"]
  };
  seriesContainer = [] as Array<number>;
  chartOptionsContainer = {
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
    labels: ["Tỉ lệ ghép Container"]
  };
  seriesBidding = [] as Array<number>;
  chartOptionsBidding = {
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
      this.totalOutbound = _res.data.outboundQty;
      this.combinedOutbound = _res.data.combinedOutboundQty;
      this.deliveredOutbound = _res.data.deliveredOutboundQty;
      if (_res.data.outboundQty != 0) {
        const x = _res.data.combinedOutboundQty / _res.data.outboundQty;
        this.seriesOutbound.push(x * 100);
      } else {
        this.seriesOutbound.push(0);
      }
      this.totalInbound = _res.data.inboundQty;
      this.totalContainer = _res.data.containerQty;
      this.combinedContainer = _res.data.combinedContainerQty;
      this.deliveredContainer = _res.data.deliveredContainerQty;
      if (_res.data.containerQty != 0) {
        const x = _res.data.combinedContainerQty / _res.data.containerQty;
        this.seriesContainer.push(x * 100);
      } else {
        this.seriesContainer.push(0);
      }
      this.totalBiddingDocument = _res.data.biddingDocumentQty;
      this.totalBid = _res.data.bidQty;
      this.totalCombined = _res.data.combinedBiddingDocumentQty;
      if (_res.data.biddingDocumentQty != 0) {
        const x =
          _res.data.combinedBiddingDocumentQty / _res.data.biddingDocumentQty;
        this.seriesBidding.push(x * 100);
      } else {
        this.seriesBidding.push(0);
      }
    }
  }
}
</script>
<style scoped lang="css">
.moderator-overview {
  height: 1000px !important;
}
.moderator-overview h1 {
  font-weight: 400 !important;
  color: #037243;
  margin-top: 30px;
}
.moderator-overview h2 {
  font-weight: 300 !important;
  font-size: 18px;
  color: #037243;
}
.moderator-overview h3 {
  font-weight: bold !important;
  font-size: 16px;
  color: navy;
}
.moderator-overview p {
  font-size: 14px;
  font-weight: bold;
}
.moderator-overview .chart {
  background-color: white;
}
</style>
