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
                <v-form ref="inboundForm" v-model="valid" validation>
                  <small>*Dấu sao là trường bắt buộc</small>
                  <v-row
                    ><v-col cols="12" sm="6">
                      <v-select
                        v-model="inboundLocal.shippingLine"
                        prepend-icon="directions_boat"
                        :items="shippingLinesToString"
                        :rules="[required('shipping line')]"
                        label="Hãng tàu*"
                      ></v-select> </v-col
                    ><v-col cols="12" sm="6">
                      <v-select
                        v-model="inboundLocal.containerType"
                        prepend-icon="directions_bus"
                        :items="containerTypesToString"
                        :rules="[required('container type')]"
                        label="Loại container*"
                      ></v-select> </v-col
                  ></v-row>
                  <v-row
                    ><v-col cols="12">
                      <label for="">Nơi trả hàng</label>
                      <input
                        ref="inputAddress1"
                        class="place-input"
                        type="text"
                        placeholder="Nơi trả hàng"
                        :rules="[required('return station')]"
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
                    <v-col cols="12" sm="6">
                      <v-menu
                        ref="pickupTimePicker"
                        v-model="pickupTimePicker"
                        :close-on-content-click="false"
                        :return-value.sync="inboundLocal.pickupTime"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="inboundLocal.pickupTime"
                            label="Thời gian lấy cont đặc*"
                            prepend-icon="flight_land"
                            v-bind="attrs"
                            v-on="on"
                            :rules="[required('pickup time')]"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="inboundLocal.pickupTime"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="pickupTimePicker = false"
                            >Cancel</v-btn
                          >
                          <v-btn
                            text
                            color="primary"
                            @click="
                              $refs.pickupTimePicker.save(
                                inboundLocal.pickupTime
                              )
                            "
                            >OK</v-btn
                          >
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                  </v-row>
                  <v-btn
                    color="primary"
                    @click="updateInbound()"
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
                >Thông tin B/L</v-stepper-step
              >

              <v-stepper-content step="2">
                <v-form ref="billOfLadingForm" v-model="valid2" validation>
                  <small>*Dấu sao là trường bắt buộc</small>
                  <v-row
                    ><v-col cols="12" sm="6">
                      <v-text-field
                        v-model="inboundLocal.billOfLading.billOfLadingNumber"
                        prepend-icon="play_for_work"
                        type="text"
                        :rules="[required('Số B/L')]"
                        label="Số B/L*"
                      ></v-text-field> </v-col
                    ><v-col cols="12" sm="6">
                      <v-select
                        v-model="inboundLocal.billOfLading.portOfDelivery"
                        prepend-icon="flag"
                        :items="portsToString"
                        :rules="[required('port of loading')]"
                        label="Cảng lấy cont đặc*"
                      ></v-select> </v-col
                  ></v-row>
                  <v-row
                    ><v-col cols="12" sm="6">
                      <v-menu
                        ref="freeTimePicker"
                        v-model="freeTimePicker"
                        :close-on-content-click="false"
                        :return-value.sync="inboundLocal.billOfLading.freeTime"
                        transition="scale-transition"
                        offset-y
                        min-width="290px"
                      >
                        <template v-slot:activator="{ on, attrs }">
                          <v-text-field
                            v-model="inboundLocal.billOfLading.freeTime"
                            label="Thời gian DEM/DET (Freetime)"
                            prepend-icon="event_available"
                            v-bind="attrs"
                            v-on="on"
                          ></v-text-field>
                        </template>
                        <v-date-picker
                          v-model="inboundLocal.billOfLading.freeTime"
                          no-title
                          scrollable
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="freeTimePicker = false"
                            >Cancel</v-btn
                          >
                          <v-btn
                            text
                            color="primary"
                            @click="
                              $refs.freeTimePicker.save(
                                inboundLocal.billOfLading.freeTime
                              )
                            "
                            >OK</v-btn
                          >
                        </v-date-picker>
                      </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="inboundLocal.billOfLading.unit"
                        prepend-icon="local_shipping"
                        type="number"
                        :rules="[required('unit')]"
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
import { PaginationResponse } from "@/api/payload";
import { editBillOfLading } from "@/api/bill-of-lading";
import { IBillOfLading } from "@/entity/bill-of-lading";
import GoogleMapLoader from "@/components/googlemaps/GoogleMapLoader.vue";
import GoogleMapAutocomplete from "@/components/googlemaps/GoogleMapAutocomplete.vue";
import GoogleMapMarker from "@/components/googlemaps/GoogleMapMarker.vue";
import GoogleMapMixins from "@/components/googlemaps/map-mixins";
import { apiKey } from "@/components/googlemaps/map-constant";
import GoogleMapDirection from "@/components/googlemaps/GoogleMapDirection.vue";
import GoogleMapDistanceMatrix from "@/components/googlemaps/GoogleMapDistanceMatrix.vue";
import { DistanceMatrix } from "@/components/googlemaps/map-interface";
import Utils from "@/mixin/utils";

