<template>
  <div>
    <template v-if="Boolean(this.router)">
      <slot :origin="router.origin" :destination="router.destination" />
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { google } from "google-maps";

@Component
export default class GoogleMapDirection extends Vue {
  @Prop() readonly google!: google;
  @Prop() readonly map!: google.maps.Map<HTMLDivElement>;
  @Prop() readonly router!: google.maps.DirectionsRequest;

  directionsService = null as google.maps.DirectionsService | null;
  directionsRenderer = null as google.maps.DirectionsRenderer | null;

  rendererService(
    response: google.maps.DirectionsResult,
    status: google.maps.DirectionsStatus
  ) {
    if (status === "OK" && this.directionsRenderer) {
      console.log("Directions request success ", response);
      this.directionsRenderer.setDirections(response);
    } else {
      console.log("Directions request failed due to " + status);
    }
  }

  @Watch("router", { immediate: true })
  onRouterChange(val: google.maps.DirectionsRequest) {
    if (typeof val !== "undefined" && val.origin && val.destination) {
      console.log("GoogleMapDirection > onRouterChange ", val);
      setTimeout(() => {
        if (this.directionsService)
          this.directionsService.route(val, this.rendererService);
      }, process.env.VUE_APP_GMAP_RATE);
    } else {
      console.log("GoogleMapDirection > watch");
    }
  }

  mounted() {
    if (this.google && this.map && this.directionsService == null) {
      this.directionsService = new this.google.maps.DirectionsService();
    }
    if (this.directionsService && this.directionsRenderer == null) {
      this.directionsRenderer = new this.google.maps.DirectionsRenderer();
      this.directionsRenderer.setMap(this.map);
    }
  }

  beforeDestroy() {
    console.log("DESTROY > GoogleMapDirection");
    if (this.directionsRenderer) {
      this.directionsRenderer.setMap(null);
      this.directionsRenderer = null;
    }
    if (this.directionsService) {
      this.directionsService = null;
    }
  }
}
</script>
