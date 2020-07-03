import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IShippingLine } from '../entity/shipping-line';

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getShippingLines(paging: PaginationRequest) {
  return Vue.axios.get("/shipping-line", {
    params: paging,
    headers: config
  });
}

export function getShippingLine(id: number) {
  return Vue.axios.get(`/shipping-line/${id}`, {
    headers: config
  });
}

export function createShippingLine(shippingLine: IShippingLine) {
  return Vue.axios.post("/shipping-line", shippingLine, {
    headers: config
  });
}

export function updateShippingLine(shippingLine: IShippingLine) {
  return Vue.axios.put("/shipping-line", shippingLine, {
    headers: config
  });
}

export function editShippingLine(id: number, updates: object) {
  return Vue.axios.patch(`/shipping-line/${id}`, updates, {
    headers: config
  });
}

export function removeShippingLine(id: number) {
  return Vue.axios.delete(`/shipping-line/${id}`, {
    headers: config
  });
}
