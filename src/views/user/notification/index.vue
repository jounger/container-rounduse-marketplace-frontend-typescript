<template>
  <v-content>
    <v-card max-width="450" class="mx-auto">
      <v-toolbar color="cyan" dark>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>

        <v-toolbar-title>Inbox</v-toolbar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-toolbar>

      <v-list three-line>
        <v-divider></v-divider>
        <v-list-item v-for="item in notifications" :key="item.id">
          <v-list-item-avatar>
            <!-- <v-img :src="item.avatar"></v-img> -->
            {{ item.recipient }}
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-html="item.message"></v-list-item-title>
            <v-list-item-subtitle v-html="item.CREATED"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import { IBiddingNotification } from "@/entity/bidding-notification";
import { IBiddingNotificationData } from "./data";

import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

@Component
export default class NotificationSetting extends Vue {
  @PropSync("layout") layoutSync!: object;
  public notifications: Array<IBiddingNotification> = [];
  public notification = {} as IBiddingNotification;

  connected = false;
  socket = {} as WebSocket;
  stompClient = {} as any;

  connect() {
    this.socket = new SockJS("http://localhost:8085/stomp");
    this.stompClient = Stomp.over(this.socket);
    this.stompClient.connect(
      { Authorization: `Bearer ${this.$auth.token()}` },
      (frame: any) => {
        this.connected = true;
        console.log(frame);
        this.stompClient.subscribe(
          "/user/queue/bidding-notification",
          (tick: any) => {
            console.log(tick);
            this.notifications.push(JSON.parse(tick.body));
          }
        );
      },
      (error: any) => {
        console.log(error);
        this.connected = false;
      }
    );
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
    if (this.layoutSync !== NavLayout) this.layoutSync = NavLayout;
  }

  mounted() {
    this.notifications = IBiddingNotificationData;
    this.connect();
  }
}
</script>
