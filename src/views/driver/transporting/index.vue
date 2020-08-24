<template>
  <v-container fluid>
    <v-card
      class="d-flex justify-space-around align-start elevation-0"
      v-if="shippingInfo"
      width="100%"
    >
      <v-row justify="center">
        <UpdateShippingInfo
          v-if="shippingInfo"
          :dialogEdit.sync="dialogEdit"
          :shippingInfo="shippingInfo"
          :shippingInfos.sync="shippingInfos"
        />
        <QRCodeGenerator
          v-if="dialogQRGender"
          :dialogGender.sync="dialogQRGender"
        />
      </v-row>
      <!-- OUTOUNBD -->
      <v-card class="order-0 flex-grow-0 mx-auto mr-5" max-width="480">
        <v-tabs background-color="white" color="tertiary" left fixed-tabs>
          <v-tab>Lịch trình</v-tab>
          <v-tab>Hàng xuất</v-tab>

          <v-tab-item>
            <v-container>
              <v-card class="elevation-0" v-if="shippingInfo && inbound">
                <v-row justify="center"> </v-row>
                <GoogleMapLoader
                  :options="mapConfig"
                  :apiKey="apiKey"
                  :mapStyle="style"
                >
                  <template slot-scope="{ google, map }">
                    <GoogleMapDirection
                      v-if="shippingInfo"
                      :router="{
                        ...router,
                        travelMode: 'DRIVING'
                      }"
                      :google="google"
                      :map="map"
                    >
                    </GoogleMapDirection>
                    <GoogleMapMarker
                      v-if="shippingInfo.container.driver.location"
                      :visible="false"
                      :marker="
                        getMarkerFromPlace(
                          {
                            geometry: {
                              location: {
                                lat: parseFloat(
                                  shippingInfo.container.driver.location
                                    .latitude
                                ),
                                lng: parseFloat(
                                  shippingInfo.container.driver.location
                                    .longitude
                                )
                              }
                            }
                          },
                          shippingInfo.container.number,
                          '/local_shipping.png'
                        )
                      "
                      :google="google"
                      :map="map"
                    />
                  </template>
                </GoogleMapLoader>
                <v-card-title
                  >Lịch trình container:
                  {{ "#" + shippingInfo.container.number }}</v-card-title
                >
                <v-card-text>
                  <v-stepper
                    :value="stepper2"
                    vertical
                    class="elevation-0 pb-0"
                  >
                    <v-stepper-step step="1" complete
                      >Cảng lấy cont:
                      {{ inbound.billOfLading.portOfDelivery.fullname }}
                      <small class="mt-1"
                        >Thời gian lấy:
                        {{ formatDatetime(inbound.pickupTime) }}</small
                      >
                    </v-stepper-step>
                    <v-stepper-content step="1"></v-stepper-content>
                    <v-stepper-step step="2" :complete="stepper2 >= 2"
                      >Nơi trả hàng: {{ inbound.returnStation }}
                      <small class="mt-1"
                        >Thời gian trả:
                        {{
                          formatDatetime(inbound.billOfLading.freeTime)
                        }}</small
                      ></v-stepper-step
                    >
                    <v-stepper-content step="2"></v-stepper-content>
                    <v-stepper-step step="3" :complete="stepper2 >= 3"
                      >Nơi đóng hàng:
                      {{ shippingInfo.outbound.packingStation }}
                      <small class="mt-1"
                        >Thời gian đóng:
                        {{
                          formatDatetime(shippingInfo.outbound.packingTime)
                        }}</small
                      ></v-stepper-step
                    >
                    <v-stepper-content step="3"></v-stepper-content>
                    <v-stepper-step step="4" :complete="stepper2 >= 4"
                      >Cảng bốc hàng:
                      {{ shippingInfo.outbound.booking.portOfLoading.fullname }}
                      <small class="mt-1"
                        >Thời gian Cut-off:
                        {{
                          formatDatetime(
                            shippingInfo.outbound.booking.cutOffTime
                          )
                        }}</small
                      ></v-stepper-step
                    >
                  </v-stepper>
                </v-card-text>
              </v-card>
            </v-container>
          </v-tab-item>

          <v-tab-item>
            <v-card class="elevation-0" v-if="shippingInfo" tile>
              <v-img
                height="100"
                max-width="480"
                src="@/assets/images/background-cover.jpg"
              ></v-img>

              <v-card-title>Thông tin hàng xuất</v-card-title>

              <v-card-text>
                <v-list dense>
                  <v-subheader>Thông tin chung</v-subheader>
                  <v-list-item>
                    <v-list-item-icon>
                      <v-icon>import_export</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                      <v-list-item-title>{{
                        "Mã hàng xuất: " + shippingInfo.outbound.code
                      }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{
                          "Cảng bốc hàng: " +
                            shippingInfo.outbound.booking.portOfLoading.fullname
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
                          shippingInfo.outbound.shippingLine.companyName
                      }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{
                          "Số lượng: " +
                            shippingInfo.outbound.booking.unit +
                            " x " +
                            shippingInfo.outbound.containerType.name
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
                        "Đóng hàng tại: " + shippingInfo.outbound.packingStation
                      }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{
                          "Thời gian: " +
                            formatDatetime(shippingInfo.outbound.packingTime)
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
                          shippingInfo.outbound.grossWeight +
                          shippingInfo.outbound.unitOfMeasurement
                      }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ "Mô tả: " + shippingInfo.outbound.goodsDescription }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>
      <v-card class="order-1 flex-grow-1 mx-auto">
        <v-card-title v-if="shippingInfo">
          <div class="text-h4 text-no-wrap font-weight-bold">
            Mã đơn vận chuyển: {{ "#" + shippingInfo.id }}
          </div>
        </v-card-title>
        <v-card-subtitle class="text-h7 text-no-wrap font-weight-bold"
          >Mã hàng ghép: #1</v-card-subtitle
        >
        <v-card-text>
          <v-stepper :value="stepper" alt-labels class="elevation-0">
            <v-stepper-header>
              <v-stepper-step step="1" :complete="stepper >= 1" color="info"
                >Nhận thông tin</v-stepper-step
              >
              <v-divider></v-divider>
              <v-stepper-step
                step="2"
                :complete="stepper >= 2"
                :rules="[() => exception]"
                color="warning"
                >Đang vận chuyển
                <small v-if="exception == false">Đã có lỗi xảy ra</small>
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="3" :complete="stepper >= 3" color="success"
                >Đã giao hàng</v-stepper-step
              >
            </v-stepper-header>
          </v-stepper>
        </v-card-text>
        <v-divider></v-divider>
        <v-data-table
          :headers="shippingInfoHeaders"
          :items="shippingInfos"
          item-key="id"
          :loading="loading"
          :options.sync="shippingInfoOptions"
          :server-items-length="shippingInfoServerSideOptions.totalItems"
          :footer-props="{
            'items-per-page-options':
              shippingInfoServerSideOptions.itemsPerPageItems
          }"
          :actions-append="shippingInfoOptions.page"
          no-data-text="Danh sách shipping rỗng."
          disable-sort
          class="elevation-0"
        >
          <template v-slot:top>
            <v-toolbar flat color="white">
              <v-toolbar-title>Danh sách vận chuyển</v-toolbar-title>
            </v-toolbar>
          </template>
          <template v-slot:item.status="{ item }">
            <ChipStatus :status="item.status" />
          </template>
          <template v-slot:item.router="{ item }">
            <v-btn
              class="ma-1"
              small
              rounded
              :outlined="shippingInfo.id !== item.id"
              :color="shippingInfo.id == item.id ? 'info' : 'gray'"
              @click.stop="openDetailRouter(item)"
            >
              <v-icon left dense>location_on </v-icon>Xem
            </v-btn>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-menu :close-on-click="true">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" icon outlined v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list
                dense
                v-if="
                  [
                    'INFO_RECEIVED',
                    'SHIPPING',
                    'DELIVERED',
                    'EXCEPTION'
                  ].includes(item.status)
                "
              >
                <v-list-item
                  @click="openUpdateDialog(item)"
                  v-if="$auth.check('ROLE_FORWARDER')"
                >
                  <v-list-item-icon>
                    <v-icon small>location_on</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Cập nhật trạng thái</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item
                  @click="openQRCodeDialog(item)"
                  v-if="
                    $auth.check('ROLE_MERCHANT') &&
                      ['INFO_RECEIVED'].includes(item.status)
                  "
                >
                  <v-list-item-icon>
                    <v-icon small>stay_primary_landscape</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Tạo mã QR</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card>
    </v-card>
    <v-row v-else justify="center" align="center">
      <v-col class="text-center">
        <p>
          Bạn đang không có đơn vận nào cần chạy. Rảnh rỗi hãy ghé xem Danh sách
          vận đơn nhé!
        </p>
        <p>
          Xem Danh sách vận đơn tại
          <router-link to="/delivery">đây</router-link>
        </p></v-col
      >
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import FormValidate from "@/mixin/form-validate";
import Utils from "@/mixin/utils";
import { IInbound } from "@/entity/inbound";
import { DataOptions } from "vuetify";
import { IShippingInfo } from "@/entity/shipping-info";
import { getShippingInfosAreActive } from "@/api/shipping-info";
import { getInboundByContainer } from "@/api/inbound";
import { IPort } from "@/entity/port";
import GoogleMapLoader from "@/components/googlemaps/GoogleMapLoader.vue";
import GoogleMapDirection from "@/components/googlemaps/GoogleMapDirection.vue";
import GoogleMapMarker from "@/components/googlemaps/GoogleMapMarker.vue";
import { IBiddingDocument } from "@/entity/bidding-document";
import { google } from "google-maps";
import ChipStatus from "@/components/ChipStatus.vue";
import GoogleMapMixins from "@/components/googlemaps/map-mixins";
import QRCodeGenerator from "@/components/QRCodeGenerator.vue";
import SupplierRating from "../../supplier/bidding-document/components/SupplierRating.vue";
import UpdateShippingInfo from "../../supplier/combined/components/UpdateShippingInfo.vue";

