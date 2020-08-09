<template>
  <v-menu
    offset-y
    :close-on-click="true"
    :close-on-content-click="false"
    max-height="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
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
      <v-list three-line avatar v-if="notifications.length > 0">
        <v-subheader
          >THÔNG BÁO<v-spacer></v-spacer>
          <v-menu left bottom :offset-y="true">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item-group>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon dense>done_all</v-icon>
                  </v-list-item-icon>
                  <v-list-item-title @click="seenAllNotification()"
                    >Đánh dấu là đã đọc</v-list-item-title
                  >
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu></v-subheader
        >
        <v-list-item-group>
          <v-list-item
            v-for="item in notifications"
            :key="item.id"
            @click="
              seenNotification(item);
              gotoNotification(item);
            "
          >
            <v-list-item-avatar color="green">
              <!-- <v-img :src="item.avatar"></v-img> -->
              {{ item.id }}
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-html="item.message"></v-list-item-title>
              <v-list-item-subtitle v-html="item.type"></v-list-item-subtitle
              ><small>{{ formatDatetime(item.sendDate) }}</small>
            </v-list-item-content>

            <v-list-item-icon v-if="item.isRead == false">
              <v-icon color="blue" dense>brightness_1</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <v-list two-line v-else>
        <v-subheader>THÔNG BÁO</v-subheader>
        <v-list-item>
          <v-list-item-content>
            {{ "Không có thông báo mới!" }}
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <div
        class="text-center"
        v-if="options.page < serverSideOptions.totalPages"
      >
        <v-btn
          class="ma-2"
          :loading="loading"
          :disabled="loading"
          @click.stop="seeMore()"
          outlined
          color="indigo"
          small
          >Xem thêm...</v-btn
        >
      </div>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
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
  getShippingLineNotification,
  editNotifications
} from "@/api/notification";
import { INotification } from "@/entity/notification";
import Utils from "@/mixin/utils";

@Component({
  mixins: [Utils]
})
export default class Notification extends Vue {
  notifications: Array<INotification> = [];
  notification = null as INotification | null;
  notificationSubscribe: Array<string> = [];
  options = {
    page: 1,
    itemsPerPage: 2
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    totalPages: 0,
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
        const _biddingNotification = await getBiddingNotification(item.id);
        if (_biddingNotification)
          ROUTER = `/bidding-document/${_biddingNotification.data.relatedResource.id}`;
      } else if (item.type == "DRIVER") {
        const _driverNotification = await getDriverNotification(item.id);
        if (_driverNotification)
          ROUTER = `/outbound/${_driverNotification.data.relatedResource.id}`;
      } else if (item.type == "REPORT") {
        const _reportNotification = await getReportNotification(item.id);
        if (_reportNotification)
          ROUTER = `/report/${_reportNotification.data.relatedResource.id}`;
      } else if (item.type == "SHIPPING_LINE") {
        const _shippingLineNotification = await getShippingLineNotification(
          item.id
        );
        if (_shippingLineNotification)
          ROUTER = `/combined/${_shippingLineNotification.data.relatedResource.id}`;
      } else {
        ROUTER = "/bidding-document";
      }
    }
    console.log(ROUTER);
    this.$router.push(ROUTER);
  }

  seenAllNotification() {
    this.notifications.filter(x => {
      if (x.isRead == false) {
        this.seenNotification(x);
      }
    });
    this.messageCount = 0;
  }

  async seenNotification(item: INotification) {
    if (item.isRead == false) {
      const _res = await editNotifications(item.id as number, {
        isRead: true
      });
      console.log();
      if (_res.data) {
        const _notification = _res.data as INotification;
        item.isRead = _notification.isRead;
      }
    }
  }

  seeMore() {
    if (this.options.page < this.serverSideOptions.totalPages)
      this.options.page++;
  }

  @Watch("options", { immediate: true, deep: true })
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined" && this.$auth.check()) {
      this.loading = true;
      const _notification = await getNotificationsByUser({
        page: val.page - 1,
        limit: val.itemsPerPage
      });
      this.loading = false;
      if (_notification.data) {
        this.notifications = this.notifications.concat(_notification.data.data);
        this.serverSideOptions.totalPages = _notification.data.totalPages;
        if (this.notifications.length > 0)
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onConnected(frame: any) {
    this.connected = true;
    console.log("onConnected", frame);
    this.notificationSubscribe.forEach(x => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.stompClient.subscribe(`/user${x}`, (tick: any) => {
        console.log(tick);
        this.notifications.unshift(JSON.parse(tick.body));
        this.messageCount += 1;
      });
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
