<template>
  <v-card class="order-1 flex-grow-1 mx-auto">
    <div v-if="supplier">
      <v-card-title> Thông tin nhà cung cấp </v-card-title>
      <v-divider></v-divider>
      <v-row>
        <v-col cols="12" md="6">
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="indigo">verified_user</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-subtitle>Mã Công ty</v-list-item-subtitle>
              <v-list-item-title>{{
                supplier.companyCode || "N/A"
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
                supplier.companyName || "N/A"
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
                supplier.website || "N/A"
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
                supplier.companyAddress || "N/A"
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
              <v-list-item-title>{{ supplier.tin || "N/A" }}</v-list-item-title>
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
              <v-list-item-title>{{ supplier.fax || "N/A" }}</v-list-item-title>
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
                supplier.companyDescription || "N/A"
              }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getSupplier } from "@/api/supplier";
import { ISupplier } from "@/entity/supplier";

@Component
export default class CardCompany extends Vue {
  public supplier = null as ISupplier | null;

  async created() {
    if (
      this.$auth.check(["ROLE_FORWARDER", "ROLE_MERCHANT", "ROLE_SHIPPINGLINE"])
    ) {
      const _res = await getSupplier(this.$auth.user().username);
      if (_res.data) {
        const _supplier = _res.data;
        this.supplier = _supplier;
      }
    }
  }
}
</script>
