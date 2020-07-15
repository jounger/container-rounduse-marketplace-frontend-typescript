<template>
  <div>
    <template v-if="Boolean(this.distanceLocal)">
      <slot :distance="distanceLocal" />
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { google } from "google-maps";
import { LIMIT_RATE } from "./map-constant";

@Component
export default class GoogleMapDistanceMatrix extends Vue {
  @Prop() readonly google!: google;
  @Prop() readonly map!: google.maps.Map<HTMLDivElement>;
  @Prop() readonly routers!: google.maps.DistanceMatrixRequest;
  @Prop({ default: false }) readonly single!: boolean;

  distanceLocal = null as google.maps.DistanceMatrixResponse | null;
  distanceMatrixService = null as google.maps.DistanceMatrixService | null;

  responseService(
    response: google.maps.DistanceMatrixResponse,
    status: google.maps.DistanceMatrixStatus
  ) {
    if (status === "OK") {
      console.log("DistanceMatrix request success ", response);
      this.distanceLocal = response;
    } else {
      console.log("DistanceMatrix request failed due to " + status);
    }
  }

  getLastElement(
    array:
      | string[]
      | google.maps.LatLng[]
      | google.maps.LatLngLiteral[]
      | google.maps.Place[]
  ) {
    if (array && array.length > 0)
      return array[array.length - 1] as
        | string[]
        | google.maps.LatLng[]
        | google.maps.LatLngLiteral[]
        | google.maps.Place[];
    return [];
  }

  @Watch("routers", { immediate: true })
  onRoutersChange(val: google.maps.DistanceMatrixRequest) {
    if (typeof val !== "undefined" && val.origins && val.destinations) {
      console.log("GoogleMapDistanceMatrix > onRoutersChange ", val);
      if (this.single) {
        const cloneVal = Object.assign({}, val, {
          origins: [this.getLastElement(val.origins)],
          destinations: [this.getLastElement(val.destinations)]
        });
        setTimeout(() => {
          if (this.distanceMatrixService)
            this.distanceMatrixService.getDistanceMatrix(
              cloneVal,
              this.responseService
            );
        }, LIMIT_RATE);
      } else {
        setTimeout(() => {
          if (this.distanceMatrixService)
            this.distanceMatrixService.getDistanceMatrix(
              val,
              this.responseService
            );
        }, LIMIT_RATE);
      }
    } else {
      console.log("GoogleMapDistanceMatrix > watch");
    }
  }
  mounted() {
    if (this.google && this.map && this.distanceMatrixService == null) {
      this.distanceMatrixService = new this.google.maps.DistanceMatrixService();
    }
  }

  beforeDestroy() {
    console.log("DESTROY > GoogleMapDistanceMatrix");
    if (this.distanceMatrixService) {
      this.distanceMatrixService = null;
    }
    if (this.distanceLocal) {
      this.distanceLocal = null;
    }
  }
}
</script>
