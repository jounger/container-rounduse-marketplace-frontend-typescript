<template>
  <v-container fluid>
    <v-dialog v-model="dialogDetailSync" max-width="600">
      <v-card v-if="biddingDocument" class="elevation-0" tile>
        <v-img
          height="100"
          max-width="600"
          src="@/assets/images/background-cover.jpg"
        ></v-img>
        <v-card-title>Hồ sơ mời thầu</v-card-title>
        <v-card-text>
          Chủ hàng xuất:
          <SupplierRating :supplier="biddingDocument.offeree" />

          <v-list dense>
            <v-subheader>Thông tin HSMT</v-subheader>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>monetization_on</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  "Giá gói thầu: " +
                    currencyFormatter(
                      biddingDocument.bidPackagePrice,
                      biddingDocument.currencyOfInvoice
                    )
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    "Giá sàn: " +
                      currencyFormatter(
                        biddingDocument.bidFloorPrice,
                        biddingDocument.currencyOfInvoice
                      )
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>date_range</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  "Mở thầu: " + formatDatetime(biddingDocument.bidOpening)
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    "Đóng thầu: " + formatDatetime(biddingDocument.bidClosing)
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-list dense>
            <v-subheader>Thông tin Hàng Xuất</v-subheader>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>import_export</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  "Mã hàng xuất: " + biddingDocument.outbound.code
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    "Cảng bốc hàng: " +
                      biddingDocument.outbound.booking.portOfLoading.fullname
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
                  "Hãng tàu: " +
                    biddingDocument.outbound.shippingLine.companyName
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    "Số lượng: " +
                      biddingDocument.outbound.booking.unit +
                      " x " +
                      biddingDocument.outbound.containerType.name
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
                  "Đóng hàng tại: " + biddingDocument.outbound.packingStation
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    "Thời gian: " +
                      formatDatetime(biddingDocument.outbound.packingTime)
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>description</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{
                  "Khối lượng: " +
                    biddingDocument.outbound.grossWeight +
                    biddingDocument.outbound.unitOfMeasurement
                }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{ "Mô tả: " + biddingDocument.outbound.goodsDescription }}
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
import { IBiddingDocument } from "@/entity/bidding-document";
import Utils from "@/mixin/utils";
import SupplierRating from "./SupplierRating.vue";

@Component({
  mixins: [Utils],
  components: {
    SupplierRating
  }
})
export default class ReportBiddingDocument extends Vue {
  @Prop() biddingDocument!: IBiddingDocument;
  @PropSync("dialogDetail", { type: Boolean }) dialogDetailSync!: boolean;
}
</script>
