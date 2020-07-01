<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-badge
          :value="messageCount"
          :content="messageCount"
          color="green"
          overlap
        >
          <v-icon dark>gavel</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-card max-width="450" class="mx-auto">
      <v-toolbar color="cyan" dark>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title>Notification</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-toolbar>

      <v-list three-line>
        <v-divider></v-divider>
        <v-list-item
          v-for="item in notifications"
          :key="item.id"
          :to="gotoNotification(item)"
        >
          <v-list-item-avatar>
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
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { IBiddingNotification } from "@/entity/bidding-notification";
import { getBiddingNotificationsByUser } from "../api/notification";
import { PaginationResponse } from "../api/payload";

@Component
export default class Notification extends Vue {
  notifications: Array<IBiddingNotification> = [];
  notification = {} as IBiddingNotification;
  options = {
    descending: true,
    page: 1,
    itemsPerPage: 5,
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  loading = false;
  messageCount = 0;

  gotoNotification(item: IBiddingNotification) {
    const ROUTER = "/bidding-document";
    return `${ROUTER}/${item.relatedResource.id}`;
  }

  @Watch("options", { deep: true })
  onOptionsChange(val: object, oldVal: object) {
    console.log(this.$auth.user());
    if (val !== oldVal) {
      getBiddingNotificationsByUser({
        page: this.options.page - 1,
        limit: this.options.itemsPerPage
      })
        .then(res => {
          const response: PaginationResponse<IBiddingNotification> = res.data;
          this.notifications = response.data;
          this.options.totalItems = response.totalElements;
          this.messageCount = this.notifications.length;
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false));
    }
  }

  mounted() {
    getBiddingNotificationsByUser({
      page: this.options.page - 1,
      limit: this.options.itemsPerPage
    })
      .then(res => {
        const response: PaginationResponse<IBiddingNotification> = res.data;
        this.notifications = response.data;
        this.options.totalItems = response.totalElements;
      })
      .catch(err => console.log(err))
      .finally(() => (this.loading = false));
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
