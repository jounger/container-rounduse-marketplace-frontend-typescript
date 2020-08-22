<template>
  <v-container fluid>
    <v-dialog v-model="dialogDetailSync" max-width="600">
      <v-card v-if="inbound" class="elevation-0" tile>
        <v-img
          height="100"
          max-width="600"
          src="@/assets/images/background-cover.jpg"
        ></v-img>
        <v-card-title>Thông tin hàng nhập</v-card-title>
        <v-card-text>
          <v-list dense>
            <v-subheader>Thông tin chung</v-subheader>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>import_export</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  "Mã hàng nhập: " + inbound.code
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    "Cảng lấy hàng: " +
                      inbound.billOfLading.portOfDelivery.fullname
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>directions_boat</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  "Hãng tàu: " + inbound.shippingLine.companyName
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    "Số lượng: " +
                      inbound.billOfLading.unit +
                      " x " +
                      inbound.containerType.name
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>location_on</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  "Trả hàng tại: " + inbound.returnStation
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    "Thời gian (khoảng): " +
                      formatDatetime(inbound.billOfLading.freeTime)
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions class="justify-space-between">
          <v-btn @click="dialogDetailSync = false">
            Trở vể
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { IInbound } from "@/entity/inbound";
import Utils from "@/mixin/utils";

@Component({
  mixins: [Utils]
})
export default class DetailInbound extends Vue {
  @Prop() inbound!: IInbound;
  @PropSync("dialogDetail", { type: Boolean }) dialogDetailSync!: boolean;
}
</script>
