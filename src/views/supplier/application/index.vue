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
      <RequestDetail v-if="dialog" :supplier="supplier" :dialog.sync="dialog" />
    </v-row>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import { ISupplier } from "@/entity/supplier";
import RequestDetail from "./components/RequestDetail.vue";
import { getSuppliersByUsername } from "../../../api/supplier";

@Component({
  components: {
    RequestDetail
  }
})
export default class Application extends Vue {
  @PropSync("layout") layoutSync!: object;
  public supplier: ISupplier | null = null;
  dialog = false;
  created() {
    this.layoutSync = NavLayout;
  }
  public openDetailDialog() {
    getSuppliersByUsername(this.$auth.user().username)
      .then(res => {
        const response: ISupplier = res.data;
        this.supplier = response;
      })
      .catch(err => console.log(err));
    this.dialog = true;
  }
}
</script>
