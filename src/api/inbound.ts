import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IInbound } from "../entity/inbound";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getInbounds(paging: PaginationRequest) {
  return Vue.axios.get("/inbound", {
    params: paging,
    headers: config
  });
}

export function getInbound(id: number) {
  return Vue.axios.get(`/inbound/${id}`, {
    headers: config
  });
}

export function getInboundByForwarder(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/inbound/forwarder/${id}`, {
    params: paging,
    headers: config
  });
}
export function getInboundsByOutbound(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/inbound/outbound/${id}`, {
    params: paging,
    headers: config
  });
}

export function createInbound(id: number, inbound: IInbound) {
  return Vue.axios.post(`/inbound/forwarder/${id}`, inbound, {
    headers: config
  });
}

export function updateInbound(inbound: IInbound) {
  return Vue.axios.put("/inbound", inbound, {
    headers: config
  });
}

export function editInbound(id: number, updates: Map<string, object>) {
  return Vue.axios.patch(`/inbound/${id}`, updates, {
    headers: config
  });
}

export function removeInbound(id: number) {
  return Vue.axios.delete(`/inbound/${id}`, {
    headers: config
  });
}
