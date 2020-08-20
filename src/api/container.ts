import Vue from "vue";
import { PaginationRequest } from "../entity/payload";
import { IContainer } from "@/entity/container";

export function getContainers(paging: PaginationRequest) {
  return Vue.axios.get("/container", {
    params: paging
  });
}

export function getContainer(id: number) {
  return Vue.axios.get(`/container/${id}`);
}
export function getContainersByBillOfLading(
  id: number,
  paging: PaginationRequest
) {
  return Vue.axios.get(`/container/bill-of-lading/${id}`, {
    params: paging
  });
}
export function getContainersByInbound(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/container/inbound/${id}`, {
    params: paging
  });
}
export function getContainersByBid(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/container/bid/${id}`, {
    params: paging
  });
}
export function createContainer(id: number, container: IContainer) {
  return Vue.axios.post(`/container/bill-of-lading/${id}`, container);
}

export function editContainer(id: number, updates: object) {
  return Vue.axios.patch(`/container/${id}`, updates);
}

export function removeContainer(id: number) {
  return Vue.axios.delete(`/container/${id}`);
}