@Component({
  mixins: [FormValidate, Utils, GoogleMapMixins],
  components: {
    SupplierRating,
    GoogleMapLoader,
    GoogleMapDirection,
    GoogleMapMarker,
    UpdateShippingInfo,
    ChipStatus,
    QRCodeGenerator
  }
})
export default class Transporting extends Vue {
  style = { "min-width": "430px", height: "250px" };
  shippingInfos: Array<IShippingInfo> = [];
  shippingInfo = null as IShippingInfo | null;
  inbound = null as IInbound | null;
  biddingDocument = null as IBiddingDocument | null;
  loading = false;
  stepper = 1;
  stepper2 = 1;
  router = null as google.maps.DirectionsRequest | null;
  exception = true;
  dialogDetail = false;
  dialogEdit = false;
  dialogAddContractDocument = false;
  dialogQRGender = false;
  status = false;
  shippingInfoOptions = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  shippingInfoServerSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  // ContractDocument
  contractDocumentOptions = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  contractDocumentServerSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };

  shippingInfoHeaders = [
    {
      text: "Mã",
      align: "start",
      sortable: false,
      value: "id"
    },
    {
      text: "Container No.",
      value: "container.number"
    },
    { text: "Lái xe", value: "container.driver.fullname" },
    { text: "SĐT liên hệ", value: "container.driver.phone" },
    {
      text: "Đầu kéo",
      value: "container.tractor.licensePlate"
    },
    {
      text: "Trạng thái",
      value: "status"
    },
    {
      text: "Lịch trình",
      value: "router"
    },
    {
      text: "Hành động",
      value: "actions"
    }
  ];
  contractDocumentHeaders = [
    {
      text: "Mã.",
      align: "start",
      sortable: false,
      value: "id"
    },
    { text: "Người gửi", value: "sender.companyName" },
    { text: "Trạng thái", value: "status" },
    { text: "Hành động", value: "actions" }
  ];

  processShippingInfo(item: IShippingInfo) {
    if (this.shippingInfo && this.inbound) {
      const _returnStation = this.inbound.returnStation;
      const _packingStation = this.shippingInfo.outbound.packingStation;
      const _portOfDelivery = this.inbound.billOfLading.portOfDelivery as IPort;
      const _portOfLoading = this.shippingInfo.outbound.booking
        .portOfLoading as IPort;
      switch (item.status) {
        case "PENDING":
          this.stepper = 0;
          this.stepper2 = 1;
          this.router = {
            origin: _portOfDelivery.address,
            destination: _returnStation
          };
          break;
        case "INFO_RECEIVED":
          this.stepper = 1;
          this.stepper2 = 2;
          this.router = {
            origin: _returnStation,
            destination: _packingStation
          };
          break;
        case "SHIPPING":
          this.stepper = 2;
          this.stepper2 = 3;
          break;
        case "DELIVERED":
          this.stepper = 3;
          this.stepper2 = 4;
          break;
        case "EXCEPTION":
          this.stepper = 2;
          this.stepper2 = 3;
          this.exception = false;
          break;
        default:
          break;
      }
      if (["SHIPPING", "DELIVERED", "EXCEPTION"].includes(item.status)) {
        this.router = {
          origin: _packingStation,
          destination: _portOfLoading.address
        };
      }
    }
  }

  @Watch("shippingInfoOptions")
  async onShippingInfoOptionsChange(val: DataOptions) {
    if (typeof val !== "undefined") {
      this.loading = true;
      const _res = await getShippingInfosAreActive({
        page: val.page - 1,
        limit: val.itemsPerPage
      });

      console.log("shipping", _res.data);
      this.loading = false;
      if (_res.data) {
        const _shippingInfos = _res.data.data;
        this.shippingInfos = _shippingInfos;
        this.shippingInfoServerSideOptions.totalItems = _res.data.totalElements;
        if (this.shippingInfos.length > 0) {
          this.shippingInfo = this.shippingInfos[0];
          await this.openDetailRouter(this.shippingInfo);
        }
      }
    }
  }

  async openDetailRouter(item: IShippingInfo) {
    this.shippingInfo = item;
    const _res = await getInboundByContainer(item.container.id as number);
    if (_res.data) {
      const _inbound = _res.data;
      this.inbound = _inbound;
    }
    this.processShippingInfo(item);
  }

  openUpdateDialog(item: IShippingInfo) {
    this.shippingInfo = item;
    this.dialogEdit = true;
  }

  openQRCodeDialog(item: IShippingInfo) {
    this.shippingInfo = item;
    this.dialogQRGender = true;
  }
  get mapConfig() {
    return {
      loaderOptions: {
        language: "vi",
        region: "VI",
        libraries: ["places", "geometry"]
      },
      mapOptions: {
        zoom: 8,
        center: { lat: 21.040201, lng: 105.83456 },
        streetViewControl: false,
        mapTypeId: "roadmap"
      }
    };
  }

  get apiKey() {
    return process.env.VUE_APP_GMAP_KEY;
  }
}
</script>
<style scoped lang="css">
a {
  text-decoration: none !important;
}
</style>
