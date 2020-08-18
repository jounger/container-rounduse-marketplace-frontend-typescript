<template>
  <v-dialog
    v-model="dialogAddSync"
    fullscreen
    persistent
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-row justify="center">
      <DeleteContainer
        v-if="dialogDelCont"
        :container="container"
        :containers.sync="containers"
        :dialogDelCont.sync="dialogDelCont"
        :totalItems.sync="serverSideOptions.totalItems"
      />
    </v-row>
    <v-row justify="center">
      <CreateContainer
        v-if="dialogAddCont"
        :container="container"
        :containers.sync="containers"
        :dialogAddCont.sync="dialogAddCont"
        :billOfLading="inboundLocal.billOfLading"
        :update="update"
        :totalItems.sync="serverSideOptions.totalItems"
      />
    </v-row>
    <v-card tile>
      <!-- TITLE -->
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="dialogAddSync = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Hộp thoại thêm mới Hàng nhập</v-toolbar-title>
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
            <v-stepper v-model="stepper" vertical class="elevation-0">
              <v-stepper-step
                :complete="stepper > 1"
                step="1"
                :editable="editable"
              >
                Thêm mới Hàng nhập
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
                        :items="shippingLines"
                        item-text="companyName"
                        item-value="companyCode"
                        :rules="[required('hãng tàu')]"
                        no-data-text="Danh sách hãng tàu rỗng."
                        label="Hãng tàu*"
                      ></v-select> </v-col
                    ><v-col cols="12" sm="6">
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
                  <v-btn color="primary" @click="stepper = 2" :disabled="!valid"
                    >Tiếp tục</v-btn
                  >
                </v-form>
              </v-stepper-content>

              <v-stepper-step
                :complete="stepper > 2"
                step="2"
                :editable="editable"
                >Điền B/L</v-stepper-step
              >

              <v-stepper-content step="2">
                <v-form ref="billOfLadingForm" v-model="valid2" validation>
                  <small>*Dấu sao là trường bắt buộc</small>
                  <v-row
                    ><v-col cols="12" sm="6">
                      <v-text-field
                        v-model="inboundLocal.billOfLading.number"
                        prepend-icon="play_for_work"
                        type="text"
                        :rules="[required('Số B/L')]"
                        label="B/L No.*"
                      ></v-text-field> </v-col
                    ><v-col cols="12" sm="6">
                      <v-select
                        v-model="inboundLocal.billOfLading.portOfDelivery"
                        prepend-icon="flag"
                        :items="ports"
                        item-text="fullname"
                        return-object
                        :rules="[required('cảng lấy Container đặc')]"
                        no-data-text="Danh sách cảng rỗng."
                        label="Cảng lấy cont đặc*"
                      ></v-select> </v-col
                  ></v-row>
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
                >Tạo hàng nhập</v-stepper-step
              >
              <v-stepper-content step="3">
                <v-form ref="finishForm" v-model="valid3" validation>
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="inboundLocal.code"
                        prepend-icon="gesture"
                        type="string"
                        label="Mã hàng nhập"
                        disabled
                      ></v-text-field
                    ></v-col>
                  </v-row>
                  <v-checkbox
                    v-model="checkbox"
                    label="Bạn đồng ý rằng tất cả các thông tin đưa lên đều là chính xác."
                  ></v-checkbox>
                  <v-btn
                    color="primary"
                    @click="createInbound()"
                    :disabled="!checkbox"
                    >Tạo hàng nhập</v-btn
                  >
                  <v-btn text @click="stepper = 2">Quay lại</v-btn>
                </v-form>
              </v-stepper-content>
              <v-stepper-step
                :complete="stepper > 4"
                step="4"
                :editable="editable"
                >Thêm mới Containers hàng nhập</v-stepper-step
              >
              <!-- CREATE CONTAINER -->
              <v-stepper-content step="4">
                <v-data-table
                  :headers="containerHeaders"
                  :items="containers"
                  disable-sort
                  :loading="loading"
                  :options.sync="options"
                  :server-items-length="serverSideOptions.totalItems"
                  :footer-props="{
                    'items-per-page-options':
                      serverSideOptions.itemsPerPageItems
                  }"
                  :actions-append="options.page"
                  class="elevation-0 mb-1"
                >
                  <template v-slot:top>
                    <v-toolbar flat color="white">
                      <v-toolbar-title>Danh sách Container</v-toolbar-title>
                      <v-divider class="mx-4" inset vertical></v-divider>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="primary"
                        dark
                        class="mb-2"
                        @click="openCreateContainer()"
                        v-if="
                          containers.length < inboundLocal.billOfLading.unit
                        "
                        >Thêm mới</v-btn
                      >
                    </v-toolbar>
                  </template>
                  <template v-slot:item.actions="{ item }">
                    <v-icon
                      small
                      class="mr-2"
                      @click="openUpdateContainer(item)"
                    >
                      mdi-pencil
                    </v-icon>
                    <v-icon small @click="openRemoveContainer(item)">
                      mdi-delete
                    </v-icon>
                  </template>
                  <template v-slot:item.trailer="{ item }">
                    {{ item.trailer.licensePlate }}
                  </template>
                  <template v-slot:item.tractor="{ item }">
                    {{ item.tractor.licensePlate }}
                  </template>
                </v-data-table>
                <v-btn color="primary" @click="dialogAddSync = false"
                  >Hoàn tất</v-btn
                >
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
        </v-card>
      </v-container>
      <!-- END CONTENT -->
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Ref, Watch } from "vue-property-decorator";
import { IInbound } from "@/entity/inbound";
import { IContainer } from "@/entity/container";
import FormValidate from "@/mixin/form-validate";
import { IPort } from "@/entity/port";
import { IShippingLine } from "@/entity/shipping-line";
import { IContainerType } from "@/entity/container-type";
import { getPorts } from "@/api/port";
import { getShippingLines } from "@/api/shipping-line";
import { getContainerTypes } from "@/api/container-type";
import { addTimeToDate, addMinutesToDate } from "@/utils/tool";
import { createInbound } from "@/api/inbound";
import DeleteContainer from "./DeleteContainer.vue";
import CreateContainer from "./CreateContainer.vue";
import GoogleMapLoader from "@/components/googlemaps/GoogleMapLoader.vue";
import GoogleMapAutocomplete from "@/components/googlemaps/GoogleMapAutocomplete.vue";
import GoogleMapMarker from "@/components/googlemaps/GoogleMapMarker.vue";
import GoogleMapMixins from "@/components/googlemaps/map-mixins";
import GoogleMapDirection from "@/components/googlemaps/GoogleMapDirection.vue";
import GoogleMapDistanceMatrix from "@/components/googlemaps/GoogleMapDistanceMatrix.vue";
import { DistanceMatrix } from "@/components/googlemaps/map-interface";
import Utils from "@/mixin/utils";
import DatetimePicker from "@/components/DatetimePicker.vue";

