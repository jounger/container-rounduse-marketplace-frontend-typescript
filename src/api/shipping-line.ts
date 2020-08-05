import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IShippingLine } from "@/entity/shipping-line";

export function getShippingLines(paging: PaginationRequest) {
  return Vue.axios.get("/shipping-line", {
    params: paging
  });
}

export function getShippingLine(id: number) {
  return Vue.axios.get(`/shipping-line/${id}`);
}

export function createShippingLine(shippingLine: IShippingLine) {
  return Vue.axios.post("/shipping-line", shippingLine);
}

export function updateShippingLine(shippingLine: IShippingLine) {
  return Vue.axios.put("/shipping-line", shippingLine);
}

export function editShippingLine(id: number, updates: object) {
  return Vue.axios.patch(`/shipping-line/${id}`, updates);
}

export function removeShippingLine(id: number) {
  return Vue.axios.delete(`/shipping-line/${id}`);
}
