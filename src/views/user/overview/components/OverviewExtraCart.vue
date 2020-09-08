<template>
  <section class="overview-extra">
    <v-row>
      <h1 class="ml-10">
        Quản lý
        {{ $auth.check("ROLE_MODERATOR") ? "Report" : "hợp đồng" }} trong tháng
      </h1>
    </v-row>
    <v-divider inset class="mt-5"></v-divider>
    <v-row>
      <v-col cols="12" md="6"
        ><v-row>
          <v-col cols="12" md="1"></v-col>
          <v-col cols="12" md="2">
            <v-avatar color="red" size="36"
              ><v-icon dark>{{
                $auth.check("ROLE_MODERATOR")
                  ? "report_problem"
                  : "flight_takeoff"
              }}</v-icon></v-avatar
            >
          </v-col>
          <v-col cols="12" md="9">
            <h2>
              <router-link
                to="/contract"
                v-if="
                  $auth.check('ROLE_FORWARDER') || $auth.check('ROLE_MERCHANT')
                "
                >Tổng số hợp đồng</router-link
              >
              <router-link to="/report" v-if="$auth.check('ROLE_MODERATOR')"
                >Tổng số Report</router-link
              >
            </h2>
            <p>
              {{ total }}
              {{ $auth.check("ROLE_MODERATOR") ? "report" : "hợp đồng" }}
            </p>
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
          <v-col cols="12" md="9">
            <h2>
              <router-link
                to="/contract"
                v-if="
                  $auth.check('ROLE_FORWARDER') || $auth.check('ROLE_MERCHANT')
                "
                >Hợp đồng đã thanh toán</router-link
              >
              <router-link to="/report" v-if="$auth.check('ROLE_MODERATOR')"
                >Report đã giải quyết</router-link
              >
            </h2>
            <p v-if="$auth.check('ROLE_MODERATOR')">{{ resolved }} report</p>
            <p v-else>{{ paid }} hợp đồng</p>
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
              ><v-icon dark>report</v-icon></v-avatar
            >
          </v-col>
          <v-col cols="12" md="8">
            <h2>
              <router-link
                to="/contract"
                v-if="
                  $auth.check('ROLE_FORWARDER') || $auth.check('ROLE_MERCHANT')
                "
                >Hợp đồng chưa trả</router-link
              >
              <router-link to="/report" v-if="$auth.check('ROLE_MODERATOR')"
                >Report đang chờ</router-link
              >
            </h2>
            <p v-if="$auth.check('ROLE_MODERATOR')">{{ pending }} report</p>
            <p v-else>{{ unpaid }} hợp đồng</p>
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
export default class OverviewExtraCard extends Vue {
  total = 0;
  paid = 0;
  unpaid = 0;
  resolved = 0;
  pending = 0;
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
      if (this.$auth.check("ROLE_MERCHANT")) {
        this.total = _res.data.contractQty;
        this.paid = _res.data.paidContractQty;
        this.unpaid = _res.data.unpaidContractQty;
      } else if (this.$auth.check("ROLE_FORWARDER")) {
        this.total = _res.data.receivedContractQty;
        this.paid = _res.data.getPaidContractQty;
        this.unpaid = _res.data.unpaidContractQty;
      } else {
        this.total = _res.data.reportQty;
        this.resolved = _res.data.resolvedReportQty;
        this.pending = _res.data.pendingReportQty;
      }
    }
  }
}
</script>
<style scoped lang="css">
.overview-extra {
  height: 400px !important;
}
.overview-extra h1 {
  font-weight: 400 !important;
  color: #037243;
  margin-top: 30px;
}
.overview-extra h2 {
  font-weight: 300 !important;
  font-size: 18px;
}
.overview-extra p {
  font-size: 14px;
  font-weight: bold;
}
</style>
