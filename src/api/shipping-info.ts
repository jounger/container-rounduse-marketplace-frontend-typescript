import Vue from "vue";
import { PaginationRequest } from "../entity/payload";

export function getShippingInfos(paging: PaginationRequest) {
  return Vue.axios.get("/shipping-info", {
    params: paging
  });
}

export function getShippingInfo(id: number) {
  return Vue.axios.get(`/shipping-info/${id}`);
}

export function getShippingInfosByDriver(
  id: number,
  paging: PaginationRequest
) {
  return Vue.axios.get(`/shipping-info/driver/${id}`, {
    params: paging
  });
}

export function getShippingInfosByOutbound(
  id: number,
  paging: PaginationRequest
) {
  return Vue.axios.get(`/shipping-info/outbound/${id}`, {
    params: paging
  });
}

export function getShippingInfosByBid(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/shipping-info/bid/${id}`, {
    params: paging
  });
}

export function getShippingInfosByCombined(
  id: number,
  paging: PaginationRequest
) {
  return Vue.axios.get(`/shipping-info/combined/${id}`, {
    params: paging
  });
}

export function editShippingInfo(id: number, updates: object) {
  return Vue.axios.patch(`/shipping-info/${id}`, updates);
}

export function removeShippingInfo(id: number) {
  return Vue.axios.delete(`/shipping-info/${id}`);
}
