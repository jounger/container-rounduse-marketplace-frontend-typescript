import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IOperator } from "@/entity/operator";

export function getOperators(paging: PaginationRequest) {
  return Vue.axios.get("/operator", {
    params: paging
  });
}

export function getOperatorById(id: number) {
  return Vue.axios.get(`/operator/${id}`);
}
export function getOperatorByUsername(username: string) {
  return Vue.axios.get(`/operator/username`, {
    params: {
      username: username
    }
  });
}

export function createOperator(operator: IOperator) {
  return Vue.axios.post("/operator", operator);
}

export function updateOperator(operator: IOperator) {
  return Vue.axios.put("/operator", operator);
}

export function editOperator(id: number, updates: object) {
  return Vue.axios.patch(`/operator/${id}`, updates);
}

export function removeOperator(id: number) {
  return Vue.axios.delete(`/operator/${id}`);
}