@Component({
  components: {
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
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;
  // Form validate
  distanceMatrixResult = null as DistanceMatrix | null;
  style = { width: "600px", height: "500px" };
  origin = null as google.maps.places.PlaceResult | null;
  dateInit = new Date().toISOString().substr(0, 10);
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

  // inbound form
  pickupTimePicker = false;

  // B/L form
  freeTimePicker = false;

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
  onDialogEditSyncChange(val: boolean) {
    if (val == true) {
      if (!isEmptyObject(this.inbound)) {
        this.inboundLocal = Object.assign({}, this.inbound);
        this.$nextTick(() => {
          this.inputAddress1.value = this.inbound.returnStation;
        });
      }
    } else {
      this.stepper = 1;
    }
  }
  updateInbound() {
    // TODO: API update inbound
    if (this.inboundLocal && this.inboundLocal.id) {
      this.inboundLocal.pickupTime = addTimeToDate(
        this.inboundLocal.pickupTime
      );
      this.inboundLocal.billOfLading.freeTime = addTimeToDate(
        this.inboundLocal.billOfLading.freeTime
      );
      console.log(this.inboundLocal);
      editInbound(this.inboundLocal.id, this.inboundLocal)
        .then(res => {
          console.log(res.data);
          const response: IInbound = res.data;
          this.messageSync =
            "Cập nhập thành công hàng nhập: " +
            response.billOfLading.billOfLadingNumber;
          const index = this.inboundsSync.findIndex(x => x.id == response.id);
          this.inboundsSync.splice(index, 1, response);
          this.stepper = 2;
        })
        .catch(err => {
          console.log(err);
          this.messageSync = "Đã có lỗi xảy ra";
        })
        .finally(() => (this.snackbarSync = true));
    }
  }

  updateBillOfLading() {
    if (this.inboundLocal && this.inboundLocal.billOfLading.id) {
      this.inboundLocal.billOfLading.freeTime = addTimeToDate(
        this.inboundLocal.billOfLading.freeTime
      );
      editBillOfLading(
        this.inboundLocal.billOfLading.id,
        this.inboundLocal.billOfLading
      )
        .then(res => {
          const response: IBillOfLading = res.data;
          if (this.inboundLocal) {
            this.messageSync =
              "Cập nhập thành công B/L: " + response.billOfLadingNumber;
            const index = this.inboundsSync.findIndex(
              x => x.id === this.inbound.id
            );
            this.inboundLocal.billOfLading = response;
            this.inboundsSync.splice(index, 1, this.inboundLocal);
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
    if (!isEmptyObject(this.inbound)) {
      this.inboundLocal = Object.assign({}, this.inbound);
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
    console.log("UpdateInbound");
    // TODO: API get Ports
    // TODO: API get Shipping Line
    // TODO: API get Container Type
    //TODO: API get unit of mesurement
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
.place-input {
  height: 40px;
  width: -webkit-fill-available;
  margin: 10px;
  border-bottom: 1px solid #000;
  padding: 5px 5px;
}
</style>
