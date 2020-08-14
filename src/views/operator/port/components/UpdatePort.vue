<template>
  <v-dialog v-model="dialogEditSync" max-width="900px">
    <v-card>
      <v-toolbar color="primary" light flat>
        <v-btn icon dark @click="dialogEditSync = false">
          <v-icon>mdi-close</v-icon> </v-btn
        ><v-toolbar-title
          ><span class="headline" style="color:white;"
            >Hộp thoại chỉnh sửa cảng</span
          >
        </v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-container class="d-flex justify-space-around align-start">
          <div
            v-if="portLocal"
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
                    disabled
                    v-model="portLocal.nameCode"
                    :rules="[required('mã bến cảng')]"
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
                    :rules="[required('tên bến cảng')]"
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <label for="">Vị trí cảng</label>
                  <input
                    ref="inputAddress1"
                    class="place-input"
                    type="text"
                    placeholder="Vị trí cảng"
                    :rules="[required('vị trí bến cảng')]"
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
            <v-card-actions v-if="portLocal && portLocal.address">
              <v-bottom-navigation class="elevation-0">
                <v-btn :value="portLocal.address">
                  <span>{{ portLocal.address }}</span>
                  <v-icon>mdi-map-marker</v-icon>
                </v-btn>
              </v-bottom-navigation>
            </v-card-actions>
          </v-card>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialogEditSync = false">Hủy</v-btn>
        <v-btn @click="updatePort()" color="primary" :disabled="!valid"
          >Lưu</v-btn
        >
      </v-card-actions>
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
import { IPort } from "@/entity/port";
import { editPort } from "@/api/port";
import FormValidate from "@/mixin/form-validate";
import GoogleMapLoader from "@/components/googlemaps/GoogleMapLoader.vue";
import GoogleMapAutocomplete from "@/components/googlemaps/GoogleMapAutocomplete.vue";
import GoogleMapMarker from "@/components/googlemaps/GoogleMapMarker.vue";
import GoogleMapMixins from "@/components/googlemaps/map-mixins";
import Utils from "@/mixin/utils";
import { isEmptyObject } from "@/utils/tool";

@Component({
  components: {
    GoogleMapLoader,
    GoogleMapAutocomplete,
    GoogleMapMarker
  },
  mixins: [FormValidate, Utils, GoogleMapMixins]
})
export default class UpdatePort extends Vue {
  @Ref() inputAddress1!: HTMLInputElement;
  @PropSync("dialogEdit", { type: Boolean }) dialogEditSync!: boolean;
  @PropSync("ports", { type: Array }) portsSync!: Array<IPort>;
  @Prop(Object) port!: IPort;

  style = { width: "400px", height: "300px" };
  origin = null as google.maps.places.PlaceResult | null;
  portLocal = null as IPort | null;
  valid = false;

  @Watch("dialogEditSync")
  onDialogEditSyncChange(val: boolean) {
    if (val == true) {
      if (!isEmptyObject(this.port)) {
        this.portLocal = Object.assign({}, this.port);
        this.$nextTick(() => {
          this.inputAddress1.value = this.port.address;
        });
      }
    }
  }
  async updatePort() {
    if (this.portLocal && this.portLocal.id) {
      const _res = await editPort(this.portLocal.id, this.portLocal);
      if (_res.data) {
        const _port = _res.data.data;
        const index = this.portsSync.findIndex(x => x.id == _port.id);
        this.portsSync.splice(index, 1, _port);
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
  created() {
    console.log("UpdatePort");
    if (!isEmptyObject(this.port)) {
      this.portLocal = Object.assign({}, this.port);
    }
  }
  get apiKey() {
    return process.env.VUE_APP_GMAP_KEY;
  }
  beforeDestroy() {
    console.log("DESTROY > UpdatePort");
    this.origin = null;
    this.portLocal = null;
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
