import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IContainer } from "@/entity/container";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getContainers(paging: PaginationRequest) {
  return Vue.axios.get("/container", {
    params: paging,
    headers: config
  });
}

export function getContainerById(id: number) {
  return Vue.axios.get(`/container/${id}`, {
    headers: config
  });
}
export function getContainersByBillOfLading(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/container/billOfLading/${id}`, {
    params: paging,
    headers: config
  });
}
export function getContainersByInbound(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/container/inbound/${id}`, {
    params: paging,
    headers: config
  });
}
export function createContainer(id: number, container: IContainer) {
  return Vue.axios.post(`/container/billOfLading/${id}`, container, {
    headers: config
  });
}

export function updateContainer(container: IContainer) {
  return Vue.axios.put("/container", container, {
    headers: config
  });
}

export function editContainer(id: number, updates: Map<string, object>) {
  return Vue.axios.patch(`/container/${id}`, updates, {
    headers: config
  });
}

export function removeContainer(id: number) {
  return Vue.axios.delete(`/container/${id}`, {
    headers: config
  });
}
