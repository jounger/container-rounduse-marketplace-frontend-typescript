import { Vue, Component } from "vue-property-decorator";
import {
  addMinutesToDate,
  formatDatetime,
  addTimeToDate,
  isEmptyObject,
  currencyFormatter,
  convertTime
} from "../utils/tool";

@Component
export default class Utils extends Vue {
  addTimeToDate(input: string) {
    return addTimeToDate(input);
  }

  addMinutesToDate(d: string, m: number) {
    return addMinutesToDate(d, m);
  }

  formatDatetime(input: string) {
    return formatDatetime(input);
  }

  isEmptyObject(obj: object) {
    return isEmptyObject(obj);
  }

  formatPrice(value: string) {
    const val = (parseInt(value) / 1).toFixed(2).replace(".", ",");
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  currencyFormatter(num: number, cur?: string) {
    return currencyFormatter(num, cur);
  }
  convertTime(input: string) {
    return convertTime(input);
  }
}