import { DataOptions } from "vuetify";
import { getContainersByInbound } from "@/api/container";
import { getSupplier } from "@/api/supplier";
import { ISupplier } from "@/entity/supplier";

@Component({
  components: {
    DatetimePicker,
    DeleteContainer,
    CreateContainer,
    GoogleMapLoader,
    GoogleMapAutocomplete,
    GoogleMapMarker,
    GoogleMapDirection,
    GoogleMapDistanceMatrix
  },
  mixins: [FormValidate, Utils, GoogleMapMixins]
})
export default class CreateInbound extends Vue {
  @Ref() inputAddress1!: HTMLInputElement;
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("inbounds", { type: Array }) inboundsSync!: Array<IInbound>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;

  supplier = null as ISupplier | null;
  distanceMatrixResult = null as DistanceMatrix | null;
  style = { width: "600px", height: "500px" };
  origin = null as google.maps.places.PlaceResult | null;
  dateInit = addTimeToDate(new Date().toString());
  loading = false;
  inboundLocal = {
    code: "",
    shippingLine: "",
    containerType: "",
    returnStation: "",
    status: "",
    emptyTime: "",
    pickupTime: this.dateInit,
    billOfLading: {
      number: "",
      containers: [] as Array<IContainer>,
      portOfDelivery: "",
      freeTime: this.dateInit,
      unit: 0
    }
  } as IInbound;
  // Form validate
  checkbox = false;
  editable = false;
  stepper = 1;
  valid = true;
  valid2 = true;
  valid3 = true;
  update = true;
  // API list
  ports: Array<IPort> = [];
  shippingLines: Array<IShippingLine> = [];
  containerTypes: Array<IContainerType> = [];

