import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IDiscount } from "../entity/discount";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getDiscounts(paging: PaginationRequest) {
  return Vue.axios.get("/discount", {
    params: paging,
    headers: config
  });
}

export function getDiscountById(id: number) {
  return Vue.axios.get(`/discount/${id}`, {
    headers: config
  });
}


export function createDiscount(discount: IDiscount) {
  return Vue.axios.post("/discount", discount, {
    headers: config
  });
}

export function updateDiscount(discount: IDiscount) {
  return Vue.axios.put("/discount", discount, {
    headers: config
  });
}

export function editDiscount(id: number, updates: Map<string, object>) {
  return Vue.axios.patch(`/discount/${id}`, updates, {
    headers: config
  });
}

export function removeDiscount(id: number) {
  return Vue.axios.delete(`/discount/${id}`, {
    headers: config
  });
}
