<template>
  <div>Đang đăng xuất...</div>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Logout extends Vue {
  created() {
    this.$auth.logout();
  }
}
</script>
