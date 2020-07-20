<template>
  <v-dialog
    v-model="dialogAddSync"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card tile>
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogAddSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Hộp thoại thêm mới hàng xuất</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn dark text @click="clearForm()">Xóa dữ liệu đã nhập</v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-container class="d-flex justify-space-around align-start">
        <div
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
                Tạo hàng xuất
                <small>Thông tin chung</small>
              </v-stepper-step>

              <v-stepper-content step="1">
                <v-form ref="outboundForm" v-model="valid" validation>
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
                    @click="stepper = 3"
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
                <v-form ref="finishForm">
                  <v-checkbox
                    v-model="checkbox"
                    label="Bạn đồng ý rằng tất cả các thông tin đưa lên đều là chính xác."
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
        </v-card>
      </v-container>
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
import { PaginationResponse } from "@/api/payload";
import { IPort } from "@/entity/port";
import { getShippingLines } from "@/api/shipping-line";
import { IShippingLine } from "@/entity/shipping-line";
import { getContainerTypes } from "@/api/container-type";
import { IContainerType } from "@/entity/container-type";
import { addTimeToDate, getErrorMessage } from "@/utils/tool";
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
import snackbar from "@/store/modules/snackbar";

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

  distanceMatrixResult = null as DistanceMatrix | null;
  style = { width: "600px", height: "500px" };
  origin = null as google.maps.places.PlaceResult | null;
  dateInit = addTimeToDate(new Date().toString());
  outboundLocal = {
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
      bookingNumber: "",
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
  // API list
  ports: Array<IPort> = [];
  shippingLines: Array<IShippingLine> = [];
  containerTypes: Array<IContainerType> = [];
  unitOfMeasurements: Array<string> = [];
  // outboundLocal form
  packingTimePicker = false;

  // B/L form
  cutOffTimePicker = false;

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
    this.dateInit = addTimeToDate(new Date().toString());
    this.distanceMatrixResult = null;
    this.packingTimePicker = false;
    this.cutOffTimePicker = false;
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
        bookingNumber: "",
        unit: 0,
        cutOffTime: this.dateInit,
        isFcl: true,
        portOfLoading: ""
      }
    } as IOutbound;
  }

  async createOutbound() {
    // TODO: API create outbound
    this.outboundLocal.packingTime = addTimeToDate(
      this.outboundLocal.packingTime
    );
    this.outboundLocal.booking.cutOffTime = addTimeToDate(
      this.outboundLocal.booking.cutOffTime
    );
    /* TODO: Calculate Delivery Time:
     * deliveryTime = (duration: packingStation -> portOfLoading) + packingTime (+ bias)
     */
    console.log(this.outboundLocal);
    const _outbound = await createOutbound(this.outboundLocal)
      .then(res => {
        const response: IOutbound = res.data;
        console.log("response", response);
        snackbar.setSnackbar({
          text:
            "Thêm mới thành công hàng xuất: " + response.booking.bookingNumber,
          color: "success"
        });
        return response;
      })
      .catch(err => {
        console.log(err);
        snackbar.setSnackbar({
          text: getErrorMessage(err),
          color: "error"
        });
        return null;
      });
    if (_outbound) {
      this.outboundsSync.unshift(_outbound);
      this.totalItemsSync += 1;
    }
    snackbar.setDisplay(true);
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
    // API GET Ports
    const _ports = await getPorts({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IPort> = res.data;
        return response.data;
      })
      .catch(err => console.log(err));
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
      .catch(err => console.log(err));
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
      .catch(err => console.log(err));
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
    console.log("CreateOutbound");
    this.unitOfMeasurements = ["KG"];
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
