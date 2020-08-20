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
        <v-toolbar-title>Hộp thoại chỉnh sửa hàng xuất</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-card
        class="d-flex justify-space-around align-start elevation-0"
        width="100%"
      >
        <div
          v-if="outboundLocal"
          class="order-0 flex-grow-0 mx-auto mr-5"
          :style="{ width: '600px' }"
        >
          <v-list three-line subheader width="inherit">
            <v-stepper v-model="stepper" vertical class="elevation-0">
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
                        :items="shippingLines"
                        item-text="companyName"
                        item-value="companyCode"
                        :rules="[required('hãng tàu')]"
                        no-data-text="Danh sách hãng tàu rỗng."
                        label="Hãng tàu*"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="outboundLocal.containerType"
                        prepend-icon="directions_bus"
                        :items="containerTypes"
                        item-text="name"
                        item-value="name"
                        :rules="[required('loại Container')]"
                        no-data-text="Danh sách loại Cont rỗng."
                        label="Loại container*"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <DatetimePicker
                        :datetime="outboundLocal.packingTime"
                        :return-value.sync="outboundLocal.packingTime"
                        dateicon="flight_land"
                        datelabel="Ngày đóng hàng"
                        timelabel="Giờ đóng hàng"
                        disabled
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
                      />
                      <!-- <v-text-field
                      v-model="outboundLocal.packingStation"
                      prepend-icon="location_on"
                      type="text"
                      label="Nơi đóng hàng"
                    ></v-text-field>  -->
                    </v-col>
                  </v-row>
                  <v-row
                    ><v-col cols="12" sm="6">
                      <v-text-field
                        v-model="outboundLocal.grossWeight"
                        prepend-icon="fitness_center"
                        type="number"
                        label="Khối lượng hàng"
                      ></v-text-field> </v-col
                    ><v-col cols="12" sm="6">
                      <v-select
                        v-model="outboundLocal.unitOfMeasurement"
                        prepend-icon="strikethrough_s"
                        :items="unitOfMeasurements"
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
                      ></v-text-field> </v-col
                  ></v-row>

                  <v-btn
                    color="primary"
                    @click="updateOutbound()"
                    :disabled="!valid"
                    >Lưu và tiếp tục</v-btn
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
                        prepend-icon="import_export"
                        :rules="[required('Số booking')]"
                        type="text"
                        label="Số Booking*"
                        disabled
                      ></v-text-field> </v-col
                    ><v-col cols="12" sm="6">
                      <v-select
                        v-model="outboundLocal.booking.portOfLoading"
                        prepend-icon="flag"
                        :items="ports"
                        item-text="fullname"
                        return-object
                        :rules="[required('cảng xuất hàng')]"
                        no-data-text="Danh sách cảng rỗng."
                        label="Cảng xuất hàng*"
                      ></v-select> </v-col
                  ></v-row>
                  <v-row
                    ><v-col cols="12">
                      <DatetimePicker
                        :datetime="outboundLocal.booking.cutOffTime"
                        :return-value.sync="outboundLocal.booking.cutOffTime"
                        dateicon="flight_takeoff"
                        datelabel="Ngày tàu cắt máng"
                        timelabel="Giờ cắt máng"
                        disabled
                      />
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="outboundLocal.booking.unit"
                        prepend-icon="commute"
                        :rules="[required('số lượng Container cần')]"
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
                      destination: outboundLocal.booking.portOfLoading.address,
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
            :value="stepper2"
          >
            <v-stepper-step step="1" complete
              >{{ distanceMatrixResult.originAddress }}
              <small class="mt-1"
                >Đi lúc: {{ formatDatetime(outboundLocal.packingTime) }}</small
              >
            </v-stepper-step>
            <v-stepper-content step="1"></v-stepper-content>
            <v-stepper-step step="2" :complete="stepper2 >= 2"
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
            :value="stepper2"
          >
            <v-stepper-step step="1" complete
              >{{ outboundLocal.packingStation }}
              <small class="mt-1"
                >Đi lúc: {{ formatDatetime(outboundLocal.packingTime) }}</small
              >
            </v-stepper-step>
            <v-stepper-content step="1"></v-stepper-content>
            <v-stepper-step step="2" :complete="stepper2 >= 2"
              >{{ outboundLocal.booking.portOfLoading.address }}
              <small class="mt-1"
                >Đến (khoảng):
                {{ formatDatetime(outboundLocal.deliveryTime) }}</small
              >
            </v-stepper-step>
            <v-stepper-content step="2"></v-stepper-content>
          </v-stepper>
        </v-card>
      </v-card>
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
import { addTimeToDate } from "@/utils/tool";
import { addMinutesToDate } from "@/utils/tool";
import GoogleMapLoader from "@/components/googlemaps/GoogleMapLoader.vue";
import GoogleMapAutocomplete from "@/components/googlemaps/GoogleMapAutocomplete.vue";
import GoogleMapMarker from "@/components/googlemaps/GoogleMapMarker.vue";
import GoogleMapMixins from "@/components/googlemaps/map-mixins";
import GoogleMapDirection from "@/components/googlemaps/GoogleMapDirection.vue";
import GoogleMapDistanceMatrix from "@/components/googlemaps/GoogleMapDistanceMatrix.vue";
import { DistanceMatrix } from "@/components/googlemaps/map-interface";
import Utils from "@/mixin/utils";
import DatetimePicker from "@/components/DatetimePicker.vue";
import { IBooking } from "@/entity/booking";

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
  @Prop() outbound!: IOutbound;

  distanceMatrixResult = null as DistanceMatrix | null;
  style = { width: "600px", height: "500px" };
  origin = null as google.maps.places.PlaceResult | null;
  // Form validate
  checkbox = false;
  editable = true;
  stepper = 1;
  stepper2 = 1;
  valid = true;
  valid2 = true;
  // API list
  dateInit = addTimeToDate(new Date().toString());
  ports: Array<IPort> = [];
  shippingLines: Array<IShippingLine> = [];
  containerTypes: Array<IContainerType> = [];
  unitOfMeasurements: Array<string> = [];
  outboundLocal = null as IOutbound | null;

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
    if (val == true && this.outbound) {
      this.outboundLocal = Object.assign({}, this.outbound);
      // REFACTOR SUPPLY
      const _shippingLine = this.outboundLocal.shippingLine as IShippingLine;
      const _containerType = this.outboundLocal.containerType as IContainerType;

      this.outboundLocal.shippingLine = _shippingLine.companyCode;
      this.outboundLocal.containerType = _containerType.name;
      // END
      this.$nextTick(() => {
        this.inputAddress1.value = this.outbound.packingStation;
      });
      const _isDelivered =
        new Date().getTime() - new Date(this.outbound.deliveryTime).getTime();
      if (_isDelivered > 0) {
        this.stepper2 = 2;
      }
    } else {
      this.stepper = 1;
    }
  }
  async updateOutbound() {
    if (this.outboundLocal) {
      const _res = await editOutbound(
        this.outboundLocal.id as number,
        this.outboundLocal
      );
      if (_res.data && this.outboundLocal) {
        const _outbound = _res.data.data as IOutbound;
        const index = this.outboundsSync.findIndex(x => x.id == _outbound.id);
        this.outboundsSync.splice(index, 1, _outbound);
        this.stepper = 2;
        this.outboundLocal = Object.assign({}, _outbound);
        // REFACTOR SUPPLY
        const _shippingLine = this.outboundLocal.shippingLine as IShippingLine;
        const _containerType = this.outboundLocal
          .containerType as IContainerType;

        this.outboundLocal.shippingLine = _shippingLine.companyCode;
        this.outboundLocal.containerType = _containerType.name;
        // END
      }
    }
  }
  async updateBooking() {
    if (this.outboundLocal && this.outboundLocal.booking) {
      const _portOfLoading = this.outboundLocal.booking.portOfLoading as IPort;
      this.outboundLocal.booking.portOfLoading = _portOfLoading.nameCode;
      // API UPDATE OUTBOUND
      const _res = await editBooking(
        this.outboundLocal.booking.id as number,
        this.outboundLocal.booking
      );
      if (_res.data) {
        const _booking = _res.data.data as IBooking;
        const index = this.outboundsSync.findIndex(
          x => x.id === this.outbound.id
        );
        this.outboundsSync.splice(index, 1, {
          ...this.outboundsSync[index],
          booking: _booking
        });
        this.outboundLocal.booking = _booking;
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

  async created() {
    console.log("UpdateOutbound");
    this.unitOfMeasurements = ["KG"];
    // API GET ShippingLines
    const _resS = await getShippingLines({
      page: 0,
      limit: 100
    });
    if (_resS.data) {
      const _shippingLines = _resS.data.data;
      this.shippingLines = _shippingLines;
    }
    // API GET ContainerTypes
    const _resC = await getContainerTypes({
      page: 0,
      limit: 100
    });
    if (_resC.data) {
      const _containerTypes = _resC.data.data;
      this.containerTypes = _containerTypes;
    }
    // API GET Ports
    const _resP = await getPorts({
      page: 0,
      limit: 100
    });
    if (_resP.data) {
      const _ports = _resP.data.data;
      this.ports = _ports;
    }
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
