import Vue from "vue";
import { PaginationRequest } from "../entity/payload";
import { IDiscount } from "@/entity/discount";

export function getDiscounts(paging: PaginationRequest) {
  return Vue.axios.get("/discount", {
    params: paging
  });
}

export function getDiscount(id: number) {
  return Vue.axios.get(`/discount/${id}`);
}

export function getDiscountByCode(code: string) {
  return Vue.axios.get(`/discount/${code}`);
}

export function createDiscount(discount: IDiscount) {
  return Vue.axios.post("/discount", discount);
}

export function editDiscount(id: number, updates: object) {
  return Vue.axios.patch(`/discount/${id}`, updates);
}

export function removeDiscount(id: number) {
  return Vue.axios.delete(`/discount/${id}`);
}
