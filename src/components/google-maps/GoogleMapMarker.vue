<template>
  <div></div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { google } from "google-maps";

@Component
export default class GoogleMapMarker extends Vue {
  @Prop() google!: google;
  @Prop() map: undefined;
  @Prop() marker!: google.maps.MarkerOptions;

  mounted() {
    console.log("marker", this.marker);
    new this.google.maps.Marker({
      position: this.marker.position,
      map: this.map,
      title: this.marker.title
    });
  }
}
</script>
