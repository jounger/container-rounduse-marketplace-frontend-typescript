<template>
  <v-dialog
    v-model="dialogAddSync"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-row justify="center">
      <DeleteContainer
        v-if="dialogDelCont"
        :message.sync="messageSync"
        :snackbar.sync="snackbarSync"
        :container="container"
        :containers.sync="containers"
        :dialogDelCont.sync="dialogDelCont"
      />
    </v-row>
    <v-row justify="center">
      <CreateContainer
        v-if="dialogAddCont"
        :message.sync="messageSync"
        :snackbar.sync="snackbarSync"
        :container="container"
        :containers.sync="containers"
        :dialogAddCont.sync="dialogAddCont"
        :billOfLading="inboundLocal.billOfLading"
        :update="update"
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
            <v-stepper v-model="stepper" vertical>
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
                      <input
                        ref="inputAddress1"
                        class="place-input"
                        type="text"
                        placeholder="Noi dong hang"
                        :rules="[required('Noi dong hang')]"
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
                            label="Thời gian lấy containers đặc từ cảng*"
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
                  <v-btn color="primary" @click="stepper = 2" :disabled="!valid"
                    >Tiếp tục</v-btn
                  >
                  <!-- <v-btn text @click="dialogAddSync = false">Hủy</v-btn> -->
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
                        v-model="inboundLocal.billOfLading.billOfLadingNumber"
                        prepend-icon="play_for_work"
                        type="text"
                        :rules="[required('B/L No.')]"
                        label="B/L No.*"
                      ></v-text-field> </v-col
                    ><v-col cols="12" sm="6">
                      <v-select
                        v-model="inboundLocal.billOfLading.portOfDelivery"
                        prepend-icon="flag"
                        :items="portsToString"
                        :rules="[required('port of loading')]"
                        label="Cảng lấy container đặc*"
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
                            label="Thời gian được thuê cont"
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
                        label="Số lượng Cont*"
                      ></v-text-field
                    ></v-col>
                  </v-row>
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
                >Tạo hàng nhập</v-stepper-step
              >
              <v-stepper-content step="3">
                <v-form ref="finishForm" v-model="valid" validation>
                  <v-checkbox
                    v-model="checkbox"
                    :rules="[required('agree term')]"
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
                  class="elevation-1 my-1"
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
                <v-btn
                  color="primary"
                  @click="dialogAddSync = false"
                  :disabled="containers.length == 0"
                  >Hoàn tất</v-btn
                >
                <v-btn text @click="stepper = 3">Quay lại</v-btn>
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
import { PaginationResponse } from "@/api/payload";
import { addTimeToDate, addMinutesToDate } from "@/utils/tool";
import { createInbound } from "@/api/inbound";
import DeleteContainer from "./DeleteContainer.vue";
import CreateContainer from "./CreateContainer.vue";
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
  @PropSync("message", { type: String }) messageSync!: string;
  @PropSync("snackbar", { type: Boolean }) snackbarSync!: boolean;

  distanceMatrixResult = null as DistanceMatrix | null;
  style = { width: "600px", height: "500px" };
  origin = null as google.maps.places.PlaceResult | null;
  dateInit = new Date().toISOString().substr(0, 10);
  inboundLocal = {
    shippingLine: "",
    containerType: "",
    returnStation: "",
    status: "",
    emptyTime: "",
    pickupTime: this.dateInit,
    billOfLading: {
      billOfLadingNumber: "",
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
  update = true;
  // API list
  ports: Array<IPort> = [];
  shippingLines: Array<IShippingLine> = [];
  containerTypes: Array<IContainerType> = [];
  // inboundLocal form
  pickupTimePicker = false;

  // B/L form
  freeTimePicker = false;

  // Container form
  containerHeaders = [
    {
      text: "Container No.",
      align: "start",
      sortable: false,
      value: "containerNumber"
    },
    { text: "Tài xế", value: "driver" },
    { text: "Rơ mọt", value: "trailer" },
    { text: "Đầu kéo", value: "tractor" },
    {
      text: "Hành động",
      value: "actions"
    }
  ];
  containers = [] as Array<IContainer>;
  container = {} as IContainer;
  dialogAddCont = false;
  dialogDelCont = false;
  openCreateContainer() {
    this.update = false;
    this.container = {} as IContainer;
    this.dialogAddCont = true;
  }
  openUpdateContainer(item: IContainer) {
    // TODO
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
    this.valid = true;
    this.valid2 = true;
    this.dateInit = new Date().toISOString().substr(0, 10);
    this.distanceMatrixResult = null;
    this.pickupTimePicker = false;
    this.freeTimePicker = false;
    this.inboundLocal = {
      shippingLine: "",
      containerType: "",
      returnStation: "",
      status: "",
      emptyTime: "",
      pickupTime: this.dateInit,
      billOfLading: {
        billOfLadingNumber: "",
        containers: [] as Array<IContainer>,
        portOfDelivery: "",
        freeTime: this.dateInit,
        unit: 0
      }
    } as IInbound;
  }
  createInbound() {
    // TODO: API create inbound
    this.inboundLocal.pickupTime = addTimeToDate(this.inboundLocal.pickupTime);
    this.inboundLocal.billOfLading.freeTime = addTimeToDate(
      this.inboundLocal.billOfLading.freeTime
    );
    this.inboundLocal.billOfLading.containers = this.containers;

    /* TODO: Calculate Empty Time:
     * emptyTime = (duration: portOfDelivery -> returnStation) + pickupTime (+ bias)
     */
    createInbound(this.inboundLocal)
      .then(res => {
        console.log(res.data);
        const response: IInbound = res.data;
        this.messageSync =
          "Thêm mới thành công hàng nhập: " +
          response.billOfLading.billOfLadingNumber;
        this.inboundLocal = response;
        this.inboundsSync.unshift(response);
        this.totalItemsSync += 1;
        this.stepper = 4;
      })
      .catch(err => {
        console.log(err);
        this.messageSync = "Đã có lỗi xảy ra";
      })
      .finally(() => (this.snackbarSync = true));
  }
  getPortAddress(portCode: string) {
    if (portCode.length > 0) {
      const list = this.ports.filter(x => x.nameCode == portCode);
      if (list.length > 0) return list[0].address;
      return undefined;
    }
    return undefined;
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
  created() {
    getPorts({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IPort> = res.data;
        this.ports = response.data;
      })
      .catch(err => console.log(err))
      .finally();
    getShippingLines({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IShippingLine> = res.data;
        this.shippingLines = response.data.filter(
          x => x.roles[0] == "ROLE_SHIPPINGLINE"
        );
      })
      .catch(err => console.log(err))
      .finally();
    getContainerTypes({
      page: 0,
      limit: 100
    })
      .then(res => {
        const response: PaginationResponse<IContainerType> = res.data;
        this.containerTypes = response.data;
      })
      .catch(err => console.log(err))
      .finally();
  }

  beforeDestroy() {
    console.log("DESTROY > CreateOutbound");
    this.origin = null;
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
