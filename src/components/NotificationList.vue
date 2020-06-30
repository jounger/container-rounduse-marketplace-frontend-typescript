<template>
  <div class="notifications-list">
    <NotificationMessage
      v-for="notification in notifications"
      :key="notification.id"
      :notification="notification"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import NotificationMessage from "./NotificationMessage.vue";

@Component({
  components: {
    NotificationMessage
  }
})
export default class NotificationList extends Vue {
  notifications = []
}
</script>
<style>
.notifications-list {
  position: fixed;
  bottom: 0;
  right: 0;
  margin-right: 15px;
  width: 320px;
}
</style>
