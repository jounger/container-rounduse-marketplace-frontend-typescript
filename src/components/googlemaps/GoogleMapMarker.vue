<template>
  <div></div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { google } from "google-maps";
@Component
export default class GoogleMapMarker extends Vue {
  @Prop() readonly google!: google;
  @Prop() readonly map!: google.maps.Map<HTMLDivElement>;
  @Prop() readonly marker!: google.maps.MarkerOptions;
  @Prop() readonly visible!: boolean;

  mapMarker = null as google.maps.Marker | null;

  @Watch("marker")
  onMarkerChange(
    val: google.maps.MarkerOptions,
    oldVal: google.maps.MarkerOptions
  ) {
    if (typeof val !== "undefined") {
      const valPos = val.position as google.maps.LatLng;
      const oldValPos = oldVal.position as google.maps.LatLng;
      if (
        this.mapMarker &&
        (valPos.lat !== oldValPos.lat || valPos.lng !== oldValPos.lng)
      ) {
        console.log("GoogleMapMarker > onMarkerChange ", val);
        if (typeof this.visible !== "undefined")
          this.mapMarker.setVisible(this.visible);
        this.mapMarker.setPosition(this.marker.position as google.maps.LatLng);
        this.mapMarker.setVisible(true);
      }
    } else {
      console.log("GoogleMapMarker > watch");
    }
  }

  mounted() {
    console.log("GoogleMapMarker", this.marker.position);
    if (this.google && this.map && this.mapMarker == null) {
      this.mapMarker = new this.google.maps.Marker({
        position: this.marker.position,
        map: this.map,
        title: this.marker.title
      });
    }
  }

  beforeDestroy() {
    console.log("DESTROY > GoogleMapMarker");
    if (this.mapMarker) {
      this.mapMarker.setMap(null);
      this.mapMarker = null;
    }
  }
}
</script>
