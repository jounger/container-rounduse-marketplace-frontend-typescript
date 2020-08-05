import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IOutbound } from "@/entity/outbound";

export function getOutbounds(paging: PaginationRequest) {
  return Vue.axios.get("/outbound", {
    params: paging
  });
}

export function getOutbound(id: number) {
  return Vue.axios.get(`/outbound/${id}`);
}

export function getOutboundByMerchant(paging: PaginationRequest) {
  return Vue.axios.get("/outbound/merchant", {
    params: paging
  });
}

export function createOutbound(outbound: IOutbound) {
  return Vue.axios.post("/outbound", outbound);
}

export function updateOutbound(outbound: IOutbound) {
  return Vue.axios.put("/outbound", outbound);
}

export function editOutbound(id: number, updates: object) {
  return Vue.axios.patch(`/outbound/${id}`, updates);
}

export function removeOutbound(id: number) {
  return Vue.axios.delete(`/outbound/${id}`);
}
