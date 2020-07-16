<template>
  <v-dialog
    v-model="dialogEditSync"
    fullscreen
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
                        :rules="[required('shipping line')]"
                        label="Hãng tàu*"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-select
                        v-model="outboundLocal.containerType"
                        prepend-icon="directions_bus"
                        :items="containerTypesToString"
                        :rules="[required('container type')]"
                        label="Loại container*"
                      ></v-select>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12">
                      <!-- <v-menu
                        ref="packingTimePicker"
                        v-model="packingTimePicker"
                        :close-on-content-click="false"
                        :return-value.sync="outboundLocal.packingTime"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="outboundLocal.packingTime"
                            label="Thời gian đóng hàng"
                            prepend-icon="event"
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="outboundLocal.packingTime"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="packingTimePicker = false"
                            >Cancel</v-btn
                          >
                          <v-btn
                            text
                            color="primary"
                            @click="
                              $refs.packingTimePicker.save(
                                outboundLocal.packingTime
                              )
                            "
                            >OK</v-btn
                          >
                        </v-date-picker>
                      </v-menu> -->
                      <DatetimePicker
                        :datetime="outboundLocal.packingTime"
                        :return-value.sync="outboundLocal.packingTime"
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
                        :rules="[required('packing station')]"
                        required
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
                  <!-- <v-btn text @click="dialogEditSync = false">Hủy</v-btn> -->
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
                        v-model="outboundLocal.booking.bookingNumber"
                        prepend-icon="child_friendly"
                        :rules="[required('booking number')]"
                        type="text"
                        label="Số Booking*"
                        required
                      ></v-text-field> </v-col
                    ><v-col cols="12" sm="6">
                      <v-select
                        v-model="outboundLocal.booking.portOfLoading"
                        prepend-icon="flag"
                        :items="portsToString"
                        :rules="[required('port of loading')]"
                        label="Cảng xuất hàng*"
                        required
                      ></v-select> </v-col
                  ></v-row>
                  <v-row
                    ><v-col cols="12">
                      <!-- <v-menu
                        ref="cutOffTimePicker"
                        v-model="cutOffTimePicker"
                        :close-on-content-click="false"
                        :return-value.sync="outboundLocal.booking.cutOffTime"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="outboundLocal.booking.cutOffTime"
                            label="Thời gian tàu cắt máng*"
                            prepend-icon="flight_takeoff"
                            v-bind="attrs"
                            v-on="on"
                            required
                            :rules="[required('cut off time')]"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="outboundLocal.booking.cutOffTime"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="cutOffTimePicker = false"
                            >Cancel</v-btn
                          >
                          <v-btn
                            text
                            color="primary"
                            @click="
                              $refs.cutOffTimePicker.save(
                                outboundLocal.booking.cutOffTime
                              )
                            "
                            >OK</v-btn
                          >
                        </v-date-picker>
                      </v-menu> -->
                      <DatetimePicker
                        :datetime="outboundLocal.booking.cutOffTime"
                        :return-value.sync="outboundLocal.booking.cutOffTime"
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
                        :rules="[required('unit')]"
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
import { PaginationResponse } from "@/api/payload";
import { editOutbound } from "@/api/outbound";
import { editBooking } from "@/api/booking";
import { IBooking } from "@/entity/booking";
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
  @Prop(Object) outbound!: IOutbound;
  @PropSync("outbounds", { type: Array }) outboundsSync!: Array<IOutbound>;
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

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
  // outboundLocal form
  packingTimePicker = false;

  // B/L form
  cutOffTimePicker = false;

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
  onDialogEditSyncChange(val: boolean) {
    if (val == true) {
      if (!isEmptyObject(this.outbound)) {
        this.outboundLocal = Object.assign({}, this.outbound);
        this.$nextTick(() => {
          this.inputAddress1.value = this.outbound.packingStation;
        });
      }
    } else {
      this.stepper = 1;
    }
  }
  updateOutbound() {
    // TODO: API edit outbound
    if (this.outboundLocal && this.outboundLocal.id) {
      this.outboundLocal.packingTime = addTimeToDate(
        this.outboundLocal.packingTime
      );
      this.outboundLocal.booking.cutOffTime = addTimeToDate(
        this.outboundLocal.booking.cutOffTime
      );
      console.log(this.outboundLocal);
      editOutbound(this.outboundLocal.id, this.outboundLocal)
        .then(res => {
          console.log(res.data);
          const response: IOutbound = res.data;
          this.messageSync =
            "Cập nhập thành công hàng xuất: " + response.booking.bookingNumber;
          const index = this.outboundsSync.findIndex(x => x.id == response.id);
          this.outboundsSync.splice(index, 1, response);
          this.stepper = 2;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }
  updateBooking() {
    if (this.outboundLocal && this.outboundLocal.booking.id) {
      this.outboundLocal.booking.cutOffTime = addTimeToDate(
        this.outboundLocal.booking.cutOffTime
      );
      editBooking(this.outboundLocal.booking.id, this.outboundLocal.booking)
        .then(res => {
          const response: IBooking = res.data;
          if (this.outboundLocal) {
            this.messageSync =
              "Cập nhập thành công Booking: " + response.bookingNumber;
            const index = this.outboundsSync.findIndex(
              x => x.id === this.outbound.id
            );
            this.outboundLocal.booking = response;
            this.outboundsSync.splice(index, 1, this.outboundLocal);
          }
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
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
  async created() {
    if (!isEmptyObject(this.outbound)) {
      this.outboundLocal = Object.assign({}, this.outbound);
    }
    // API GET Ports
    const _ports = await getPorts({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IPort> = res.data;
        return response.data;
      })
      .catch(err => console.log(err))
      .finally();
    this.ports = _ports || [];
    // API GET Shipping Line
    const _shippingLines = await getShippingLines({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IShippingLine> = res.data;
        return response.data.filter(x => x.roles[0] == "ROLE_SHIPPINGLINE");
      })
      .catch(err => console.log(err))
      .finally();
    this.shippingLines = _shippingLines || [];
    // API GET Container Type
    const _containerTypes = await getContainerTypes({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IContainerType> = res.data;
        return response.data;
      })
      .catch(err => console.log(err))
      .finally();
    this.containerTypes = _containerTypes || [];
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
    // TODO: API get Ports
    // TODO: API get Shipping Line
    // TODO: API get Container Type
    //TODO: API get unit of mesurement
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
