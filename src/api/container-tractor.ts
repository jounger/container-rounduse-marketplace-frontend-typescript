import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IContainerTractor } from "../entity/container-tractor";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getContainerTractors(paging: PaginationRequest) {
  return Vue.axios.get("/container-tractor", {
    params: paging,
    headers: config
  });
}

export function getContainerTractorsByForwarder(paging: PaginationRequest) {
  return Vue.axios.get("/container-tractor/forwarder", {
    params: paging,
    headers: config
  });
}

export function getContainerTractor(id: number) {
  return Vue.axios.get(`/container-tractor/${id}`, {
    headers: config
  });
}

export function createContainerTractor(containerTractor: IContainerTractor) {
  return Vue.axios.post("/container-tractor", containerTractor, {
    headers: config
  });
}

export function updateContainerTractor(containerTractor: IContainerTractor) {
  return Vue.axios.put("/container-tractor", containerTractor, {
    headers: config
  });
}

export function editContainerTractor(id: number, updates: object) {
  return Vue.axios.patch(`/container-tractor/${id}`, updates, {
    headers: config
  });
}

export function removeContainerTractor(id: number) {
  return Vue.axios.delete(`/container-tractor/${id}`, {
    headers: config
  });
}
