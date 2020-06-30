<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on" @click="clear()">
        <v-badge :value="messages" :content="messages" color="green" overlap>
          <v-icon dark>gavel</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-list style="max-height: 600px;" class="overflow-y-auto">
      <v-list-item v-for="(item, index) in items" :key="index" :to="item.link">
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title
            ><a>{{ item.from }}</a>
            {{
              item.type == "CREATE"
                ? "vừa thêm mới thành công"
                : item.type == "UPDATE"
                ? "vừa cập nhập thành công"
                : "vừa xóa thành công"
            }}
            {{ item.object }} cùng <a>{{ item.to }}</a>
          </v-list-item-title>
        </v-list-item-content>

        <div class="line"></div>
      </v-list-item>
      <v-row justify="center">
        <button color="primary" @click="seeMore()" v-if="count < data.length">
          See more
        </button>
      </v-row>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
  name: "Notification"
})
export default class Notification extends Vue {
  items = [] as Array<any>;
  count = 10;
  data = [
    {
      from: "Forwarder",
      type: "CREATE",
      object: "HSDT",
      to: "Merchant",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Merchant",
      type: "UPDATE",
      object: "HSMT",
      to: "Forwarder",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Forwarder",
      type: "DELETE",
      object: "HSDT",
      to: "Merchant",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Merchant",
      type: "CREATE",
      object: "HSMT",
      to: "Forwarder",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Forwarder",
      type: "UPDATE",
      object: "HSDT",
      to: "Merchant",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Merchant",
      type: "DELETE",
      object: "HSMT",
      to: "Forwarder",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Forwarder",
      type: "CREATE",
      object: "HSDT",
      to: "Merchant",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Merchant",
      type: "UPDATE",
      object: "HSMT",
      to: "Forwarder",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Forwarder",
      type: "DELETE",
      object: "HSDT",
      to: "Merchant",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Merchant",
      type: "CREATE",
      object: "HSMT",
      to: "Forwarder",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Forwarder",
      type: "UPDATE",
      object: "HSDT",
      to: "Merchant",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Merchant",
      type: "DELETE",
      object: "HSMT",
      to: "Forwarder",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Forwarder",
      type: "CREATE",
      object: "HSDT",
      to: "Merchant",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Merchant",
      type: "UPDATE",
      object: "HSMT",
      to: "Forwarder",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Forwarder",
      type: "DELETE",
      object: "HSDT",
      to: "Merchant",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Merchant",
      type: "CREATE",
      object: "HSMT",
      to: "Forwarder",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Forwarder",
      type: "UPDATE",
      object: "HSDT",
      to: "Merchant",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Merchant",
      type: "CREATE",
      object: "HSMT",
      to: "Forwarder",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Forwarder",
      type: "DELETE",
      object: "HSDT",
      to: "Merchant",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    },
    {
      from: "Merchant",
      type: "CREATE",
      object: "HSMT",
      to: "Forwarder",
      link: "/dashboard",
      icon: "dashboard",
      seen: false
    }
  ];
  messages = this.items.length;
  created() {
    this.items = this.data.slice(0, this.count);
    this.messages = 10;
  }
  seeMore() {
    this.count += 10;
    this.items = this.data.slice(0, this.count);
  }
  clear() {
    this.messages = 0;
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
