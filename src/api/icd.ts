import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IIcd } from "@/entity/icd";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getIcds(paging: PaginationRequest) {
  return Vue.axios.get("/icd", {
    params: paging,
    headers: config
  });
}

export function getIcdById(id: number) {
  return Vue.axios.get(`/icd/${id}`, {
    headers: config
  });
}

export function createIcd(icd: IIcd) {
  return Vue.axios.post("/icd", icd, {
    headers: config
  });
}

export function updateIcd(icd: IIcd) {
  return Vue.axios.put("/icd", icd, {
    headers: config
  });
}

export function editIcd(id: number, updates: Map<string, object>) {
  return Vue.axios.patch(`/icd/${id}`, updates, {
    headers: config
  });
}

export function removeIcd(id: number) {
  return Vue.axios.delete(`/icd/${id}`, {
    headers: config
  });
}
