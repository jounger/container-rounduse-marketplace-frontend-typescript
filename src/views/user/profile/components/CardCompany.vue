<template>
  <v-card class="order-1 flex-grow-1 mx-auto my-12" v-if="$auth.user()">
    <v-card-title
      ><v-icon
        large
        v-if="
          $auth.user() &&
            $auth.user().roles[0] != 'ROLE_ADMIN' &&
            $auth.user().roles[0] != 'ROLE_MODERATOR'
        "
        >business_center</v-icon
      ><span style="margin-left:10px;">
        {{
          $auth.user().roles[0] == "ROLE_ADMIN"
            ? "Thông tin Admin"
            : $auth.user().roles[0] == "ROLE_MODERATOR"
            ? "Thông tin Quản trị viên"
            : "Thông tin Công ty"
        }}</span
      ><v-spacer></v-spacer>
      <v-tooltip left v-if="$auth.user() && $auth.user().status == 'PENDING'">
        <template v-slot:activator="{ on, attrs }">
          <v-icon large v-bind="attrs" v-on="on" style="color:gold;"
            >report_problem</v-icon
          >
        </template>
        <span>Hồ sơ của bạn chưa được xác nhận bởi Quản trị viên.</span>
      </v-tooltip>
    </v-card-title>

    <v-divider inset></v-divider>
    <v-row>
      <v-col cols="12" md="6">
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="indigo">verified_user</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-subtitle>Mã Công ty</v-list-item-subtitle>
            <v-list-item-title>{{
              profile ? profile.companyCode : ""
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="12" md="6">
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="indigo">contacts</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-subtitle>Tên Công ty</v-list-item-subtitle>
            <v-list-item-title>{{
              profile ? profile.companyName : ""
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="indigo">copyright</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-subtitle>Website</v-list-item-subtitle>
            <v-list-item-title>{{
              profile ? profile.website : ""
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="12" md="6">
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="indigo">location_city</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-subtitle>Địa chỉ công ty</v-list-item-subtitle>
            <v-list-item-title>{{
              profile ? profile.companyAddress : ""
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6">
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="indigo">card_travel</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-subtitle>Mã số thuế</v-list-item-subtitle>
            <v-list-item-title>{{
              profile ? profile.tin : ""
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="12" md="6">
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="indigo">perm_phone_msg</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-subtitle>Fax</v-list-item-subtitle>
            <v-list-item-title>{{
              profile ? profile.fax : ""
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6"
        ><v-list-item>
          <v-list-item-icon>
            <v-icon color="indigo">description</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-subtitle>Mô tả</v-list-item-subtitle>
            <v-list-item-title>{{
              profile ? profile.companyDescription : ""
            }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { IUser } from "@/entity/user";
import { getSupplier } from "@/api/supplier";
import { IOperator } from "@/entity/operator";
import { ISupplier } from "@/entity/supplier";

@Component
export default class CardCompany extends Vue {
  public profile: IUser | IOperator | ISupplier | null = null;

  async created() {
    if (
      this.$auth.user().roles[0] == "ROLE_MERCHANT" ||
      this.$auth.user().roles[0] == "ROLE_FORWARDER" ||
      this.$auth.user().roles[0] == "ROLE_SHIPPINGLINE"
    ) {
      const _res = await getSupplier(this.$auth.user().username);
      if (_res.data) {
        const _supplier = _res.data;
        this.profile = _supplier;
      }
    }
  }
}
</script>
