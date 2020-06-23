import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IContainerType } from "@/entity/container-type";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getContainerTypes(paging: PaginationRequest) {
  return Vue.axios.get("/container-type", {
    params: paging,
    headers: config
  });
}

export function getContainerTypeById(id: number) {
  return Vue.axios.get(`/container-type/${id}`, {
    headers: config
  });
}

export function createContainerType(containerType: IContainerType) {
  return Vue.axios.post("/container-type", containerType, {
    headers: config
  });
}

export function updateContainerType(containerType: IContainerType) {
  return Vue.axios.put("/container-type", containerType, {
    headers: config
  });
}

export function editContainerType(id: number, updates: Map<string, object>) {
  return Vue.axios.patch(`/container-type/${id}`, updates, {
    headers: config
  });
}

export function removeContainerType(id: number) {
  return Vue.axios.delete(`/container-type/${id}`, {
    headers: config
  });
}
