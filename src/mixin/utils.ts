import { Vue, Component } from "vue-property-decorator";
import { isValidDate } from "../utils/tool";

@Component
export default class Utils extends Vue {
  addTimeToDate(input: string) {
    const date = input.substring(0, 10);
    const d = new Date(date);
    if (isValidDate(d)) {
      return `${date}T00:00`;
    }
    return `${date}`;
  }

  formatDatetime(input: string) {
    const date = input.substring(0, 10);
    const d = new Date(date);
    if (isValidDate(d)) {
      const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
      const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
      const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
      return `${mo} ${da}, ${ye}`;
    }
    return `${date}`;
  }

  isEmptyObject(obj: object) {
    if (Object.keys(obj).length === 0 && obj.constructor === Object)
      return true;
    return false;
  }

  formatPrice(value: string) {
    const val = (parseInt(value) / 1).toFixed(2).replace(".", ",");
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
}
