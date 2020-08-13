<template>
  <v-dialog
    v-model="dialogEditSync"
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogEditSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Hộp thoại chỉnh sửa hàng nhập</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-container class="d-flex justify-space-around align-start">
        <div
          v-if="inboundLocal"
          class="order-0 flex-grow-0 mx-auto mr-5 my-5"
          :style="{ width: '600px' }"
        >
          <v-list three-line subheader width="inherit">
            <v-stepper v-model="stepper" vertical>
              <v-stepper-step
                :complete="stepper > 1"
                step="1"
                :editable="editable"
              >
                Thông tin hàng nhập
                <small>Thông tin chung</small>
              </v-stepper-step>

              <v-stepper-content step="1">
                <v-form ref="inboundForm" v-model="valid" lazy-validation>
                  <small>*Dấu sao là trường bắt buộc</small>
                  <v-row
                    ><v-col cols="12" sm="6">
                      <v-select
                        v-model="inboundLocal.shippingLine"
                        prepend-icon="directions_boat"
                        :items="shippingLinesToString"
                        :loading="loadingShippingLines"
                        :rules="[required('hãng tàu')]"
                        no-data-text="Danh sách hãng tàu rỗng."
                        label="Hãng tàu*"
                        ><v-btn
                          text
                          small
                          color="primary"
                          v-if="seeMoreShippingLines"
                          slot="append-item"
                          style="margin-left:60px;"
                          @click="loadMoreShippingLines()"
                          >Xem thêm</v-btn
                        ></v-select
                      > </v-col
                    ><v-col cols="12" sm="6">
                      <v-select
                        v-model="inboundLocal.containerType"
                        prepend-icon="directions_bus"
                        :loading="loadingContainerTypes"
                        :items="containerTypesToString"
                        :rules="[required('loại Container')]"
                        label="Loại container*"
                        no-data-text="Danh sách loại Cont rỗng."
                        ><v-btn
                          text
                          small
                          color="primary"
                          v-if="seeMoreContainerTypes"
                          slot="append-item"
                          style="margin-left:60px;"
                          @click="loadMoreContainerTypes()"
                          >Xem thêm</v-btn
                        ></v-select
                      >
                    </v-col></v-row
                  >
                  <v-row
                    ><v-col cols="12">
                      <label class="place-label">Nơi trả hàng</label>
                      <input
                        ref="inputAddress1"
                        class="place-input"
                        type="text"
                        placeholder="Nơi trả hàng"
                        :rules="[required('nơi trả hàng')]"
                        required
                      />
                      <!-- <v-text-field
                          v-model="inboundLocal.returnStation"
                          prepend-icon="location_on"
                          type="text"
                          :rules="[required('return station')]"
                          label="Nơi trả hàng*"
                        ></v-text-field> -->
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <DatetimePicker
                        :datetime="inboundLocal.pickupTime"
                        :return-value.sync="inboundLocal.pickupTime"
                        dateicon="flight_land"
                        datelabel="Ngày lấy cont đặc"
                        timelabel="Giờ lấy cont"
                      />
                    </v-col>
                  </v-row>
                  <v-btn
                    color="primary"
                    @click="updateInbound()"
                    :disabled="!valid"
                    >Lưu và tiếp tục</v-btn
                  >
                </v-form>
              </v-stepper-content>

              <v-stepper-step
                :complete="stepper > 2"
                step="2"
                :editable="editable"
                >Thông tin B/L</v-stepper-step
              >

              <v-stepper-content step="2">
                <v-form ref="billOfLadingForm" v-model="valid2" lazy-validation>
                  <small>*Dấu sao là trường bắt buộc</small>
                  <v-row
                    ><v-col cols="12" sm="6">
                      <v-text-field
                        v-model="inboundLocal.billOfLading.number"
                        prepend-icon="play_for_work"
                        type="text"
                        :rules="[required('Số B/L')]"
                        label="Số B/L*"
                        readonly
                      ></v-text-field> </v-col
                    ><v-col cols="12" sm="6">
                      <v-select
                        v-model="inboundLocal.billOfLading.portOfDelivery"
                        prepend-icon="flag"
                        :loading="loadingPorts"
                        :items="portsToString"
                        :rules="[required('cảng lấy Container đặc')]"
                        no-data-text="Danh sách bến cảng rỗng."
                        label="Cảng lấy cont đặc*"
                        ><v-btn
                          text
                          small
                          color="primary"
                          v-if="seeMorePorts"
                          slot="append-item"
                          style="margin-left:60px;"
                          @click="loadMorePorts()"
                          >Xem thêm</v-btn
                        ></v-select
                      >
                    </v-col></v-row
                  >
                  <v-row
                    ><v-col cols="12">
                      <DatetimePicker
                        :datetime="inboundLocal.billOfLading.freeTime"
                        :return-value.sync="inboundLocal.billOfLading.freeTime"
                        dateicon="event_available"
                        datelabel="Ngày DEM/DET (Freetime)"
                        timelabel="Giờ Freetime"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="inboundLocal.billOfLading.unit"
                        prepend-icon="local_shipping"
                        type="number"
                        :rules="[required('số lượng Container đăng ký')]"
                        label="Số lượng cont*"
                      ></v-text-field
                    ></v-col>
                  </v-row>
                  <v-btn
                    color="primary"
                    @click="updateBillOfLading()"
                    :disabled="!valid2"
                    >Lưu và hoàn tất</v-btn
                  >
                  <v-btn text @click="stepper = 1">Quay lại</v-btn>
                </v-form>
              </v-stepper-content>
            </v-stepper>
          </v-list>
        </div>
        <v-card class="order-1 flex-shrink-1 mx-auto my-5">
          <GoogleMapLoader
            :options="mapConfig"
            :apiKey="apiKey"
            :mapStyle="style"
          >
            <template slot-scope="{ google, map }">
              <!-- AUTOCOMPLETE ORIGIN GEOLOCATION -->
              <GoogleMapAutocomplete
                v-if="dialogEditSync"
                :place.sync="origin"
                :input="inputAddress1"
                :countries="['vn']"
                :google="google"
                :map="map"
              >
                <template slot-scope="{ place, address }">
                  <div class="d-none">
                    {{ (inboundLocal.returnStation = address) }}
                  </div>
                  <GoogleMapMarker
                    :visible="false"
                    :marker="getMarkerFromPlace(place, address)"
                    :google="google"
                    :map="map"
                  />
                  <GoogleMapDirection
                    v-if="origin && inboundLocal.billOfLading.portOfDelivery"
                    :router="{
                      origin: origin.geometry.location,
                      destination: getPortAddress(
                        inboundLocal.billOfLading.portOfDelivery
                      ),
                      travelMode: 'DRIVING'
                    }"
                    :google="google"
                    :map="map"
                  >
                    <template slot-scope="{ origin, destination }">
                      <GoogleMapDistanceMatrix
                        :single="true"
                        :routers="{
                          origins: [origin],
                          destinations: [destination],
                          travelMode: 'DRIVING',
                          unitSystem: 0,
                          avoidHighways: false,
                          avoidTolls: false
                        }"
                        :google="google"
                        :map="map"
                      >
                        <template slot-scope="{ distance }">
                          <div class="d-none">
                            {{
                              (distanceMatrixResult = getValueFromResponse(
                                distance,
                                0
                              ))
                            }}
                          </div>
                        </template>
                      </GoogleMapDistanceMatrix>
                    </template>
                  </GoogleMapDirection>
                </template>
              </GoogleMapAutocomplete>
            </template>
          </GoogleMapLoader>
          <v-stepper
            v-if="distanceMatrixResult"
            vertical
            class="elevation-0 pb-0"
          >
            <v-stepper-step step="1"
              >{{ distanceMatrixResult.originAddress }}
              <small class="mt-1"
                >Đi lúc: {{ formatDatetime(inboundLocal.pickupTime) }}</small
              >
            </v-stepper-step>
            <v-stepper-content step="1"></v-stepper-content>
            <v-stepper-step step="2"
              >{{ distanceMatrixResult.destinationAddress }}
              <small class="mt-1"
                >Đến (khoảng): {{ formatDatetime(estimateTimeTravel()) }}</small
              >
              <small class="mt-1"
                >Khoảng cách: {{ distanceMatrixResult.distance.text }}</small
              >
            </v-stepper-step>
            <v-stepper-content step="2"></v-stepper-content>
          </v-stepper>
          <v-stepper
            v-if="!distanceMatrixResult && inboundLocal"
            vertical
            class="elevation-0 pb-0"
          >
            <v-stepper-step step="1"
              >{{ inboundLocal.returnStation }}
              <small class="mt-1"
                >Đi lúc: {{ formatDatetime(inboundLocal.pickupTime) }}</small
              >
            </v-stepper-step>
            <v-stepper-content step="1"></v-stepper-content>
            <v-stepper-step step="2"
              >{{ getPortAddress(inboundLocal.billOfLading.portOfDelivery) }}
              <small class="mt-1"
                >Đến (khoảng):
                {{ formatDatetime(inboundLocal.emptyTime) }}</small
              >
            </v-stepper-step>
            <v-stepper-content step="2"></v-stepper-content>
          </v-stepper>
        </v-card>
      </v-container>
      <!-- END CONTENT -->
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import {
  Component,
  Vue,
  PropSync,
  Prop,
  Ref,
  Watch
} from "vue-property-decorator";
import { IInbound } from "@/entity/inbound";
import FormValidate from "@/mixin/form-validate";
import { IPort } from "@/entity/port";
import { IShippingLine } from "@/entity/shipping-line";
import { IContainerType } from "@/entity/container-type";
import { addTimeToDate, isEmptyObject, addMinutesToDate } from "@/utils/tool";
import { editInbound } from "@/api/inbound";
import { getPorts } from "@/api/port";
import { getContainerTypes } from "@/api/container-type";
import { getShippingLines } from "@/api/shipping-line";
import { editBillOfLading } from "@/api/bill-of-lading";
import GoogleMapLoader from "@/components/googlemaps/GoogleMapLoader.vue";
import GoogleMapAutocomplete from "@/components/googlemaps/GoogleMapAutocomplete.vue";
import GoogleMapMarker from "@/components/googlemaps/GoogleMapMarker.vue";
import GoogleMapMixins from "@/components/googlemaps/map-mixins";
import { apiKey } from "@/components/googlemaps/map-constant";
import GoogleMapDirection from "@/components/googlemaps/GoogleMapDirection.vue";
import GoogleMapDistanceMatrix from "@/components/googlemaps/GoogleMapDistanceMatrix.vue";
import { DistanceMatrix } from "@/components/googlemaps/map-interface";
import Utils from "@/mixin/utils";
import DatetimePicker from "@/components/DatetimePicker.vue";

