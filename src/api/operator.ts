import Vue from "vue";
import { PaginationRequest } from "../entity/payload";
import { IOperator } from "@/entity/operator";

export function getOperators(paging: PaginationRequest) {
  return Vue.axios.get("/operator", {
    params: paging
  });
}

export function getOperator(id: number) {
  return Vue.axios.get(`/operator/${id}`);
}

export function createOperator(operator: IOperator) {
  return Vue.axios.post("/operator", operator);
}

export function editOperator(id: number, updates: object) {
  return Vue.axios.patch(`/operator/${id}`, updates);
}

export function removeOperator(id: number) {
  return Vue.axios.delete(`/operator/${id}`);
}
