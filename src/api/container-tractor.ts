import Vue from "vue";
import { PaginationRequest } from "../entity/payload";
import { IContainerTractor } from "@/entity/container-tractor";

export function getContainerTractors(paging: PaginationRequest) {
  return Vue.axios.get("/container-tractor", {
    params: paging
  });
}

export function getContainerTractorsByForwarder(paging: PaginationRequest) {
  return Vue.axios.get("/container-tractor/forwarder", {
    params: paging
  });
}

export function getContainerTractor(id: number) {
  return Vue.axios.get(`/container-tractor/${id}`);
}

export function createContainerTractor(containerTractor: IContainerTractor) {
  return Vue.axios.post("/container-tractor", containerTractor);
}

export function editContainerTractor(id: number, updates: object) {
  return Vue.axios.patch(`/container-tractor/${id}`, updates);
}

export function removeContainerTractor(id: number) {
  return Vue.axios.delete(`/container-tractor/${id}`);
}