@Component({
  components: {
    DatetimePicker,
    GoogleMapLoader,
    GoogleMapAutocomplete,
    GoogleMapMarker,
    GoogleMapDirection,
    GoogleMapDistanceMatrix
  },
  mixins: [FormValidate, Utils, GoogleMapMixins]
})
export default class UpdateInbound extends Vue {
  @Ref() inputAddress1!: HTMLInputElement;
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @Prop(Object) inbound!: IInbound;
  @PropSync("inbounds", { type: Array }) inboundsSync!: Array<IInbound>;

  // Form validate
  distanceMatrixResult = null as DistanceMatrix | null;
  style = { width: "600px", height: "500px" };
  origin = null as google.maps.places.PlaceResult | null;
  dateInit = addTimeToDate(new Date().toString());
  inboundLocal = null as IInbound | null;
  checkbox = false;
  editable = true;
  stepper = 1;
  valid = true;
  valid2 = true;
  // API list
  ports: Array<IPort> = [];
  shippingLines: Array<IShippingLine> = [];
  containerTypes: Array<IContainerType> = [];
  loadingShippingLines = false;
  seeMoreShippingLines = true;
  limitShippingLines = 5;
  loadingContainerTypes = false;
  seeMoreContainerTypes = true;
  limitContainerTypes = 5;
  loadingPorts = false;
  seeMorePorts = true;
  limitPorts = 5;
  shippingLine = "";
  containerType = "";
  port = "";

