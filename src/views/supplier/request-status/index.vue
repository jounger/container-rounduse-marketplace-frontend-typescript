<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col class="text-center">
          <p>
            Tài khoản của bạn đang được xác thực bởi các Quản trị viên. Vui lòng
            chờ phản hồi qua email!
          </p>
          <p>Xem chi tiết đơn đăng ký tại <a @click="showDialog">đây</a></p>
        </v-col>
      </v-row>
    </v-container>
    <v-row justify="center">
      <RequestDetail :profile="profile" :dialog.sync="dialog" />
    </v-row>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue, PropSync } from "vue-property-decorator";
import NavLayout from "@/layouts/NavLayout.vue";
import { UserEntity } from "@/store/definitions/user";
import UserModule from "@/store/modules/user";
import RequestDetail from "./components/RequestDetail.vue";

@Component({
  name: "RequestStatus",
  components: {
    RequestDetail
  }
})
export default class RequestStatus extends Vue {
  @PropSync("layout") layoutSync!: object;
  public profile: UserEntity = {
    username: "",
    password: "",
    email: "",
    phone: "",
    role: [""],
    status: ""
  };
  dialog = false;
  created() {
    this.layoutSync = NavLayout;
  }
  public showDialog() {
    if (UserModule.getCurrentUser != null) {
      this.profile = UserModule.getCurrentUser;
    }
    this.dialog = true;
  }
}
</script>
