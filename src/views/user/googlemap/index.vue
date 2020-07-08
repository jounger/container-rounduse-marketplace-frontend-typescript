<template>
  <GoogleMapLoader :mapConfig="mapConfig">
    <template slot-scope="{ google, map }">
      <GoogleMapMarker
        v-for="(marker, index) in markers"
        :key="index"
        :marker="marker"
        :google="google"
        :map="map"
    /></template>
  </GoogleMapLoader>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import GoogleMapLoader from "@/components/google-maps/GoogleMapLoader.vue";
import { mapSettings } from "@/constants/mapSettings";
import GoogleMapMarker from "@/components/google-maps/GoogleMapMarker.vue";

@Component({
  components: {
    GoogleMapLoader,
    GoogleMapMarker
  }
})
export default class GoogleMapTest extends Vue {
  markers = [
    { position: { lat: 40.771, lng: -73.974 }, title: "SHit" },
    { position: { lat: 41.771, lng: -71.974 }, title: "SHit" }
  ];

  get mapConfig() {
    return {
      ...mapSettings,
      zoom: 5,
      center: this.markers[0].position
    };
  }
}
</script>
