<template>
  <section style="height:280px">
    <v-container>
      <v-row>
        <v-col cols="12" md="8">
          <h4 class="black--text display-1 ml-0 mb-5">
            Chào mừng
            {{
              $auth.user().status == "ACTIVE"
                ? "trở lại "
                : "tham gia với chúng tôi "
            }},
            <router-link to="/profile"
              ><span class="username">{{
                $auth.user().fullname
              }}</span></router-link
            >
          </h4>
          <div class="line"></div>
          <h4
            class="black--text subheading ml-0 ma-3"
            v-if="$auth.user().status == 'ACTIVE'"
          >
            Bạn đang dùng version <span class="version">1.0</span>. Bắt đầu khám
            phá nào!
          </h4>
          <h4 class="black--text subheading ml-0 ma-3" v-else>
            Bạn đang dùng version <span class="version">1.0</span>. Đơn đăng ký
            của bạn đang được xem xét. Xem chi tiết tại mục
            <router-link to="/application">Đơn đăng ký!</router-link>
          </h4>
          <div
            v-if="
              $auth.user().status == 'ACTIVE' && $auth.check('ROLE_MERCHANT')
            "
          >
            <h4 class="subheading">Xem ngay danh sách Hồ sơ mời thầu</h4>
            <v-btn class="mt-5" color="secondary" to="/bidding-document"
              >Xem ngay</v-btn
            >
          </div>
          <div
            v-if="$auth.user().status == 'ACTIVE' && $auth.check('ROLE_ADMIN')"
          >
            <h4 class="subheading">Xem ngay danh sách Quản trị viên</h4>
            <v-btn class="mt-5" color="secondary" to="/operator"
              >Xem ngay</v-btn
            >
          </div>
          <div
            v-if="
              $auth.user().status == 'ACTIVE' && $auth.check('ROLE_MODERATOR')
            "
          >
            <h4 class="subheading">Xem ngay danh sách Đơn đăng ký</h4>
            <v-btn class="mt-5" color="secondary" to="/supplier-register"
              >Xem ngay</v-btn
            >
          </div>
          <div
            v-if="
              $auth.user().status == 'ACTIVE' && $auth.check('ROLE_FORWARDER')
            "
          >
            <h4 class="subheading">Xem ngay danh sách Hồ sơ dự thầu</h4>
            <v-btn class="mt-5" color="secondary" to="/bid">Xem ngay</v-btn>
          </div>
          <div
            v-if="
              $auth.user().status == 'ACTIVE' &&
                $auth.check('ROLE_SHIPPINGLINE')
            "
          >
            <h4 class="subheading">
              Xem ngay danh sách Thông báo mượn Container
            </h4>
            <v-btn class="mt-5" color="secondary" to="/borrow-notify"
              >Xem ngay</v-btn
            >
          </div>
          <div
            v-if="$auth.user().status == 'ACTIVE' && $auth.check('ROLE_DRIVER')"
          >
            <h4 class="subheading">
              Xem ngay danh sách Hàng đang vận chuyển
            </h4>
            <v-btn class="mt-5" color="secondary" to="/shipping"
              >Xem ngay</v-btn
            >
          </div>
        </v-col>
        <v-col cols="12" md="4">
          <v-img
            height="180"
            width="200"
            src="@/assets/images/welcome.jpg"
          ></v-img>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Welcome extends Vue {}
</script>
<style scoped lang="css">
section {
  background-color: #cbe4d6 !important;
}
.subheading {
  font-size: 22px !important;
  font-weight: 300;
}
.line {
  content: "";
  width: 40%;
  height: 4px;
  background: #eea632;
  display: block;
}
a {
  color: #037243;
  text-decoration: none !important;
}
a:hover {
  font-weight: bold;
}
.version {
  color: red;
}
</style>
