<template>
  <v-dialog v-model="dialogAddSync" max-width="900px">
    <v-card>
      <v-card-title class="headline">Thêm mới cảng</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-card
          class="d-flex justify-space-around align-start elevation-0"
          width="100%"
        >
          <div
            class="order-0 flex-grow-0 mx-auto mr-5 my-5"
            :style="{ width: '600px' }"
          >
            <v-form ref="portForm" v-model="valid" validation>
              <small>*Dấu sao là trường bắt buộc</small>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Mã cảng*"
                    name="nameCode"
                    prepend-icon="verified_user"
                    type="text"
                    v-model="portLocal.nameCode"
                    :rules="[required('mã cảng')]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Tên cảng*"
                    name="fullname"
                    prepend-icon="flag"
                    type="text"
                    v-model="portLocal.fullname"
                    :rules="[required('tên cảng')]"
                  ></v-text-field>
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
                  <label class="place-label">Vị trí cảng</label>
                  <input
                    ref="inputAddress1"
                    class="place-input"
                    type="text"
                    placeholder="Vị trí cảng*"
                    :rules="[required('vị trí cảng')]"
                    required
                  />
                  <!-- <v-text-field
                    label="Vị trí cảng"
                    name="address"
                    prepend-icon="room"
                    type="text"
                    v-model="portLocal.address"
                    :rules="[required('address')]"
                  ></v-text-field> -->
                </v-col>
              </v-row>
            </v-form>
          </div>
          <v-card class="order-1 flex-shrink-1 mx-auto my-5 elevation-0">
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
                      {{ (portLocal.address = address) }}
                    </div>
                    <GoogleMapMarker
                      :visible="false"
                      :marker="getMarkerFromPlace(place, address)"
                      :google="google"
                      :map="map"
                    />
                  </template>
                </GoogleMapAutocomplete>
              </template>
            </GoogleMapLoader>
          </v-card>
        </v-card>
      </v-card-text>
      <v-card-actions class="justify-space-between">
        <v-btn @click="dialogAddSync = false">Trở về</v-btn>
        <v-btn @click="createPort()" color="primary" :disabled="!valid"
          >Thêm mới</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import { Component, Vue, PropSync, Ref, Watch } from "vue-property-decorator";
import { IPort } from "@/entity/port";
import { createPort } from "@/api/port";
import FormValidate from "@/mixin/form-validate";
import GoogleMapLoader from "@/components/googlemaps/GoogleMapLoader.vue";
import GoogleMapAutocomplete from "@/components/googlemaps/GoogleMapAutocomplete.vue";
import GoogleMapMarker from "@/components/googlemaps/GoogleMapMarker.vue";
import GoogleMapMixins from "@/components/googlemaps/map-mixins";
import Utils from "@/mixin/utils";

@Component({
  components: {
    GoogleMapLoader,
    GoogleMapAutocomplete,
    GoogleMapMarker
  },
  mixins: [FormValidate, Utils, GoogleMapMixins]
})
export default class CreatePort extends Vue {
  @Ref() inputAddress1!: HTMLInputElement;
  @PropSync("dialogAdd", { type: Boolean }) dialogAddSync!: boolean;
  @PropSync("ports", { type: Array }) portsSync!: Array<IPort>;
  @PropSync("totalItems", { type: Number }) totalItemsSync!: number;

  style = { width: "400px", height: "300px" };
  origin = null as google.maps.places.PlaceResult | null;
  portLocal = {
    fullname: "",
    nameCode: "",
    address: ""
  } as IPort;
  valid = false;

  @Watch("dialogAddSync")
  onDialogAddSyncChange(val: boolean) {
    if (val == false) {
      this.clearForm();
    }
  }

  clearForm() {
    this.inputAddress1.value = "";
    this.origin = null;
    this.valid = false;
    this.portLocal = {
      fullname: "",
      nameCode: "",
      address: ""
    } as IPort;
  }

  async createPort() {
    if (this.portLocal) {
      const _res = await createPort(this.portLocal);
      if (_res.data) {
        const _port = _res.data.data;
        this.portsSync.unshift(_port);
        this.totalItemsSync += 1;
        this.dialogAddSync = false;
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

  beforeDestroy() {
    console.log("DESTROY > CreatePort");
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
  margin: 10px;
  border-bottom: 1px solid #000;
  padding: 5px 5px;
}
</style>