  // Inbound Update
  estimateTimeTravel() {
    /* TODO: Calculate Empty Time:
     * emptyTime = (duration: portOfDelivery -> returnStation) + pickupTime (+ bias)
     */
    if (
      this.inboundLocal &&
      this.distanceMatrixResult &&
      this.distanceMatrixResult.duration
    ) {
      const time = addMinutesToDate(
        this.inboundLocal.pickupTime,
        (this.distanceMatrixResult.duration.value / 60) * 1.3
      );
      this.inboundLocal.emptyTime = time;
      return time;
    }
  }

  @Watch("dialogEditSync")
  async onDialogEditSyncChange(val: boolean) {
    if (val == true) {
      if (!isEmptyObject(this.inbound)) {
        this.inboundLocal = Object.assign({}, this.inbound);
        this.$nextTick(() => {
          this.inputAddress1.value = this.inbound.returnStation;
        });
        this.shippingLine = this.inboundLocal.shippingLine;
        this.containerType = this.inboundLocal.containerType;
        this.port = this.inboundLocal.billOfLading.portOfDelivery;
      }
      // API GET Ports
      await this.getShippingLines(100);
      await this.getContainerTypes(100);
      await this.getPorts(100);
    } else {
      this.stepper = 1;
    }
  }

  async updateInbound() {
    if (this.inboundLocal) {
      const _res = await editInbound(
        this.inbound.id as number,
        this.inboundLocal
      );
      if (_res.data) {
        const _inbound = _res.data.data;
        const index = this.inboundsSync.findIndex(x => x.id == _inbound.id);
        this.inboundsSync.splice(index, 1, _inbound);
        this.inboundLocal = _inbound;
        this.stepper = 2;
      }
    }
  }

