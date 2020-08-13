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
        <v-toolbar-title
          >Hộp thoại {{ readonly ? "chi tiết" : "chỉnh sửa" }} hàng
          xuất</v-toolbar-title
        >
        <v-spacer></v-spacer>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-container class="d-flex justify-space-around align-start">
        <div
          v-if="outboundLocal"
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
                Thông tin hàng xuất
                <small>Thông tin chung</small>
              </v-stepper-step>

              <v-stepper-content step="1">
                <v-form ref="outboundForm" v-model="valid" lazy-validation>
                  <small>*Dấu sao là trường bắt buộc</small>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="outboundLocal.shippingLine"
                        prepend-icon="directions_boat"
                        :items="shippingLinesToString"
                        :rules="[required('hãng tàu')]"
                        :loading="loadingShippingLines"
                        :readonly="readonly"
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
                      >
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="outboundLocal.containerType"
                        prepend-icon="directions_bus"
                        :items="containerTypesToString"
                        :rules="[required('loại Container')]"
                        :loading="loadingContainerTypes"
                        :readonly="readonly"
                        no-data-text="Danh sách loại Cont rỗng."
                        label="Loại container*"
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
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <DatetimePicker
                        :datetime="outboundLocal.packingTime"
                        :return-value.sync="outboundLocal.packingTime"
                        :readonly="readonly"
                        dateicon="flight_land"
                        datelabel="Ngày đóng hàng"
                        timelabel="Giờ đóng hàng"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <label class="place-label">Nơi đóng hàng</label>
                      <input
                        ref="inputAddress1"
                        class="place-input"
                        type="text"
                        placeholder="Nơi đóng hàng"
                        :rules="[required('nơi đóng hàng')]"
                        :readonly="readonly"
                      />
                      <!-- <v-text-field
                      v-model="outboundLocal.packingStation"
                      prepend-icon="location_on"
                      type="text"
                      label="Nơi đóng hàng"
                    ></v-text-field>  --></v-col
                    >
                  </v-row>
                  <v-row
                    ><v-col cols="12" sm="6">
                      <v-text-field
                        v-model="outboundLocal.grossWeight"
                        prepend-icon="fitness_center"
                        type="number"
                        label="Khối lượng hàng"
                        :readonly="readonly"
                      ></v-text-field> </v-col
                    ><v-col cols="12" sm="6">
                      <v-select
                        v-model="outboundLocal.unitOfMeasurement"
                        prepend-icon="strikethrough_s"
                        :items="unitOfMeasurements"
                        :readonly="readonly"
                        label="Đơn vị đo"
                      ></v-select> </v-col
                  ></v-row>
                  <v-row
                    ><v-col cols="12">
                      <v-text-field
                        v-model="outboundLocal.goodsDescription"
                        prepend-icon="description"
                        type="text"
                        label="Mô tả hàng"
                        :readonly="readonly"
                      ></v-text-field> </v-col
                  ></v-row>

                  <v-btn
                    color="primary"
                    @click="updateOutbound()"
                    :disabled="!valid"
                    v-if="!readonly"
                    >Lưu và tiếp tục</v-btn
                  >
                  <v-btn color="primary" @click="stepper = 2" v-if="readonly"
                    >Tiếp tục</v-btn
                  >
                </v-form>
              </v-stepper-content>

              <v-stepper-step
                :complete="stepper > 2"
                step="2"
                :editable="editable"
                >Thông tin Booking</v-stepper-step
              >

              <v-stepper-content step="2">
                <v-form ref="bookingForm" v-model="valid2" lazy-validation>
                  <small>*Dấu sao là trường bắt buộc</small>
                  <v-row
                    ><v-col cols="12" sm="6">
                      <v-text-field
                        v-model="outboundLocal.booking.number"
                        prepend-icon="child_friendly"
                        :rules="[required('Số booking')]"
                        type="text"
                        label="Số Booking*"
                        readonly
                      ></v-text-field> </v-col
                    ><v-col cols="12" sm="6">
                      <v-select
                        v-model="outboundLocal.booking.portOfLoading"
                        prepend-icon="flag"
                        :items="portsToString"
                        :rules="[required('cảng xuất hàng')]"
                        :loading="loadingPorts"
                        :readonly="readonly"
                        no-data-text="Danh sách bến cảng rỗng."
                        label="Cảng xuất hàng*"
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
                        :datetime="outboundLocal.booking.cutOffTime"
                        :return-value.sync="outboundLocal.booking.cutOffTime"
                        :readonly="readonly"
                        dateicon="flight_takeoff"
                        datelabel="Ngày tàu cắt máng"
                        timelabel="Giờ cắt máng"
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="outboundLocal.booking.unit"
                        prepend-icon="commute"
                        :rules="[required('số lượng Container cần')]"
                        :readonly="readonly"
                        label="Số lượng Container*"
                        type="number"
                        required
                      ></v-text-field> </v-col
                  ></v-row>
                  <v-checkbox
                    v-model="outboundLocal.booking.isFcl"
                    label="Hàng nguyên cont"
                  ></v-checkbox>
                  <v-btn
                    color="primary"
                    @click="updateBooking()"
                    :disabled="!valid2"
                    v-if="!readonly"
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
                    {{ (outboundLocal.packingStation = address) }}
                  </div>
                  <GoogleMapMarker
                    :visible="false"
                    :marker="getMarkerFromPlace(place, address)"
                    :google="google"
                    :map="map"
                  />
                  <GoogleMapDirection
                    v-if="origin && outboundLocal.booking.portOfLoading"
                    :router="{
                      origin: origin.geometry.location,
                      destination: getPortAddress(
                        outboundLocal.booking.portOfLoading
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
                >Đi lúc: {{ formatDatetime(outboundLocal.packingTime) }}</small
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
            v-if="!distanceMatrixResult && outboundLocal"
            vertical
            class="elevation-0 pb-0"
          >
            <v-stepper-step step="1"
              >{{ outboundLocal.packingStation }}
              <small class="mt-1"
                >Đi lúc: {{ formatDatetime(outboundLocal.packingTime) }}</small
              >
            </v-stepper-step>
            <v-stepper-content step="1"></v-stepper-content>
            <v-stepper-step step="2"
              >{{ getPortAddress(outboundLocal.booking.portOfLoading) }}
              <small class="mt-1"
                >Đến (khoảng):
                {{ formatDatetime(outboundLocal.deliveryTime) }}</small
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
import { IOutbound } from "@/entity/outbound";
import FormValidate from "@/mixin/form-validate";
import { IPort } from "@/entity/port";
import { IContainerType } from "@/entity/container-type";
import { IShippingLine } from "@/entity/shipping-line";
import { getContainerTypes } from "@/api/container-type";
import { getPorts } from "@/api/port";
import { getShippingLines } from "@/api/shipping-line";
import { editOutbound } from "@/api/outbound";
import { editBooking } from "@/api/booking";
import { addTimeToDate, isEmptyObject } from "@/utils/tool";
import { addMinutesToDate } from "@/utils/tool";
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
export default class UpdateOutbound extends Vue {
  @Ref() inputAddress1!: HTMLInputElement;
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @PropSync("outbounds", { type: Array }) outboundsSync!: Array<IOutbound>;
  @Prop(Boolean) readonly!: boolean;
  @Prop(Object) outbound!: IOutbound;

  distanceMatrixResult = null as DistanceMatrix | null;
  style = { width: "600px", height: "500px" };
  origin = null as google.maps.places.PlaceResult | null;
  // Form validate
  checkbox = false;
  editable = true;
  stepper = 1;
  valid = true;
  valid2 = true;
  // API list
  dateInit = addTimeToDate(new Date().toString());
  ports: Array<IPort> = [];
  shippingLines: Array<IShippingLine> = [];
  containerTypes: Array<IContainerType> = [];
  unitOfMeasurements: Array<string> = [];
  outboundLocal = null as IOutbound | null;
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

  // Outbound Update
  estimateTimeTravel() {
    /* TODO: Calculate Delivery Time:
     * deliveryTime = (duration: packingStation -> portOfLoading) + packingTime (+ bias)
     */
    if (
      this.outboundLocal &&
      this.distanceMatrixResult &&
      this.distanceMatrixResult.duration
    ) {
      const time = addMinutesToDate(
        this.outboundLocal.packingTime,
        (this.distanceMatrixResult.duration.value / 60) * 1.3
      );
      this.outboundLocal.deliveryTime = time;
      return time;
    }
  }
  @Watch("dialogEditSync")
  async onDialogEditSyncChange(val: boolean) {
    if (val == true) {
      if (!isEmptyObject(this.outbound)) {
        this.outboundLocal = Object.assign({}, this.outbound);
        this.$nextTick(() => {
          this.inputAddress1.value = this.outbound.packingStation;
        });
        this.shippingLine = this.outboundLocal.shippingLine;
        this.containerType = this.outboundLocal.containerType;
        this.port = this.outboundLocal.booking.portOfLoading;
      }
      // API GET Ports
      await this.getShippingLines(100);
      await this.getContainerTypes(100);
      await this.getPorts(100);
    } else {
      this.stepper = 1;
    }
  }
  async updateOutbound() {
    if (this.outboundLocal && this.outboundLocal.id) {
      const _res = await editOutbound(
        this.outboundLocal.id,
        this.outboundLocal
      );
      if (_res.data) {
        const _outbound = _res.data;
        const index = this.outboundsSync.findIndex(x => x.id == _outbound.id);
        this.outboundsSync.splice(index, 1, _outbound);
        this.stepper = 2;
      }
    }
  }
  async updateBooking() {
    if (this.outboundLocal && this.outboundLocal.booking.id) {
      const _res = await editBooking(
        this.outboundLocal.booking.id,
        this.outboundLocal.booking
      );
      if (_res.data) {
        const _booking = _res.data;
        const index = this.outboundsSync.findIndex(
          x => x.id === this.outbound.id
        );
        this.outboundLocal.booking = _booking;
        this.outboundsSync.splice(index, 1, this.outboundLocal);
      }
    }
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
    console.log("UpdateOutbound");
    this.unitOfMeasurements = ["KG"];
  }

  beforeDestroy() {
    console.log("DESTROY > UpdateOutbound");
    this.stepper = 1;
    this.origin = null;
    this.outboundLocal = null;
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
