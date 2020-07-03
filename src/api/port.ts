//chưa sửa
import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IPort } from "@/entity/port";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getPorts(paging: PaginationRequest) {
  return Vue.axios.get("/port", {
    params: paging,
    headers: config
  });
}

export function getPort(id: number) {
  return Vue.axios.get(`/port/${id}`, {
    headers: config
  });
}

export function getPortByNameCode(nameCode: string) {
  return Vue.axios.get(`/port/${nameCode}`, {
    headers: config
  });
}

export function createPort(port: IPort) {
  return Vue.axios.post("/port", port, {
    headers: config
  });
}

export function updatePort(port: IPort) {
  return Vue.axios.put("/port", port, {
    headers: config
  });
}

export function editPort(id: number, updates: object) {
  return Vue.axios.patch(`/port/${id}`, updates, {
    headers: config
  });
}

export function removePort(id: number) {
  return Vue.axios.delete(`/port/${id}`, {
    headers: config
  });
}
