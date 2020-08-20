<template>
  <v-menu
    offset-y
    :close-on-click="true"
    :close-on-content-click="false"
    max-height="500"
    max-width="400"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-badge
          :value="messageCount"
          :content="messageCount"
          color="warning"
          overlap
        >
          <v-icon dark> notifications_active</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-card max-width="450" class="mx-auto" v-if="$auth.user()">
      <v-list three-line avatar v-if="notifications.length > 0">
        <v-subheader
          >THÔNG BÁO<v-spacer></v-spacer>
          <v-menu left bottom :offset-y="true">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
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
        <v-divider></v-divider>
        <v-list-item-group>
          <v-list-item
            v-for="item in notifications"
            :key="item.id"
            @click="
              seenNotification(item);
              gotoNotification(item);
            "
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
        </v-list-item-group>
      </v-list>
      <v-list two-line v-else>
        <v-subheader>THÔNG BÁO</v-subheader>
        <v-divider></v-divider>
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
          color="tertiary"
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
import { NOTIFICATION_LINK } from "@/utils/constants";
import {
  getBiddingNotification,
  getNotifications,
  getReportNotification,
  editNotification
} from "@/api/notification";
import { INotification, IBiddingNotification } from "@/entity/notification";
import Utils from "@/mixin/utils";
import ChipStatus from "@/components/ChipStatus.vue";

@Component({
  mixins: [Utils],
  components: {
    ChipStatus
  }
})
export default class Notification extends Vue {
  notifications: Array<INotification> = [];
  notification = null as INotification | null;
  notificationSubscribe: Array<string> = [];
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
  messageCount = 0;

  connected = false;
  socket = null as WebSocket | null;
  stompClient = null as Client | null;

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
    } else if (item.type == "REPORT") {
      const _res = await getReportNotification(item.id as number);
      if (_res.data) ROUTER = `/report/${_res.data.relatedResource.id}`;
    } else if (item.type == "SHIPPINGLINE") {
      ROUTER = "/borrow-notify";
    }
    if (location.pathname == ROUTER) {
      location.reload();
    } else {
      this.$router.push(ROUTER);
    }
    return;
  }

  seenAllNotification() {
    this.notifications.filter(async x => {
      if (x.isRead == false) {
        await this.seenNotification(x);
      }
    });
  }

  async seenNotification(item: INotification) {
    if (item.isRead == false) {
      const _res = await editNotification(item.id as number, {
        isRead: true
      });
      if (_res.data) {
        const _notification = _res.data.data as INotification;
        item.isRead = _notification.isRead;
        if (this.messageCount > 0) this.messageCount -= 1;
      }
    }
  }

  seeMore() {
    if (this.options.page < this.serverSideOptions.totalPages)
      this.options.page++;
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
        if (this.notifications.length > 0)
          this.messageCount = this.notifications.filter(x => !x.isRead).length;
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
          this.messageCount += 1;
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
    } else if (this.$auth.check(["ROLE_FORWARDER", "ROLE_MERCHANT"])) {
      this.notificationSubscribe.push(
        NOTIFICATION_LINK.BIDDING,
        NOTIFICATION_LINK.REPORT
      );
    } else if (this.$auth.check("ROLE_SHIPPINGLINE")) {
      this.notificationSubscribe.push(NOTIFICATION_LINK.SHIPPING_LINE);
    } else if (this.$auth.check("ROLE_DRIVER")) {
      this.notificationSubscribe.push(NOTIFICATION_LINK.DRIVER);
    } else {
      console.log("You're not in subscribe list!");
    }
    console.log(this.notificationSubscribe);
    if (this.notificationSubscribe.length > 0) this.connect();
  }
}
</script>
