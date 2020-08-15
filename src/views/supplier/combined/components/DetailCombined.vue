<template>
  <v-content>
    <DetailEvidence
      v-if="dialogDetail"
      :dialogDetail.sync="dialogDetail"
      :evidences.sync="evidences"
      :checkValid.sync="checkValid"
      :finalEvidence="finalEvidence"
      :evidence="evidence"
    />
    <v-container
      class="d-flex justify-space-around align-start"
      v-if="combined"
    >
      <!-- OUTOUNBD -->
      <v-card class="order-0 flex-grow-0 mx-auto mr-5 my-5" max-width="500">
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
            <v-container fluid>
              <v-card class="elevation-0" v-if="shippingInfo && inbound">
                <v-row justify="center"> </v-row>
                <!-- <v-img
                  height="250"
                  src="@/assets/images/google-maps-directions.jpg"
                ></v-img> -->
                <GoogleMapLoader
                  :options="mapConfig"
                  :apiKey="apiKey"
                  :mapStyle="style"
                >
                  <template slot-scope="{ google, map }">
                    <GoogleMapDirection
                      v-if="shippingInfo"
                      :router="{
                        origin: shippingInfo.outbound.packingStation,
                        destination: getPortAddress(
                          shippingInfo.outbound.booking.portOfLoading.fullname
                        ),
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
                  <v-stepper value="2" vertical class="elevation-0 pb-0">
                    <v-stepper-step step="1" complete
                      >Cảng lấy cont:
                      {{ inbound.billOfLading.portOfDelivery.fullname }}
                      <small class="mt-1"
                        >Thời gian lấy:
                        {{ formatDatetime(inbound.pickupTime) }}</small
                      >
                    </v-stepper-step>
                    <v-stepper-content step="1"></v-stepper-content>
                    <v-stepper-step step="2"
                      >Nơi trả hàng: {{ inbound.returnStation }}
                      <small class="mt-1"
                        >Thời gian trả:
                        {{
                          formatDatetime(inbound.billOfLading.freeTime)
                        }}</small
                      ></v-stepper-step
                    >
                    <v-stepper-content step="2"></v-stepper-content>
                    <v-stepper-step step="3"
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
                    <v-stepper-step step="4"
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
            <v-container fluid v-if="shippingInfo">
              <v-card class="elevation-0">
                <v-img
                  height="100"
                  src="@/assets/images/biddingdocument.jpg"
                ></v-img>

                <v-card-title>Thông tin hàng xuất</v-card-title>

                <v-card-text>
                  <v-list dense>
                    <v-subheader>Thông tin chung</v-subheader>
                    <v-list-item>
                      <v-list-item-icon>
                        <v-icon>child_friendly</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>{{
                          "Mã hàng xuất: " + shippingInfo.outbound.code
                        }}</v-list-item-title>
                        <v-list-item-subtitle>
                          {{
                            "Cảng bốc hàng: " +
                              shippingInfo.outbound.booking.portOfLoading
                                .fullname
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
                          "Đóng hàng tại: " +
                            shippingInfo.outbound.packingStation
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
                          {{
                            "Mô tả: " + shippingInfo.outbound.goodsDescription
                          }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card-text>
              </v-card>
            </v-container>
          </v-tab-item>
          <v-tab-item>
            <v-container fluid>
              <v-card class="elevation-0" v-if="combined">
                <v-img
                  height="100"
                  src="@/assets/images/biddingdocument.jpg"
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
                  <v-subheader
                    >Chứng cứ
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          style="color:gold;"
                          v-if="!checkValid"
                          v-bind="attrs"
                          v-on="on"
                          >report_problem</v-icon
                        >
                      </template>
                      <span>Bạn cần xác nhận ít nhất một chứng cứ.</span>
                    </v-tooltip>
                  </v-subheader>
                  <v-card-title>Danh sách Chứng cứ</v-card-title>
                  <v-data-table
                    :headers="evidenceHeaders"
                    :items="evidences"
                    item-key="id"
                    :loading="loading"
                    :options.sync="evidenceOptions"
                    :server-items-length="evidenceServerSideOptions.totalItems"
                    :footer-props="{
                      'items-per-page-options':
                        evidenceServerSideOptions.itemsPerPageItems
                    }"
                    :actions-append="evidenceOptions.page"
                    no-data-text="Danh sách Chứng cứ rỗng."
                    disable-sort
                    class="elevation-0"
                  >
                    <template v-slot:item.actions="{ item }">
                      <v-btn
                        class="ma-1"
                        x-small
                        tile
                        outlined
                        color="success"
                        @click.stop="openDetailEvidence(item)"
                      >
                        <v-icon left>details </v-icon>Chi tiết
                      </v-btn>
                    </template>
                    <template v-slot:item.isValid="{ item }">
                      {{ item.isValid ? "Đã xác nhận" : "Chưa xác nhận" }}
                    </template>
                  </v-data-table>
                </v-list>
              </v-card>
            </v-container>
          </v-tab-item>
        </v-tabs>
      </v-card>
      <v-card class="order-1 flex-grow-1 mx-auto my-5">
        <v-card-title v-if="shippingInfo">
          Thông tin vận chuyển: {{ "#" + shippingInfo.id }}
        </v-card-title>
        <v-card-text>
          <v-stepper :value="stepper" alt-labels class="elevation-0">
            <v-stepper-header>
              <v-stepper-step step="1">Nhận thông tin</v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="2" :rules="[() => exception]"
                >Đang vận chuyển
                <small v-if="exception == false">Đã có lỗi xảy ra</small>
              </v-stepper-step>
              <v-divider></v-divider>
              <v-stepper-step step="3">Đã giao hàng</v-stepper-step>
            </v-stepper-header>
          </v-stepper>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-title>Danh sách vận chuyển</v-card-title>
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
          <template v-slot:item.actions="{ item }">
            <v-btn
              class="ma-1"
              x-small
              tile
              :outlined="shippingInfo.id !== item.id"
              :color="shippingInfo.id == item.id ? 'info' : 'gray'"
              @click.stop="openDetailRouter(item)"
            >
              <v-icon left dense>details </v-icon>Lịch trình
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-content>
</template>
<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import FormValidate from "@/mixin/form-validate";
import Utils from "@/mixin/utils";
import { ICombined } from "@/entity/combined";
import { IEvidence } from "@/entity/evidence";
import { getEvidencesByContract } from "@/api/evidence";
import DetailEvidence from "./DetailEvidence.vue";
import { IInbound } from "@/entity/inbound";
import { DataOptions } from "vuetify";
import SupplierRating from "../../bidding-document/components/SupplierRating.vue";
import { IContract } from "@/entity/contract";
import { IShippingInfo } from "@/entity/shipping-info";
import { getShippingInfosByCombined } from "@/api/shipping-info";
import { getInboundByContainer } from "@/api/inbound";
import { getCombined } from "@/api/combined";
import { getPorts } from "@/api/port";
import { IPort } from "@/entity/port";
import GoogleMapLoader from "@/components/googlemaps/GoogleMapLoader.vue";
import GoogleMapDirection from "@/components/googlemaps/GoogleMapDirection.vue";
import { IBiddingDocument } from "@/entity/bidding-document";
import { getBiddingDocumentByCombined } from "@/api/bidding-document";

@Component({
  mixins: [FormValidate, Utils],
  components: {
    DetailEvidence,
    SupplierRating,
    GoogleMapLoader,
    GoogleMapDirection
  }
})
export default class DetailCombined extends Vue {
  style = { width: "inherit", height: "250px" };
  combined = null as ICombined | null;
  shippingInfos: Array<IShippingInfo> = [];
  shippingInfo = null as IShippingInfo | null;
  evidence = null as IEvidence | null;
  evidences: Array<IEvidence> = [];
  inbound = null as IInbound | null;
  contract = null as IContract | null;
  biddingDocument = null as IBiddingDocument | null;
  ports: Array<IPort> = [];
  loading = false;
  stepper = 1;
  exception = true;
  dialogDetail = false;
  checkValid = false;
  finalEvidence = false;
  shippingInfoOptions = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  shippingInfoServerSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  // Evidence
  evidenceOptions = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  evidenceServerSideOptions = {
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
      align: "start",
      sortable: false,
      value: "container.number"
    },
    { text: "Tài xế", value: "container.driver.fullname" },
    { text: "SĐT Tài xế", value: "container.driver.phone" },
    {
      text: "Rơ mọt",
      value: "container.trailer.licensePlate"
    },
    {
      text: "Đầu kéo",
      value: "container.tractor.licensePlate"
    },
    {
      text: "Trạng thái",
      value: "status"
    },
    {
      text: "Hành động",
      value: "actions",
      sortable: false
    }
  ];
  evidenceHeaders = [
    {
      text: "Evidence No.",
      align: "start",
      sortable: false,
      value: "id"
    },
    { text: "Người gửi", value: "sender" },
    { text: "Hợp lệ", value: "isValid" },
    {
      text: "Hành động",
      value: "actions",
      sortable: false
    }
  ];

  async loadInboundByContainer(containerId: number) {
    const _res = await getInboundByContainer(containerId);
    if (_res.data) {
      const _inbound = _res.data;
      this.inbound = _inbound;
    }
  }

  processShippingInfo(item: IShippingInfo) {
    switch (item.status) {
      case "INFO_RECEIVED":
        this.stepper = 1;
        break;
      case "SHIPPING":
        this.stepper = 2;
        break;
      case "DELIVERED":
        this.stepper = 3;
        break;
      case "EXCEPTION":
        this.stepper = 2;
        this.exception = false;
        break;
      default:
        break;
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
          // TODO: view detail first shippingInfo
          await this.loadInboundByContainer(
            this.shippingInfo.container.id as number
          );
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
      const _res_ = await getBiddingDocumentByCombined(_combined.id);
      if (_res_.data) {
        const _biddingDocument = _res_.data;
        this.biddingDocument = _biddingDocument;
      }
    }
  }

  async openDetailRouter(item: IShippingInfo) {
    this.shippingInfo = item;
    this.processShippingInfo(item);
    await this.loadInboundByContainer(item.container.id as number);
  }

  openDetailEvidence(item: IEvidence) {
    this.finalEvidence = false;
    this.evidence = item;
    const index = this.evidences.findIndex((x: IEvidence) => x.id == item.id);
    if (index == 0) {
      this.finalEvidence = true;
    }
    this.dialogDetail = true;
  }

  @Watch("evidenceOptions")
  async onEvidenceOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      if (this.contract && this.contract.id) {
        const _res = await getEvidencesByContract(this.contract.id, {
          page: val.page - 1,
          limit: val.itemsPerPage
        });
        if (_res.data) {
          const _evidences = _res.data.data;
          this.evidences = _evidences;
          this.evidenceServerSideOptions.totalItems = _res.data.totalElements;
          if (this.evidences.length > 0 && this.evidences[0].isValid == true) {
            this.checkValid = true;
          }
        }
      }
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

  getPortAddress(portCode: string) {
    if (portCode.length > 0) {
      const list = this.ports.filter(x => x.nameCode == portCode);
      if (list.length > 0) return list[0].address;
      return undefined;
    }
    return undefined;
  }

  async created() {
    const _res = await getPorts({
      page: 0,
      limit: 100
    });
    if (_res.data) {
      const _ports = _res.data.data;
      this.ports = _ports;
    }
  }
}
</script>
