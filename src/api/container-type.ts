import Vue from "vue";
import { PaginationRequest } from "../entity/payload";
import { IContainerType } from "@/entity/container-type";

export function getContainerTypes(paging: PaginationRequest) {
  return Vue.axios.get("/container-type", {
    params: paging
  });
}

export function getContainerType(id: number) {
  return Vue.axios.get(`/container-type/${id}`);
}

export function getContainerTypeByName(name: string) {
  return Vue.axios.get(`/container-type/${name}`);
}

export function createContainerType(containerType: IContainerType) {
  return Vue.axios.post("/container-type", containerType);
}

export function editContainerType(id: number, updates: object) {
  return Vue.axios.patch(`/container-type/${id}`, updates);
}

export function removeContainerType(id: number) {
  return Vue.axios.delete(`/container-type/${id}`);
}
