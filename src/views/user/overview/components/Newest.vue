<template>
  <v-card class="newest" width="450">
    <v-card-title> <h1>Thông báo mới nhất</h1> </v-card-title
    ><v-divider inset class="mb-5"></v-divider>
    <v-list>
      <v-list-item
        v-for="item in notifications"
        :key="item.id"
        @click="gotoNotification(item)"
      >
        <v-list-item-avatar color="primary">
          <v-btn class="ma-2" outlined fab color="white">
            <v-icon>error_outline</v-icon>
          </v-btn>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title v-html="item.message"></v-list-item-title>
          <v-list-item-subtitle>
            <ChipStatus
              :status="item.type"
              :sub="true"
              type="type"/></v-list-item-subtitle
          ><small>{{ formatDatetime(item.sendDate) }}</small>
        </v-list-item-content>

        <v-list-item-icon v-if="item.isRead == false">
          <v-icon color="blue" dense>brightness_1</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Utils from "@/mixin/utils";
import ChipStatus from "@/components/ChipStatus.vue";
import {
  getBiddingNotification,
  getCombinedNotification,
  getReportNotification
} from "@/api/notification";
import { NOTIFICATION_LINK } from "@/utils/constants";
import { DataOptions } from "vuetify";
import Stomp, { Client } from "webstomp-client";
import SockJS from "sockjs-client";
import { getNotifications } from "@/api/notification";
import { INotification, IBiddingNotification } from "@/entity/notification";

@Component({
  mixins: [Utils],
  components: {
    ChipStatus
  }
})
export default class Newest extends Vue {
  notifications: Array<INotification> = [];
  notification = null as INotification | null;
  notificationSubscribe: Array<string> = [];
  connected = false;
  socket = null as WebSocket | null;
  stompClient = null as Client | null;
  options = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    totalPages: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  loading = false;
  async gotoNotification(item: INotification) {
    let ROUTER = "";
    if (item.type == "BIDDING") {
      const _res = await getBiddingNotification(item.id as number);
      if (_res.data) {
        const _biddingNotification = _res.data as IBiddingNotification;
        if (_biddingNotification.action.includes("CONTRACT")) {
          ROUTER = "/contract";
        } else ROUTER = `/bidding-document/${_res.data.relatedResource.id}`;
      }
    } else if (item.type == "COMBINED") {
      const _res = await getCombinedNotification(item.id as number);
      if (_res.data) {
        const _combinedNotification = _res.data as IBiddingNotification;
        if (_combinedNotification.action.includes("CONTRACT")) {
          ROUTER = "/contract";
        } else if (_combinedNotification.action.includes("INVOICE")) {
          ROUTER = "/invoice";
        } else ROUTER = "/borrow-notify";
      }
    } else if (item.type == "REPORT") {
      const _res = await getReportNotification(item.id as number);
      if (_res.data) ROUTER = `/report/${_res.data.relatedResource.id}`;
    } else if (item.type == "SHIPPING") {
      ROUTER = "#";
    }
    console.log(location.pathname, ROUTER);
    if (location.pathname == ROUTER) {
      location.reload();
    } else {
      this.$router.push(ROUTER);
    }
    return;
  }
  @Watch("options", { immediate: true, deep: true })
  async onOptionsChange(val: DataOptions) {
    if (
      typeof val != "undefined" &&
      this.$auth.user() &&
      this.$auth.check([
        "ROLE_MODERATOR",
        "ROLE_FORWARDER",
        "ROLE_MERCHANT",
        "ROLE_SHIPPINGLINE",
        "ROLE_DRIVER"
      ])
    ) {
      this.loading = true;
      const _res = await getNotifications({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      if (_res.data) {
        const _notifications = _res.data.data as INotification[];
        this.notifications = [...this.notifications, ..._notifications];
        this.serverSideOptions.totalPages = _res.data.totalPages;
      }
      this.loading = false;
    }
  }

  connect() {
    this.socket = new SockJS(process.env.VUE_APP_ENDPOINT + "/stomp");
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.debug = () => {
      // Disable Debug
    };
    this.stompClient.connect(
      { Authorization: `Bearer ${this.$auth.token()}` },
      this.onConnected,
      this.onDisconnected
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onConnected(frame: any) {
    this.connected = true;
    console.log("onConnected", frame);
    this.notificationSubscribe.forEach(x => {
      if (this.stompClient) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.stompClient.subscribe(`/user${x}`, (tick: any) => {
          this.notifications.unshift(JSON.parse(tick.body));
        });
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDisconnected(err: any) {
    console.log(err);
    this.connected = false;
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
    this.connected = false;
  }

  tickleConnection() {
    this.connected ? this.disconnect() : this.connect();
  }

  mounted() {
    // CONNECT WEBSOCKET
    if (this.$auth.check("ROLE_MODERATOR")) {
      this.notificationSubscribe.push(NOTIFICATION_LINK.REPORT);
    } else if (this.$auth.check("ROLE_MERCHANT")) {
      this.notificationSubscribe.push(
        NOTIFICATION_LINK.BIDDING,
        NOTIFICATION_LINK.COMBINED,
        NOTIFICATION_LINK.SHIPPING
      );
    } else if (this.$auth.check("ROLE_FORWARDER")) {
      this.notificationSubscribe.push(
        NOTIFICATION_LINK.BIDDING,
        NOTIFICATION_LINK.COMBINED,
        NOTIFICATION_LINK.REPORT
      );
    } else if (this.$auth.check("ROLE_SHIPPINGLINE")) {
      this.notificationSubscribe.push(NOTIFICATION_LINK.COMBINED);
    } else if (this.$auth.check("ROLE_DRIVER")) {
      this.notificationSubscribe.push(NOTIFICATION_LINK.SHIPPING);
    } else {
      console.log("You're not in subscribe list!");
    }
    console.log(this.notificationSubscribe);
    if (this.notificationSubscribe.length > 0) this.connect();
  }
}
</script>
<style scoped lang="css">
.newest h1 {
  font-weight: 400 !important;
  font-size: 23px !important;
  color: #037243;
}
</style>
