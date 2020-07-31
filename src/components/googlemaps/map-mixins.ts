import { Vue, Component } from "vue-property-decorator";
import { DistanceMatrix } from "./map-interface";

@Component
export default class GoogleMapMixins extends Vue {
  rejectEmptyElement(list: Array<any>) {
    return list.filter(x => x && x.length >= 5);
  }

  getMarkerFromPlace(place: google.maps.places.PlaceResult, adress: string) {
    if (place && typeof place.geometry !== "undefined") {
      return {
        position: place.geometry.location,
        title: adress,
        visible: true
      } as google.maps.MarkerOptions;
    }
    return undefined;
  }

  getValueFromResponse(
    response: google.maps.DistanceMatrixResponse,
    index: number
  ) {
    return {
      originAddress: response.originAddresses[index],
      destinationAddress: response.destinationAddresses[index],
      distance: response.rows[index].elements[index].distance,
      duration: response.rows[index].elements[index].duration
    } as DistanceMatrix;
  }
}
