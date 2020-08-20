import Vue from "vue";
import { PaginationRequest } from "../entity/payload";
import { IInbound } from "@/entity/inbound";

export function getInbounds(paging: PaginationRequest) {
  return Vue.axios.get("/inbound", {
    params: paging
  });
}

export function getInbound(id: number) {
  return Vue.axios.get(`/inbound/${id}`);
}

export function getInboundByContainer(id: number) {
  return Vue.axios.get(`/inbound/container/${id}`);
}

export function getInboundsByForwarder(paging: PaginationRequest) {
  return Vue.axios.get("/inbound/forwarder", {
    params: paging
  });
}

export function getInboundsByOutbound(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/inbound/outbound/${id}`, {
    params: paging
  });
}

export function getInboundsByOutboundAndForwarder(
  id: number,
  paging: PaginationRequest
) {
  return Vue.axios.get(`/inbound/outbound-match/${id}`, {
    params: paging
  });
}

export function createInbound(inbound: IInbound) {
  return Vue.axios.post("/inbound", inbound);
}

export function editInbound(id: number, updates: object) {
  return Vue.axios.patch(`/inbound/${id}`, updates);
}

export function removeInbound(id: number) {
  return Vue.axios.delete(`/inbound/${id}`);
}