  async updateBillOfLading() {
    if (this.inboundLocal && this.inboundLocal.billOfLading.id) {
      const _res = await editBillOfLading(
        this.inboundLocal.billOfLading.id,
        this.inboundLocal.billOfLading
      );
      if (_res.data) {
        const _billOfLading = _res.data.data;
        const index = this.inboundsSync.findIndex(
          x => x.id === this.inbound.id
        );
        this.inboundLocal.billOfLading = _billOfLading;
        this.inboundsSync.splice(index, 1, this.inboundLocal);
      }
    }
    return undefined;
  }

  getPortAddress(portCode: string) {
    if (portCode.length > 0) {
      const list = this.ports.filter(x => x.nameCode == portCode);
      if (list.length > 0) return list[0].address;
      return undefined;
    }
    return undefined;
  }

  async getShippingLines(limit: number) {
    this.loadingShippingLines = true;
    this.shippingLines = [] as Array<IShippingLine>;
    const _res = await getShippingLines({
      page: 0,
      limit: limit + 1
    });
    if (_res.data) {
      const _shippingLines = _res.data.data;
      _shippingLines.forEach((x: IShippingLine) => {
        if (x.companyCode == this.shippingLine) {
          this.shippingLines.push(x);
        }
      });
      _shippingLines.forEach((x: IShippingLine) => {
        let check = false;
        if (x.companyCode == this.shippingLine) {
          check = true;
        }
        if (
          check == false &&
          this.shippingLines.length < this.limitShippingLines
        ) {
          this.shippingLines.push(x);
        }
      });
      if (!_shippingLines || _shippingLines.length <= this.limitShippingLines) {
        this.seeMoreShippingLines = false;
      }
    }
    this.loadingShippingLines = false;
  }

  async loadMoreShippingLines() {
    this.limitShippingLines += 5;
    await this.getShippingLines(this.limitShippingLines);
  }

  async getContainerTypes(limit: number) {
    this.loadingContainerTypes = true;
    this.containerTypes = [] as Array<IContainerType>;
    const _res = await getContainerTypes({
      page: 0,
      limit: limit + 1
    });
    if (_res.data) {
      const _containerTypes = _res.data.data;
      _containerTypes.forEach((x: IContainerType) => {
        if (x.name == this.containerType) {
          this.containerTypes.push(x);
        }
      });
      _containerTypes.forEach((x: IContainerType) => {
        let check = false;
        if (x.name == this.containerType) {
          check = true;
        }
        if (
          check == false &&
          this.containerTypes.length < this.limitContainerTypes
        ) {
          this.containerTypes.push(x);
        }
      });
      if (
        !_containerTypes ||
        _containerTypes.length <= this.limitContainerTypes
      ) {
        this.seeMoreContainerTypes = false;
      }
    }
    this.loadingContainerTypes = false;
  }

  async loadMoreContainerTypes() {
    this.limitContainerTypes += 5;
    await this.getContainerTypes(this.limitContainerTypes);
  }

  async getPorts(limit: number) {
    this.loadingPorts = true;
    this.ports = [] as Array<IPort>;
    const _res = await getPorts({
      page: 0,
      limit: limit + 1
    });
    if (_res.data) {
      const _ports = _res.data.data;
      _ports.forEach((x: IPort) => {
        if (x.nameCode == this.port) {
          this.ports.push(x);
        }
      });
      _ports.forEach((x: IPort) => {
        let check = false;
        if (x.nameCode == this.port) {
          check = true;
        }
        if (check == false && this.ports.length < this.limitPorts) {
          this.ports.push(x);
        }
      });
      if (!_ports || _ports.length <= this.limitPorts) {
        this.seeMorePorts = false;
      }
    }
    this.loadingPorts = false;
  }
  async loadMorePorts() {
    this.limitPorts += 5;
    await this.getPorts(this.limitPorts);
  }

  get portsToString() {
    return this.ports.map(x => x.nameCode);
  }

  get shippingLinesToString() {
    return this.shippingLines.map(x => x.companyCode);
  }

  get containerTypesToString() {
    return this.containerTypes.map(x => x.name);
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
    return apiKey;
  }

  mounted() {
    console.log("UpdateInbound");
  }

  beforeDestroy() {
    console.log("DESTROY > UpdateInbound");
    this.stepper = 1;
    this.origin = null;
    this.inboundLocal = null;
  }
}
</script>
<style lang="css">
.place-label {
  font-size: 12px;
  margin-left: 10px;
}
.place-input {
  height: 40px;
  width: -webkit-fill-available;
  margin: 0 10px;
  border-bottom: 1px solid #000;
  padding: 5px 5px;
}
</style>