  // Container form
  containerHeaders = [
    {
      text: "Container No.",
      align: "start",
      sortable: false,
      value: "number"
    },
    { text: "Tài xế", value: "driver.fullname" },
    { text: "Rơ mọt", value: "trailer" },
    { text: "Đầu kéo", value: "tractor" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];
  options = {
    page: 1,
    itemsPerPage: 5
  } as DataOptions;
  serverSideOptions = {
    totalItems: 0,
    itemsPerPageItems: [5, 10, 20, 50]
  };
  containers = [] as Array<IContainer>;
  container = null as IContainer | null;
  dialogAddCont = false;
  dialogDelCont = false;

  openCreateContainer() {
    this.update = false;
    this.container = null;
    this.dialogAddCont = true;
  }

  openUpdateContainer(item: IContainer) {
    this.update = true;
    this.container = item;
    this.dialogAddCont = true;
  }

  openRemoveContainer(item: IContainer) {
    this.container = item;
    this.dialogDelCont = true;
  }

  // Inbound
  estimateTimeTravel() {
    /* TODO: Calculate Empty Time:
     * emptyTime = (duration: portOfDelivery -> returnStation) + pickupTime (+ bias)
     */
    if (this.distanceMatrixResult && this.distanceMatrixResult.duration) {
      const time = addMinutesToDate(
        this.inboundLocal.pickupTime,
        (this.distanceMatrixResult.duration.value / 60) * 1.3
      );
      this.inboundLocal.emptyTime = time;
      return time;
    }
  }

  createNewCode() {
    const randomString = Math.random()
      .toString(36)
      .substring(9);
    if (this.supplier != null) {
      // code = supplier + unit + containerType + shippingLine + billOfLading +  year-month-day
      this.inboundLocal.code =
        this.supplier.companyCode +
        "_" +
        this.inboundLocal.billOfLading.unit +
        "x" +
        this.inboundLocal.containerType +
        "_" +
        this.inboundLocal.shippingLine +
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

  @Watch("options")
  async onOptionsChange(val: DataOptions) {
    if (typeof val != "undefined") {
      this.loading = true;
      if (this.inboundLocal.id) {
        const _res = await getContainersByInbound(this.inboundLocal.id, {
          page: val.page - 1,
          limit: val.itemsPerPage
        });
        if (_res.data) {
          const _inbounds = _res.data.data;
          this.containers = _inbounds;
          this.serverSideOptions.totalItems = _res.data.totalElements;
        }
      }
      this.loading = false;
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
    this.inboundLocal = {
      shippingLine: "",
      containerType: "",
      returnStation: "",
      status: "",
      emptyTime: "",
      pickupTime: this.dateInit,
      billOfLading: {
        number: "",
        containers: [] as Array<IContainer>,
        portOfDelivery: "",
        freeTime: this.dateInit,
        unit: 0
      }
    } as IInbound;
  }

  async createInbound() {
    this.inboundLocal.billOfLading.containers = this.containers;
    /* TODO: Calculate Empty Time:
     * emptyTime = (duration: portOfDelivery -> returnStation) + pickupTime (+ bias)
     */
    const _portOfDelivery = this.inboundLocal.billOfLading
      .portOfDelivery as IPort;
    this.inboundLocal.billOfLading.portOfDelivery = _portOfDelivery.nameCode;
    // API CREATE INBOUND
    const _res = await createInbound(this.inboundLocal);
    if (_res.data) {
      const _inbound = _res.data.data;
      this.inboundLocal = _inbound;
      this.inboundsSync.unshift(_inbound);
      this.totalItemsSync += 1;
      this.stepper = 4;
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
    const _res = await getSupplier(this.$auth.user().username);
    if (_res.data) {
      const _supplier = _res.data;
      this.supplier = _supplier;
    }
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
    console.log("DESTROY > CreateOutbound");
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
