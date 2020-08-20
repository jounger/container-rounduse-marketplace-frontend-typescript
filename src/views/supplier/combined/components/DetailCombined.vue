<template>
  <v-container fluid>
    <DetailContractDocument
      v-if="dialogDetail"
      :dialogDetail.sync="dialogDetail"
      :contractDocuments.sync="contractDocuments"
      :status.sync="status"
      :contractDocument="contractDocument"
    />
    <CreateContractDocument
      v-if="dialogAddContractDocument"
      :dialogAdd.sync="dialogAddContractDocument"
      :contractDocuments.sync="contractDocuments"
      :status.sync="status"
      :totalItems.sync="contractDocumentServerSideOptions.totalItems"
      :contract="contract"
    />
    <v-row justify="center">
      <UpdateShippingInfo
        v-if="shippingInfo"
        :dialogEdit.sync="dialogEdit"
        :shippingInfo="shippingInfo"
        :shippingInfos.sync="shippingInfos"
      />
    </v-row>
    <v-card
      class="d-flex justify-space-around align-start elevation-0"
      v-if="combined"
      width="100%"
    >
      <!-- OUTOUNBD -->
      <v-card class="order-0 flex-grow-0 mx-auto mr-5" max-width="480">
        <v-tabs
          background-color="white"
          color="deep-purple accent-4"
          left
          fixed-tabs
        >
          <v-tab>Lịch trình</v-tab>
          <v-tab>Hàng xuất</v-tab>
          <v-tab>Hợp đồng</v-tab>

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
          <v-tab-item>
            <v-card class="elevation-0" v-if="combined" tile>
              <v-img
                height="100"
                max-width="480"
                src="@/assets/images/background-cover.jpg"
              ></v-img>
              <v-card-title>Thông tin Hợp đồng</v-card-title>
              <v-card-text>
                Thông tin Chủ xe:
                <SupplierRating :supplier="combined.bid.bidder" />
              </v-card-text>

              <v-subheader>Thông tin chung</v-subheader>
              <v-list dense>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>monetization_on</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title v-if="biddingDocument">{{
                      "Bên chủ hàng: " + biddingDocument.offeree.companyName
                    }}</v-list-item-title>
                    <v-list-item-subtitle>
                      {{ "Bên chủ xe: " + combined.bid.bidder.companyName }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <v-list-item>
                  <v-list-item-icon>
                    <v-icon>monetization_on</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      >Yêu cầu hợp đồng :
                      {{
                        combined.contract.required ? "Có" : "Không"
                      }}</v-list-item-title
                    >
                    <v-list-item-subtitle v-if="combined.contract.required">
                      {{
                        "Tiền phạt: " +
                          combined.contract.finesAgainstContractViolation +
                          "%"
                      }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <v-list dense v-if="combined.contract.required">
                <v-data-table
                  :headers="contractDocumentHeaders"
                  :items="contractDocuments"
                  item-key="id"
                  :loading="loading"
                  :options.sync="contractDocumentOptions"
                  :server-items-length="
                    contractDocumentServerSideOptions.totalItems
                  "
                  :footer-props="{
                    'items-per-page-options':
                      contractDocumentServerSideOptions.itemsPerPageItems
                  }"
                  :actions-append="contractDocumentOptions.page"
                  no-data-text="Danh sách file Hợp đồng rỗng."
                  disable-sort
                  class="elevation-0"
                >
                  <template v-slot:top>
                    <v-toolbar flat color="white">
                      <v-toolbar-title>Danh sách file hợp đồng</v-toolbar-title>
                      <v-divider class="mx-4" inset vertical></v-divider>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        @click="dialogAddContractDocument = true"
                      >
                        Thêm mới
                      </v-btn>
                    </v-toolbar>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-btn
                      class="ma-1"
                      x-small
                      tile
                      outlined
                      color="info"
                      @click.stop="openDetailContractDocument(item)"
                    >
                      <v-icon left>remove_red_eye </v-icon>Chi tiết
                    </v-btn>
                  </template>
                </v-data-table>
              </v-list>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>
      <v-card class="order-1 flex-grow-1 mx-auto">
        <v-card-title v-if="shippingInfo">
          Thông tin vận chuyển: {{ "#" + shippingInfo.id }}
        </v-card-title>
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
                color="deep-purple"
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
              tile
              :outlined="shippingInfo.id !== item.id"
              :color="shippingInfo.id == item.id ? 'info' : 'gray'"
              @click.stop="openDetailRouter(item)"
            >
              <v-icon left dense>location_on </v-icon>Xem
            </v-btn>
          </template>
          <template
            v-slot:item.actions="{ item }"
            v-if="$auth.check('ROLE_FORWARDER')"
          >
            <v-menu :close-on-click="true">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" icon outlined v-bind="attrs" v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item @click="openUpdateDialog(item)">
                  <v-list-item-icon>
                    <v-icon small>location_on</v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title>Cập nhật trạng thái</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </v-data-table>
      </v-card>
    </v-card>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import FormValidate from "@/mixin/form-validate";
import Utils from "@/mixin/utils";
import { ICombined } from "@/entity/combined";
import { IContractDocument } from "@/entity/contract-document";
import { getContractDocumentsByContract } from "@/api/contract-document";
import CreateContractDocument from "./CreateContractDocument.vue";
import DetailContractDocument from "./DetailContractDocument.vue";
import { IInbound } from "@/entity/inbound";
import { DataOptions } from "vuetify";
import SupplierRating from "../../bidding-document/components/SupplierRating.vue";
import { IContract } from "@/entity/contract";
import { IShippingInfo } from "@/entity/shipping-info";
import { getShippingInfosByCombined } from "@/api/shipping-info";
import { getInboundByContainer } from "@/api/inbound";
import { getCombined } from "@/api/combined";
import { IPort } from "@/entity/port";
import GoogleMapLoader from "@/components/googlemaps/GoogleMapLoader.vue";
import GoogleMapDirection from "@/components/googlemaps/GoogleMapDirection.vue";
import { IBiddingDocument } from "@/entity/bidding-document";
import { getBiddingDocumentByCombined } from "@/api/bidding-document";
import { google } from "google-maps";
import ChipStatus from "@/components/ChipStatus.vue";
import UpdateShippingInfo from "./UpdateShippingInfo.vue";

@Component({
  mixins: [FormValidate, Utils],
  components: {
    CreateContractDocument,
    DetailContractDocument,
    SupplierRating,
    GoogleMapLoader,
    GoogleMapDirection,
    UpdateShippingInfo,
    ChipStatus
  }
})
export default class DetailCombined extends Vue {
  style = { "min-width": "430px", height: "250px" };
  combined = null as ICombined | null;
  shippingInfos: Array<IShippingInfo> = [];
  shippingInfo = null as IShippingInfo | null;
  contractDocument = null as IContractDocument | null;
  contractDocuments: Array<IContractDocument> = [];
  inbound = null as IInbound | null;
  contract = null as IContract | null;
  biddingDocument = null as IBiddingDocument | null;
  loading = false;
  stepper = 1;
  stepper2 = 1;
  router = null as google.maps.DirectionsRequest | null;
  exception = true;
  dialogDetail = false;
  dialogEdit = false;
  dialogAddContractDocument = false;
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
    { text: "SĐT Lái xe", value: "container.driver.phone" },
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

  @Watch("shippingInfoOptions", { immediate: true })
  async onShippingInfoOptionsChange(val: DataOptions) {
    if (typeof val !== "undefined") {
      this.loading = true;
      const _res = await getShippingInfosByCombined(this.getRouterId, {
        page: val.page - 1,
        limit: val.itemsPerPage
      });
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

  get getRouterId() {
    const combinedId = this.$route.params.id;
    if (combinedId) return parseInt(combinedId);
    return -1;
  }

  @Watch("getRouterId", { immediate: true })
  async onGetRouterIdChange() {
    const _res = await getCombined(this.getRouterId);
    if (_res.data) {
      const _combined = _res.data;
      this.combined = _combined;
      this.contract = _combined.contract;
      const _res_ = await getBiddingDocumentByCombined(_combined.id);
      if (_res_.data) {
        const _biddingDocument = _res_.data;
        this.biddingDocument = _biddingDocument;
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

  openDetailContractDocument(item: IContractDocument) {
    this.contractDocument = item;
    this.dialogDetail = true;
  }

  @Watch("contractDocumentOptions", { immediate: true })
  async onContractDocumentOptionsChange(val: DataOptions) {
    if (typeof val != "undefined" && this.contract) {
      this.loading = true;
      const _res = await getContractDocumentsByContract(
        this.contract.id as number,
        {
          page: val.page - 1,
          limit: val.itemsPerPage
        }
      );
      if (_res.data) {
        const _contractDocuments = _res.data.data;
        this.contractDocuments = _contractDocuments;
        this.contractDocumentServerSideOptions.totalItems =
          _res.data.totalElements;
      }
      this.loading = false;
    }
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
