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
        <v-toolbar-title>Chỉnh sửa hàng nhập</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <!-- START CONTENT -->
      <v-card
        class="d-flex justify-space-around align-start elevation-0"
        width="100%"
      >
        <v-card
          v-if="inboundLocal"
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
                Thông tin hàng nhập
                <small>Thông tin chung</small>
              </v-stepper-step>

              <v-stepper-content step="1">
                <v-form ref="inboundForm" v-model="valid" lazy-validation>
                  <small>*Dấu sao là trường bắt buộc</small>
                  <v-row
                    ><v-col cols="12" sm="8">
                      <v-select
                        v-model="inboundLocal.shippingLine"
                        prepend-icon="directions_boat"
                        :items="shippingLines"
                        item-text="companyName"
                        item-value="companyCode"
                        :rules="[required('hãng tàu')]"
                        no-data-text="Danh sách hãng tàu rỗng."
                        label="Hãng tàu*"
                      ></v-select> </v-col
                    ><v-col cols="12" sm="4">
                      <v-select
                        v-model="inboundLocal.containerType"
                        prepend-icon="directions_bus"
                        :items="containerTypes"
                        item-text="name"
                        item-value="name"
                        :rules="[required('loại Container')]"
                        label="Loại container*"
                        no-data-text="Danh sách loại Cont rỗng."
                      ></v-select> </v-col
                  ></v-row>
                  <v-row justify="start" align="end" class="pa-3"
                    ><v-col
                      cols="12"
                      sm="1"
                      class="pa-0 pb-2"
                      style="max-width: 25px"
                      ><v-icon>add_location</v-icon>
                    </v-col>
                    <v-col cols="12" sm="11" class="pa-0">
                      <label class="place-label">Nơi bốc dỡ hàng nhập</label>
                      <input
                        ref="inputAddress1"
                        class="place-input"
                        type="text"
                        placeholder="Nơi bốc dỡ hàng nhập (Kho hàng nhập)"
                        :rules="[required('nơi trả hàng')]"
                        required
                      />
                      <!-- <v-text-field
                          v-model="inboundLocal.returnStation"
                          prepend-icon="location_on"
                          type="text"
                          :rules="[required('return station')]"
                          label="Nơi bốc dỡ hàng nhập*"
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
                        disabled
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
                    ><v-col cols="12" sm="4">
                      <v-text-field
                        v-model="inboundLocal.billOfLading.number"
                        prepend-icon="play_for_work"
                        type="text"
                        :rules="[required('Số B/L')]"
                        label="Số B/L*"
                        disabled
                      ></v-text-field> </v-col
                    ><v-col cols="12" sm="8">
                      <v-select
                        v-model="inboundLocal.billOfLading.portOfDelivery"
                        prepend-icon="flag"
                        :items="ports"
                        item-text="fullname"
                        return-object
                        :rules="[required('cảng lấy cont hàng nhập')]"
                        no-data-text="Danh sách cảng rỗng."
                        label="Cảng lấy cont hàng nhập*"
                      ></v-select> </v-col
                  ></v-row>
                  <v-row>
                    <v-col cols="12" sm="4">
                      <v-text-field
                        v-model="inboundLocal.billOfLading.unit"
                        prepend-icon="local_shipping"
                        type="number"
                        :rules="[required('số lượng Container đăng ký')]"
                        label="Số lượng cont*"
                      ></v-text-field></v-col
                    ><v-col cols="12" sm="8">
                      <DatetimePicker
                        :datetime="inboundLocal.billOfLading.freeTime"
                        :return-value.sync="inboundLocal.billOfLading.freeTime"
                        dateicon="event_available"
                        datelabel="Ngày DEM/DET (Freetime)"
                        timelabel="Giờ Freetime"
                      />
                    </v-col>
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
                      destination:
                        inboundLocal.billOfLading.portOfDelivery.address,
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
                >Đi lúc: {{ formatDatetime(inboundLocal.pickupTime) }}</small
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
            v-if="!distanceMatrixResult && inboundLocal"
            vertical
            class="elevation-0 pb-0"
            :value="stepper2"
          >
            <v-stepper-step step="1" complete
              >{{ inboundLocal.returnStation }}
              <small class="mt-1"
                >Đi lúc: {{ formatDatetime(inboundLocal.pickupTime) }}</small
              >
            </v-stepper-step>
            <v-stepper-content step="1"></v-stepper-content>
            <v-stepper-step step="2" :complete="stepper2 >= 2"
              >{{ inboundLocal.billOfLading.portOfDelivery.address }}
              <small class="mt-1"
                >Đến (khoảng):
                {{ formatDatetime(inboundLocal.emptyTime) }}</small
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
import { IInbound } from "@/entity/inbound";
import FormValidate from "@/mixin/form-validate";
import { IPort } from "@/entity/port";
import { IShippingLine } from "@/entity/shipping-line";
import { IContainerType } from "@/entity/container-type";
import { addTimeToDate, addMinutesToDate } from "@/utils/tool";
import { editInbound } from "@/api/inbound";
import { getPorts } from "@/api/port";
import { getContainerTypes } from "@/api/container-type";
import { getShippingLines } from "@/api/shipping-line";
import { editBillOfLading } from "@/api/bill-of-lading";
import GoogleMapLoader from "@/components/googlemaps/GoogleMapLoader.vue";
import GoogleMapAutocomplete from "@/components/googlemaps/GoogleMapAutocomplete.vue";
import GoogleMapMarker from "@/components/googlemaps/GoogleMapMarker.vue";
import GoogleMapMixins from "@/components/googlemaps/map-mixins";
import GoogleMapDirection from "@/components/googlemaps/GoogleMapDirection.vue";
import GoogleMapDistanceMatrix from "@/components/googlemaps/GoogleMapDistanceMatrix.vue";
import { DistanceMatrix } from "@/components/googlemaps/map-interface";
import Utils from "@/mixin/utils";
import DatetimePicker from "@/components/DatetimePicker.vue";
import { IBillOfLading } from "@/entity/bill-of-lading";

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
  stepper2 = 1;
  valid = true;
  valid2 = true;
  // API list
  ports: Array<IPort> = [];
  shippingLines: Array<IShippingLine> = [];
  containerTypes: Array<IContainerType> = [];

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
    if (val == true && this.inbound) {
      this.inboundLocal = Object.assign({}, this.inbound);
      // REFACTOR SUPPLY
      const _shippingLine = this.inboundLocal.shippingLine as IShippingLine;
      const _containerType = this.inboundLocal.containerType as IContainerType;

      this.inboundLocal.shippingLine = _shippingLine.companyCode;
      this.inboundLocal.containerType = _containerType.name;
      // END
      this.$nextTick(() => {
        this.inputAddress1.value = this.inbound.returnStation;
      });
      const _isEmpty =
        new Date().getTime() - new Date(this.inbound.emptyTime).getTime();
      if (_isEmpty > 0) {
        this.stepper2 = 2;
      }
    } else {
      this.stepper = 1;
    }
  }

  async updateInbound() {
    // API UPDATE INBOUND
    const _res = await editInbound(
      this.inbound.id as number,
      this.inboundLocal as IInbound
    );
    if (_res.data && this.inboundLocal) {
      const _inbound = _res.data.data as IInbound;
      const index = this.inboundsSync.findIndex(x => x.id == _inbound.id);
      this.inboundsSync.splice(index, 1, _inbound);
      this.inboundLocal = Object.assign({}, _inbound);
      this.stepper = 2;
      // REFACTOR SUPPLY
      const _shippingLine = this.inboundLocal.shippingLine as IShippingLine;
      const _containerType = this.inboundLocal.containerType as IContainerType;

      this.inboundLocal.shippingLine = _shippingLine.companyCode;
      this.inboundLocal.containerType = _containerType.name;
      // END
    }
  }

  async updateBillOfLading() {
    if (this.inboundLocal && this.inboundLocal.billOfLading) {
      const _portOfDelivery = this.inboundLocal.billOfLading
        .portOfDelivery as IPort;
      this.inboundLocal.billOfLading.portOfDelivery = _portOfDelivery.nameCode;
      // API UPDATE BILLOFLADING
      const _res = await editBillOfLading(
        this.inboundLocal.billOfLading.id as number,
        this.inboundLocal.billOfLading
      );
      if (_res.data) {
        const _billOfLading = _res.data.data as IBillOfLading;
        const index = this.inboundsSync.findIndex(
          x => x.id === this.inbound.id
        );
        this.inboundsSync.splice(index, 1, {
          ...this.inboundsSync[index],
          billOfLading: _billOfLading
        });
        this.inboundLocal.billOfLading = _billOfLading;
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
    console.log("UpdateInbound");
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
