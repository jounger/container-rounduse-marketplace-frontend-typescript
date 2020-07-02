<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col class="text-center">
          <p>
            Tài khoản của bạn đang được xác thực bởi các Quản trị viên. Vui lòng
            chờ phản hồi qua email!
          </p>
          <p>
            Xem chi tiết đơn đăng ký tại
            <a @click="openDetailDialog()">đây</a>
          </p>
        </v-col>
      </v-row>
    </v-container>
    <v-row justify="center">
      <RequestDetail v-if="dialog" :dialog.sync="dialog" />
    </v-row>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ISupplier } from "@/entity/supplier";
import RequestDetail from "./components/RequestDetail.vue";

@Component({
  components: {
    RequestDetail
  }
})
export default class Application extends Vue {
  public supplier: ISupplier | null = null;
  dialog = false;
  public openDetailDialog() {
    this.dialog = true;
  }
}
</script>
