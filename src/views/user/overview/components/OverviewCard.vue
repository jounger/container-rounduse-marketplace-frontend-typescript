<template>
  <section class="overview">
    <v-row>
      <h1 class="ml-10">
        Tổng quan
        {{
          $auth.check("ROLE_FORWARDER") || $auth.check("ROLE_SHIPPINGLINE")
            ? "Container"
            : $auth.check("ROLE_MERCHANT")
            ? "hàng xuất"
            : "truy cập"
        }}
        trong tháng
      </h1>
    </v-row>
    <v-divider inset class="mt-5"></v-divider>
    <v-row>
      <v-col cols="12" md="6"
        ><v-row>
          <v-col cols="12" md="1"></v-col>
          <v-col cols="12" md="2">
            <v-avatar color="blue" size="36"
              ><v-icon dark>{{
                $auth.check("ROLE_FORWARDER")
                  ? "flight_land"
                  : $auth.check("ROLE_MERCHANT")
                  ? "flight_takeoff"
                  : $auth.check("ROLE_SHIPPINGLINE")
                  ? "local_shipping"
                  : "people"
              }}</v-icon></v-avatar
            >
          </v-col>
          <v-col cols="12" md="9">
            <h2>
              <router-link to="/outbound" v-if="$auth.check('ROLE_MERCHANT')"
                >Tổng số hàng xuất</router-link
              >
              <router-link to="/inbound" v-if="$auth.check('ROLE_FORWARDER')"
                >Tổng số hàng nhập</router-link
              >
              <router-link
                to="/borrow-notify"
                v-if="$auth.check('ROLE_SHIPPINGLINE')"
                >Tổng số Container</router-link
              >
              <router-link to="/supplier" v-if="$auth.check('ROLE_MODERATOR')"
                >Tổng số nhà cung cấp</router-link
              >
            </h2>
            <p>
              {{ total }}
              {{
                $auth.check("ROLE_FORWARDER")
                  ? "hàng nhập"
                  : $auth.check("ROLE_MERCHANT")
                  ? "hàng xuất"
                  : $auth.check("ROLE_SHIPPINGLINE")
                  ? "container"
                  : "nhà cung cấp"
              }}
            </p>
          </v-col></v-row
        ></v-col
      ><v-col cols="12" md="6"
        ><v-row>
          <v-col cols="12" md="1"></v-col>
          <v-col cols="12" md="2">
            <v-avatar color="success" size="36"
              ><v-icon dark>{{
                $auth.check("ROLE_FORWARDER")
                  ? "local_shipping"
                  : $auth.check("ROLE_MERCHANT")
                  ? "offline_pin"
                  : $auth.check("ROLE_SHIPPINGLINE")
                  ? "local_shipping"
                  : "person"
              }}</v-icon></v-avatar
            >
          </v-col>
          <v-col cols="12" md="9">
            <h2>
              <router-link to="/combined" v-if="$auth.check('ROLE_MERCHANT')"
                >Số hàng đã giao</router-link
              >
              <router-link to="/inbound" v-if="$auth.check('ROLE_FORWARDER')"
                >Tổng số Container</router-link
              >
              <router-link
                to="/borrow-notify"
                v-if="$auth.check('ROLE_SHIPPINGLINE')"
                >Số Container hoàn thành</router-link
              >
              <router-link to="/supplier" v-if="$auth.check('ROLE_MODERATOR')"
                >Số nhà cung cấp mới</router-link
              >
            </h2>
            <p>
              {{
                $auth.check("ROLE_FORWARDER")
                  ? delivered + " mặt hàng"
                  : $auth.check("ROLE_MERCHANT")
                  ? countCont + " container"
                  : $auth.check("ROLE_SHIPPINGLINE")
                  ? delivered + " container"
                  : newSupplier + " nhà cung cấp"
              }}
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
            <v-avatar color="deep-purple" size="36"
              ><v-icon dark>{{
                $auth.check("ROLE_MODERATOR")
                  ? "description"
                  : "business_center"
              }}</v-icon></v-avatar
            >
          </v-col>
          <v-col cols="12" md="9">
            <h2>
              <router-link
                to="/bidding-document"
                v-if="$auth.check('ROLE_MERCHANT')"
                >Hàng đang đấu thầu</router-link
              >
              <router-link to="/bid" v-if="$auth.check('ROLE_FORWARDER')"
                >Container đang đấu thầu</router-link
              >
              <router-link
                to="/borrow-notify"
                v-if="$auth.check('ROLE_SHIPPINGLINE')"
                >Container đang đấu thầu</router-link
              >
              <router-link
                to="/supplier-register"
                v-if="$auth.check('ROLE_MODERATOR')"
                >Số đơn đăng ký mới</router-link
              >
            </h2>
            <p v-if="$auth.check('ROLE_MODERATOR')">
              {{ application }} đơn đăng ký
            </p>
            <p v-else>
              {{ bidding }}
              {{
                $auth.check("ROLE_FORWARDER") ||
                $auth.check("ROLE_SHIPPINGLINE")
                  ? " container"
                  : $auth.check("ROLE_MERCHANT")
                  ? " mặt hàng"
                  : ""
              }}
            </p>
          </v-col></v-row
        ></v-col
      ><v-col cols="12" md="6" v-if="!$auth.check('ROLE_MODERATOR')"
        ><v-row>
          <v-col cols="12" md="1"></v-col>
          <v-col cols="12" md="2">
            <v-avatar color="red" size="36"
              ><v-icon dark>table_chart</v-icon></v-avatar
            >
          </v-col>
          <v-col cols="12" md="8">
            <h2>
              <router-link
                to="/combined"
                v-if="
                  $auth.check('ROLE_MERCHANT') || $auth.check('ROLE_FORWARDER')
                "
                >{{
                  $auth.check("ROLE_FORWARDER")
                    ? "Container "
                    : $auth.check("ROLE_MERCHANT")
                    ? "Hàng "
                    : ""
                }}
                đã ghép</router-link
              >
              <router-link
                to="/borrow-notify"
                v-if="$auth.check('ROLE_SHIPPINGLINE')"
                >Container đã ghép</router-link
              >
            </h2>
            <p>
              {{ combined }}
              {{
                $auth.check("ROLE_FORWARDER") ||
                $auth.check("ROLE_SHIPPINGLINE")
                  ? " container"
                  : $auth.check("ROLE_MERCHANT")
                  ? " mặt hàng"
                  : ""
              }}
            </p>
          </v-col></v-row
        ></v-col
      >
    </v-row>
    <v-row v-if="$auth.check('ROLE_FORWARDER')">
      <v-col cols="12" md="6"
        ><v-row>
          <v-col cols="12" md="1"></v-col>
          <v-col cols="12" md="2">
            <v-avatar color="warning" size="36"
              ><v-icon dark>local_shipping</v-icon></v-avatar
            >
          </v-col>
          <v-col cols="12" md="9">
            <h2>
              <router-link to="/combined">Số Container hoàn thành</router-link>
            </h2>
            <p>{{ delivered }} container</p>
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
  total = 0;
  newSupplier = 0;
  application = 0;
  delivered = 0;
  bidding = 0;
  combined = 0;
  countCont = 0;
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
        this.total = _res.data.outboundQty;
        this.delivered = _res.data.deliveredOutbountQty;
        this.bidding = _res.data.biddingOutboundQty;
        this.combined = _res.data.combinedOutboundQty;
      } else if (this.$auth.check("ROLE_FORWARDER")) {
        this.total = _res.data.inboundQty;
        this.delivered = _res.data.deliveredContainerQty;
        this.bidding = _res.data.biddingContainerQty;
        this.combined = _res.data.combinedContainerQty;
        this.countCont = _res.data.containerQty;
      } else if (this.$auth.check("ROLE_SHIPPINGLINE")) {
        this.delivered = _res.data.deliveredContainerQty;
        this.bidding = _res.data.biddingContainerQty;
        this.combined = _res.data.combinedContainerQty;
        this.countCont = _res.data.containerQty;
      } else {
        this.total = _res.data.totalMember;
        this.newSupplier = _res.data.newMemberQty;
        this.application = _res.data.unapprovedRegistration;
      }
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
