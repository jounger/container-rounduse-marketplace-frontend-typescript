import Vue from "vue";
import { PaginationRequest } from "../entity/payload";
import { IPort } from "@/entity/port";

export function getPorts(paging: PaginationRequest) {
  return Vue.axios.get("/port", {
    params: paging
  });
}

export function getPort(id: number) {
  return Vue.axios.get(`/port/${id}`);
}

export function getPortByNameCode(nameCode: string) {
  return Vue.axios.get(`/port/${nameCode}`);
}

export function createPort(port: IPort) {
  return Vue.axios.post("/port", port);
}

export function editPort(id: number, updates: object) {
  return Vue.axios.patch(`/port/${id}`, updates);
}

export function removePort(id: number) {
  return Vue.axios.delete(`/port/${id}`);
}
