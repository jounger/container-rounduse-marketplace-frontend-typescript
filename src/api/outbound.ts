import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IOutbound } from '../entity/outbound';

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getOutbounds(paging: PaginationRequest) {
  return Vue.axios.get("/outbound", {
    params: paging,
    headers: config
  });
}

export function getOutbound(id: number) {
  return Vue.axios.get(`/outbound/${id}`, {
    headers: config
  });
}

export function getOutboundByMerchant(paging: PaginationRequest) {
  return Vue.axios.get("/outbound/merchant", {
    params: paging,
    headers: config
  });
}

export function createOutbound(outbound: IOutbound) {
  return Vue.axios.post("/outbound", outbound, {
    headers: config
  });
}

export function updateOutbound(outbound: IOutbound) {
  return Vue.axios.put("/outbound", outbound, {
    headers: config
  });
}

export function editOutbound(id: number, updates: object) {
  return Vue.axios.patch(`/outbound/${id}`, updates, {
    headers: config
  });
}

export function removeOutbound(id: number) {
  return Vue.axios.delete(`/outbound/${id}`, {
    headers: config
  });
}
