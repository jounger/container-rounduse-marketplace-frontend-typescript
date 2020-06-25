import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IOperator } from "../entity/operator";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getOperators(paging: PaginationRequest) {
  return Vue.axios.get("/operator", {
    params: paging,
    headers: config
  });
}

export function getOperatorById(id: number) {
  return Vue.axios.get(`/operator/${id}`, {
    headers: config
  });
}

export function getOperatorByUsername(username: string) {
  return Vue.axios.get(`/operator/${username}`, {
    headers: config
  });
}

export function createOperator(operator: IOperator) {
  return Vue.axios.post("/operator", operator, {
    headers: config
  });
}

export function updateOperator(operator: IOperator) {
  return Vue.axios.put("/operator", operator, {
    headers: config
  });
}

export function editOperator(id: number, updates: IOperator) {
  return Vue.axios.patch(`/operator/${id}`, updates, {
    headers: config
  });
}

export function removeOperator(id: number) {
  return Vue.axios.delete(`/operator/${id}`, {
    headers: config
  });
}
