<template>
  <v-dialog
    v-model="dialogAddSync"
    fullscreen
    hide-overlay
    persistent
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogAddSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Khai báo Hàng xuất</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="clearForm()">Xóa dữ liệu đã nhập</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-card
        class="d-flex justify-space-around align-start elevation-0"
        width="100%"
      >
        <v-card
          class="order-0 flex-grow-1 mx-auto mr-5 elevation-0"
          max-width="700"
          tile
        >
          <v-list three-line subheader width="inherit">
            <v-stepper v-model="stepper" vertical class="elevation-0">
              <v-stepper-step
                :complete="stepper > 1"
                step="1"
                :editable="editable"
              >
                Tạo hàng xuất
                <small>Thông tin chung</small>
              </v-stepper-step>

              <v-stepper-content step="1">
                <v-form ref="outboundForm" v-model="valid" validation>
                  <small>*Dấu sao là trường bắt buộc</small>
                  <v-row>
                    <v-col cols="12" sm="8">
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
                    <v-col cols="12" sm="4">
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
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="outboundLocal.grossWeight"
                        prepend-icon="fitness_center"
                        type="number"
                        label="Khối lượng hàng (kg)"
                        :rules="[required('khối lượng hàng')]"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="8">
                      <DatetimePicker
                        :datetime="outboundLocal.packingTime"
                        :return-value.sync="outboundLocal.packingTime"
                        dateicon="flight_land"
                        datelabel="Ngày đóng hàng"
                        timelabel="Giờ đóng hàng"
                      />
                    </v-col>
                  </v-row>
                  <v-row justify="start" align="end" class="pa-3">
                    <v-col
                      cols="12"
                      sm="1"
                      class="pa-0 pb-2"
                      style="max-width: 25px"
                    >
                      <v-icon>add_location</v-icon>
                    </v-col>
                    <v-col cols="12" sm="11" class="pa-0">
                      <label class="place-label">Nơi đóng hàng xuất</label>
                      <input
                        ref="inputAddress1"
                        class="place-input"
                        type="text"
                        placeholder="Nơi đóng hàng xuất (Kho hàng xuất)"
                        :rules="[required('nơi đóng hàng')]"
                        required
                      />
                      <!-- <v-text-field
                      v-model="outboundLocal.packingStation"
                      prepend-icon="location_on"
                      type="text"
                      label="Nơi đóng hàng xuất"
                    ></v-text-field>  --></v-col
                    >
                  </v-row>
                  <v-row
                    ><v-col cols="12">
                      <v-textarea
                        v-model="outboundLocal.goodsDescription"
                        prepend-icon="description"
                        outlined
                        row="1"
                        row-height="15"
                        type="text"
                        label="Mô tả hàng"
                      ></v-textarea> </v-col
                  ></v-row>

                  <v-btn color="primary" @click="stepper = 2" :disabled="!valid"
                    >Tiếp tục</v-btn
                  >
                </v-form>
              </v-stepper-content>

              <v-stepper-step
                :complete="stepper > 2"
                step="2"
                :editable="editable"
                >Điền Booking</v-stepper-step
              >

              <v-stepper-content step="2">
                <v-form ref="bookingForm" v-model="valid2" validation>
                  <small>*Dấu sao là trường bắt buộc</small>
                  <v-row
                    ><v-col cols="12" sm="4">
                      <v-text-field
                        v-model="outboundLocal.booking.number"
                        prepend-icon="import_export"
                        :rules="[required('Số booking')]"
                        type="text"
                        label="Số Booking*"
                      ></v-text-field> </v-col
                    ><v-col cols="12" sm="8">
                      <v-select
                        v-model="outboundLocal.booking.portOfLoading"
                        prepend-icon="flag"
                        :items="ports"
                        item-text="fullname"
                        return-object
                        :rules="[required('cảng xuất hàng')]"
                        no-data-text="Danh sách cảng rỗng."
                        label="Cảng xuất hàng*"
                      ></v-select></v-col
                  ></v-row>
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="outboundLocal.booking.unit"
                        prepend-icon="commute"
                        :rules="[required('số lượng Container cần')]"
                        label="Số lượng Container*"
                        type="number"
                        required
                      ></v-text-field> </v-col
                    ><v-col cols="12" sm="8">
                      <DatetimePicker
                        :datetime="outboundLocal.booking.cutOffTime"
                        :return-value.sync="outboundLocal.booking.cutOffTime"
                        dateicon="flight_takeoff"
                        datelabel="Ngày tàu cắt máng"
                        timelabel="Giờ cắt máng"
                      />
                    </v-col>
                  </v-row>
                  <v-row
                    ><v-col cols="12"
                      ><v-checkbox
                        v-model="outboundLocal.booking.isFcl"
                        label="Hàng nguyên cont"
                      ></v-checkbox></v-col
                  ></v-row>
                  <v-btn
                    color="primary"
                    @click="
                      stepper = 3;
                      createNewCode();
                    "
                    :disabled="!valid2"
                    >Tiếp tục</v-btn
                  >
                  <v-btn text @click="stepper = 1">Quay lại</v-btn>
                </v-form>
              </v-stepper-content>

              <v-stepper-step
                :complete="stepper > 3"
                step="3"
                :editable="editable"
                >Hoàn thành</v-stepper-step
              >

              <v-stepper-content step="3">
                <v-form ref="finishForm" v-model="valid3" validation>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="outboundLocal.code"
                        prepend-icon="gesture"
                        type="string"
                        label="Mã hàng xuất"
                        disabled
                      ></v-text-field
                    ></v-col>
                  </v-row>
                  <v-checkbox
                    v-model="checkbox"
                    label="Tôi đã đọc và đồng ý với các điều khoản sử dụng."
                  ></v-checkbox>
                  <v-btn
                    color="primary"
                    @click="createOutbound()"
                    :disabled="!checkbox"
                    >Hoàn tất</v-btn
                  >
                  <v-btn text @click="stepper = 2">Quay lại</v-btn>
                </v-form>
              </v-stepper-content>
            </v-stepper>
          </v-list>
        </v-card>

        <v-card class="order-1 flex-shrink-1 mx-auto my-5">
          <GoogleMapLoader
            :options="mapConfig"
            :apiKey="apiKey"
            :mapStyle="style"
          >
            <template slot-scope="{ google, map }">
              <!-- AUTOCOMPLETE ORIGIN GEOLOCATION -->
              <GoogleMapAutocomplete
                v-if="dialogAddSync"
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
        </v-card>
      </v-card>
      <!-- END CONTENT -->
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Ref, Watch } from "vue-property-decorator";
import { IOutbound } from "@/entity/outbound";
import FormValidate from "@/mixin/form-validate";
import { createOutbound } from "@/api/outbound";
import { getPorts } from "@/api/port";
import { IPort } from "@/entity/port";
import { getShippingLines } from "@/api/shipping-line";
import { IShippingLine } from "@/entity/shipping-line";
import { getContainerTypes } from "@/api/container-type";
import { IContainerType } from "@/entity/container-type";
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

