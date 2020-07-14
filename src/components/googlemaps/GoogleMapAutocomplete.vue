<template>
  <div>
    <template v-if="Boolean(this.placeLocal) && Boolean(this.address)">
      <slot :place="placeLocal" :address="address" />
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { google } from "google-maps";

@Component
export default class GoogleMapAutocomplete extends Vue {
  @Prop() readonly google!: google;
  @Prop() readonly map!: google.maps.Map<HTMLDivElement>;
  @Prop() readonly countries!: Array<string>;
  @Prop() readonly input!: HTMLInputElement;
  @PropSync("place", { type: Object })
  placeSync!: google.maps.places.PlaceResult;

  placeLocal = null as google.maps.places.PlaceResult | null;
  autocomplete = null as google.maps.places.Autocomplete | null;
  address = "";

  getAddressFromPlace(placeResult: google.maps.places.PlaceResult) {
    if (placeResult.address_components) {
      return placeResult.address_components
        .reduce(
          (pV: Array<string>, cV: google.maps.GeocoderAddressComponent) => {
            if (cV) {
              pV.push(cV.long_name || cV.short_name || "");
            }
            return pV;
          },
          []
        )
        .join(" ");
    }
    return "";
  }

  mounted() {
    console.log("GoogleMapAutocomplete");
    if (this.google && this.map && this.autocomplete == null) {
      this.autocomplete = new this.google.maps.places.Autocomplete(this.input);
    }
    if (this.autocomplete) {
      if (this.countries && this.countries.length > 0) {
        this.autocomplete.setComponentRestrictions({ country: this.countries });
      }
      this.autocomplete.bindTo("bounds", this.map);
      // Set the data fields to return when the user selects a place.
      this.autocomplete.setFields([
        "address_components",
        "geometry",
        "icon",
        "name"
      ]);
      this.autocomplete.addListener("place_changed", () => {
        if (this.autocomplete != null) {
          const placeResult = Object.assign({}, this.autocomplete.getPlace());
          this.placeSync = placeResult;
          this.placeLocal = placeResult;
          this.address = this.getAddressFromPlace(placeResult);
          if (!placeResult.geometry) {
            console.log(
              "No details available for input: '" + placeResult.name + "'"
            );
            return;
          }
          console.log("GoogleMapAutocomplete > place_changed");
          // If the place has a geometry, then present it on a map.
          if (placeResult.geometry.viewport) {
            this.map.fitBounds(placeResult.geometry.viewport);
          } else {
            this.map.setCenter(placeResult.geometry.location);
            this.map.setZoom(17); // Why 17? Because it looks good.
          }
        }
      });
    }
  }

  beforeDestroy() {
    console.log("DESTROY > GoogleMapAutocomplete");
    if (this.autocomplete) {
      this.map.setCenter({ lat: 21.040201, lng: 105.83456 }); // HA NOI CAPITAL
      this.map.setZoom(8); // Why 8? Because it looks good.
      this.autocomplete = null;
    }
  }
}
</script>
