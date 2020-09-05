<template>
  <v-container fluid>
    <v-dialog v-model="dialogDetailSync" max-width="600">
      <v-card v-if="outbound" class="elevation-0" tile>
        <v-img
          height="100"
          max-width="600"
          src="@/assets/images/background-cover.jpg"
        ></v-img>
        <v-card-title>Thông tin hàng xuất</v-card-title>
        <v-divider inset></v-divider>
        <v-card-text>
          <v-list dense>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>import_export</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  "Mã hàng xuất: " + outbound.code
                }}</v-list-item-title>
                <v-list-item-subtitle
                  >{{
                    "Khối lượng: " +
                      outbound.grossWeight +
                      outbound.unitOfMeasurement
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
                  "Hãng tàu: " + outbound.shippingLine.companyName
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    "Số lượng Cont: " +
                      outbound.booking.unit +
                      " x " +
                      outbound.containerType.name
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
                  "Đóng hàng tại: " + outbound.packingStation
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ "Thời gian: " + formatDatetime(outbound.packingTime) }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>home_work</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  {{
                    "Cảng bốc hàng: " + outbound.booking.portOfLoading.fullname
                  }}</v-list-item-title
                >
                <v-list-item-subtitle>
                  {{ "Mô tả: " + outbound.goodsDescription }}
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
import { IOutbound } from "@/entity/outbound";
import Utils from "@/mixin/utils";

@Component({
  mixins: [Utils]
})
export default class DetailOutbound extends Vue {
  @Prop() outbound!: IOutbound;
  @PropSync("dialogDetail", { type: Boolean }) dialogDetailSync!: boolean;
}
</script>
