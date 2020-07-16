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

      <v-list three-line>
        <v-list-item v-if="notifications.length == 0">
          <v-list-item-content>
            {{ "Không có thông báo mới!" }}
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="item in notifications"
          :key="item.id"
          :to="gotoNotification(item)"
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
        <v-pagination
          v-model="options.page"
          :length="serverSideOptions.totalPages"
          :total-visible="0"
          circle
        ></v-pagination>
      </div>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { IBiddingNotification } from "@/entity/bidding-notification";
import { getBiddingNotificationsByUser } from "../api/notification";
import { PaginationResponse } from "../api/payload";

import SockJS from "sockjs-client";
import Stomp, { Client } from "webstomp-client";
import { DataOptions } from "vuetify";

@Component
export default class Notification extends Vue {
  notifications: Array<IBiddingNotification> = [];
  notification = {} as IBiddingNotification;
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
  messageCount = 1;

  connected = false;
  socket = {} as WebSocket;
  stompClient = {} as Client;

  gotoNotification(item: IBiddingNotification) {
    let ROUTER = "#";
    switch (item.type) {
      case "ADDED":
        ROUTER = "/bidding-document";
        break;
    }
    return `${ROUTER}/${item.relatedResource.id}`;
  }

  seenNotification() {
    this.messageCount = 0;
  }

  @Watch("options")
  onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined" && this.$auth.check()) {
      this.loading = true;
      getBiddingNotificationsByUser({
        page: val.page - 1,
        limit: val.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IBiddingNotification> = res.data;
          console.log("watch", response);
          this.notifications = response.data;
          this.serverSideOptions.totalPages = response.totalPages;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }

  connect() {
    this.socket = new SockJS("http://localhost:8085/stomp");
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
    console.log(frame);
    this.stompClient.subscribe(
      "/user/queue/bidding-notification",
      (tick: any) => {
        console.log(tick);
        this.notifications.unshift(JSON.parse(tick.body));
        this.messageCount += 1;
      }
    );
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

  created() {
    // INIT NOTIFICATION
    if (this.$auth.check()) {
      getBiddingNotificationsByUser({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IBiddingNotification> = res.data;
          this.notifications = response.data;
          this.serverSideOptions.totalPages = response.totalPages;
          this.messageCount = this.notifications.filter(
            x => x.isRead == false
          ).length;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }

  mounted() {
    // CONNECT WEBSOCKET
    if (this.$auth.check()) {
      this.connect();
    }
  }
}
</script>
<style type="text/css">
.line {
  margin-top: 10px;
  width: 475px;
  border-bottom: 1px solid black;
  position: absolute;
}
</style>
