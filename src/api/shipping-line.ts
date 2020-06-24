import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IShippingLine } from '../entity/shipping-line';

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getShippingLines(paging: PaginationRequest) {
  return Vue.axios.get("/supplier", {
    params: paging,
    headers: config
  });
}

export function getShippingLine(id: number) {
  return Vue.axios.get(`/supplier/${id}`, {
    headers: config
  });
}

export function getShippingLineByUsername(username: string) {
  return Vue.axios.get(`/supplier/${username}`, {
    headers: config
  });
}


export function createShippingLine(shippingLine: IShippingLine) {
  return Vue.axios.post("/supplier", shippingLine, {
    headers: config
  });
}

export function updateShippingLine(shippingLine: IShippingLine) {
  return Vue.axios.put("/supplier", shippingLine, {
    headers: config
  });
}

export function editShippingLine(id: number, updates: Map<string, object>) {
  return Vue.axios.patch(`/supplier/${id}`, updates, {
    headers: config
  });
}

export function removeShippingLine(id: number) {
  return Vue.axios.delete(`/supplier/${id}`, {
    headers: config
  });
}