import { getSupplier } from "@/api/supplier";
import { ISupplier } from "@/entity/supplier";

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
export default class CreateOutbound extends Vue {
  @Ref() inputAddress1!: HTMLInputElement;
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("outbounds", { type: Array }) outboundsSync!: Array<IOutbound>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;

  supplier = null as ISupplier | null;
  distanceMatrixResult = null as DistanceMatrix | null;
  style = { width: "600px", height: "500px" };
  origin = null as google.maps.places.PlaceResult | null;
  dateInit = addTimeToDate(new Date().toString());
  outboundLocal = {
    code: "",
    shippingLine: "",
    containerType: "",
    status: "",
    packingTime: this.dateInit,
    goodsDescription: "",
    packingStation: "",
    deliveryTime: "",
    grossWeight: 0,
    unitOfMeasurement: "KG",
    booking: {
      number: "",
      unit: 0,
      cutOffTime: this.dateInit,
      isFcl: true,
      portOfLoading: ""
    }
  } as IOutbound;
  // Form validate
  checkbox = false;
  editable = false;
  stepper = 1;
  valid = true;
  valid2 = true;
  valid3 = true;
  // API list
  ports: Array<IPort> = [];
  shippingLines: Array<IShippingLine> = [];
  containerTypes: Array<IContainerType> = [];
  unitOfMeasurements: Array<string> = [];

  // Outbound
  estimateTimeTravel() {
    /* TODO: Calculate Delivery Time:
     * deliveryTime = (duration: packingStation -> portOfLoading) + packingTime (+ bias)
     */
    if (this.distanceMatrixResult && this.distanceMatrixResult.duration) {
      const time = addMinutesToDate(
        this.outboundLocal.packingTime,
        (this.distanceMatrixResult.duration.value / 60) * 1.3
      );
      this.outboundLocal.deliveryTime = time;
      return time;
    }
  }

  createNewCode() {
    const randomString = Math.random()
      .toString(36)
      .substring(9);
    if (this.supplier != null) {
      // code = supplier + unit + containerType + shippingLine + billOfLading +  year-month-day
      this.outboundLocal.code =
        this.supplier.companyCode +
        "_" +
        this.outboundLocal.booking.unit +
        "x" +
        this.outboundLocal.containerType +
        "_" +
        this.outboundLocal.shippingLine +
        "_" +
        this.dateInit.slice(0, 10).replace(/-/g, "") +
        "_" +
        randomString;
    }
  }

  @Watch("dialogAddSync")
  onDialogAddSyncChange(val: boolean) {
    if (val == false) {
      this.clearForm();
    }
  }

  clearForm() {
    this.inputAddress1.value = "";
    this.origin = null;
    this.checkbox = false;
    this.stepper = 1;
    this.valid = false;
    this.valid2 = false;
    this.valid3 = false;
    this.dateInit = addTimeToDate(new Date().toString());
    this.distanceMatrixResult = null;
    this.outboundLocal = {
      shippingLine: "",
      containerType: "",
      status: "",
      packingTime: this.dateInit,
      goodsDescription: "",
      packingStation: "",
      deliveryTime: "",
      grossWeight: 0,
      unitOfMeasurement: "KG",
      booking: {
        number: "",
        unit: 0,
        cutOffTime: this.dateInit,
        isFcl: true,
        portOfLoading: ""
      }
    } as IOutbound;
  }

  async createOutbound() {
    /* TODO: Calculate Delivery Time:
     * deliveryTime = (duration: packingStation -> portOfLoading) + packingTime (+ bias)
     */
    const _portOfLoading = this.outboundLocal.booking.portOfLoading as IPort;
    this.outboundLocal.booking.portOfLoading = _portOfLoading.nameCode;
    // API CREATE OUTBOUND
    const _res = await createOutbound(this.outboundLocal);
    if (_res.data) {
      const _outbound = _res.data.data;
      this.outboundsSync.unshift(_outbound);
      this.totalItemsSync += 1;
      this.dialogAddSync = false;
    }
  }

  async created() {
    const _res = await getSupplier(this.$auth.user().username);
    if (_res.data) {
      const _supplier = _res.data;
      this.supplier = _supplier;
    }
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

  mounted() {
    console.log("CreateOutbound");
  }

  beforeDestroy() {
    console.log("DESTROY > CreateOutbound");
    this.stepper = 1;
    this.origin = null;
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
