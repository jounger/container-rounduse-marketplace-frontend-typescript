<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on" @click="seenNotification()">
        <v-badge
          :value="messageCount"
          :content="messageCount"
          color="green"
          overlap
        >
          <v-icon dark> notifications_active</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-card max-width="450" class="mx-auto" v-if="$auth.check()">
      <v-toolbar color="cyan" dark>
        <v-toolbar-title>Notification</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-toolbar>

      <v-list two-line>
        <v-list-item v-if="notifications.length == 0">
          <v-list-item-content>
            {{ "Không có thông báo mới!" }}
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="item in notifications"
          :key="item.id"
          @click="gotoNotification(item)"
        >
          <v-list-item-avatar color="green">
            <!-- <v-img :src="item.avatar"></v-img> -->
            {{ item.id }}
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-html="item.message"></v-list-item-title>
            <v-list-item-subtitle>{{
              item.type + " " + item.sendDate
            }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div class="text-center">
        <v-btn
          class="ma-2"
          :loading="loading"
          :disabled="loading"
          @click="loadNotification()"
          outlined
          color="indigo"
          >Xem thêm...</v-btn
        >
      </div>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { PaginationResponse } from "@/api/payload";
import SockJS from "sockjs-client";
import Stomp, { Client } from "webstomp-client";
import { DataOptions } from "vuetify";
import {
  NOTIFICATION_LINK,
  BACKEND_WEBSOCKET_ENDPOINT
} from "@/utils/constants";
import {
  getBiddingNotification,
  getNotificationsByUser,
  getDriverNotification,
  getReportNotification,
  getShippingLineNotification
} from "@/api/notification";
import {
  INotification,
  IBiddingNotification,
  IReportNotification,
  IDriverNotification,
  IShippingLineNotification
} from "@/entity/notification";

@Component
export default class Notification extends Vue {
  notifications: Array<INotification> = [];
  notification = {} as INotification;
  notificationSubscribe: Array<string> = [];
  options = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    totalPages: 1,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  loading = false;
  messageCount = 0;

  connected = false;
  socket = {} as WebSocket;
  stompClient = {} as Client;

  async gotoNotification(item: INotification) {
    let ROUTER = "#";
    if (item && item.id) {
      if (item.type == "BIDDING") {
        const _biddingNotification = await getBiddingNotification(item.id)
          .then(res => {
            const response: IBiddingNotification = res.data;
            console.log("response", response);
            return response;
          })
          .catch(err => {
            console.log(err);
            return null;
          });
        if (_biddingNotification)
          ROUTER = `/bidding-document/${_biddingNotification.relatedResource.id}`;
      } else if (item.type == "DRIVER") {
        const _driverNotification = await getDriverNotification(item.id)
          .then(res => {
            const response: IDriverNotification = res.data;
            console.log("response", response);
            return response;
          })
          .catch(err => {
            console.log(err);
            return null;
          });
        if (_driverNotification)
          ROUTER = `/outbound/${_driverNotification.relatedResource.id}`;
      } else if (item.type == "REPORT") {
        const _reportNotification = await getReportNotification(item.id)
          .then(res => {
            const response: IReportNotification = res.data;
            console.log("response", response);
            return response;
          })
          .catch(err => {
            console.log(err);
            return null;
          });
        if (_reportNotification)
          ROUTER = `/report/${_reportNotification.relatedResource.id}`;
      } else if (item.type == "SHIPPING_LINE") {
        const _shippingLineNotification = await getShippingLineNotification(
          item.id
        )
          .then(res => {
            const response: IShippingLineNotification = res.data;
            console.log("response", response);
            return response;
          })
          .catch(err => {
            console.log(err);
            return null;
          });
        if (_shippingLineNotification)
          ROUTER = `/combined/${_shippingLineNotification.relatedResource.id}`;
      } else {
        ROUTER = "/bidding-document";
      }
    }
    console.log(ROUTER);
    this.$router.push(ROUTER);
  }

  seenNotification() {
    this.messageCount = 0;
  }

  loadNotification() {
    if (this.options.page < this.serverSideOptions.totalPages)
      this.options.page += 1;
    else console.log(this.options);
  }

  @Watch("options", { immediate: true })
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined" && this.$auth.check()) {
      this.loading = true;
      const _notification = await getNotificationsByUser({
        page: val.page - 1,
        limit: val.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<INotification> = res.data;
          console.log("watch", response);
          return response;
        })
        .catch(err => {
          console.log(err);
          return null;
        });
      this.loading = false;
      if (_notification) {
        this.notifications = [...this.notifications, ..._notification.data];
        this.serverSideOptions.totalPages = _notification.totalPages;
        this.messageCount = this.notifications.filter(x => !x.isRead).length;
      }
    }
  }

  connect() {
    this.socket = new SockJS(BACKEND_WEBSOCKET_ENDPOINT);
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

  onConnected(frame: any) {
    this.connected = true;
    console.log("onConnected", frame);
    this.notificationSubscribe.forEach(x => {
      this.stompClient.subscribe(`/user${x}`, (tick: any) => {
        console.log(tick);
        this.notifications.unshift(JSON.parse(tick.body));
        this.messageCount += 1;
      });
    });
  }

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
    if (this.$auth.check()) {
      if (this.$auth.user() && typeof this.$auth.user().roles !== "undefined") {
        switch (this.$auth.user().roles[0]) {
          case "ROLE_MODERATOR":
            this.notificationSubscribe.push(NOTIFICATION_LINK.REPORT);
            break;
          case "ROLE_FORWARDER":
            this.notificationSubscribe.push(
              NOTIFICATION_LINK.BIDDING,
              NOTIFICATION_LINK.REPORT
            );
            break;
          case "ROLE_MERCHANT":
            this.notificationSubscribe.push(
              NOTIFICATION_LINK.BIDDING,
              NOTIFICATION_LINK.REPORT
            );
            break;
          case "ROLE_SHIPPINGLINE":
            this.notificationSubscribe.push(NOTIFICATION_LINK.SHIPPING_LINE);
            break;
          case "ROLE_DRIVER":
            this.notificationSubscribe.push(NOTIFICATION_LINK.DRIVER);
            break;
          default:
            console.log("You're not in subscribe list!");
            break;
        }
        console.log(this.notificationSubscribe);
      }
      this.connect();
    }
  }
}
</script>
