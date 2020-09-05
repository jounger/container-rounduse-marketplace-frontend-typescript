import Vue from "vue";
import { OverviewRequest } from "../entity/payload";

export function overview(request: OverviewRequest) {
  return Vue.axios.get("/overview", {
    params: request
  });
}
