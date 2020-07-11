import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IDriver } from "@/entity/driver";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getDrivers(paging: PaginationRequest) {
  return Vue.axios.get("/driver", {
    params: paging,
    headers: config
  });
}

export function getDriversByForwarder(paging: PaginationRequest) {
  return Vue.axios.get("/driver/forwarder", {
    params: paging,
    headers: config
  });
}
export function createDriver(driver: IDriver) {
  return Vue.axios.post("/driver/forwarder/", driver, {
    headers: config
  });
}

export function updateDriver(driver: IDriver) {
  return Vue.axios.put("/driver", driver, {
    headers: config
  });
}

export function editDriver(id: number, updates: object) {
  return Vue.axios.patch(`/driver/${id}`, updates, {
    headers: config
  });
}

export function removeDriver(id: number) {
  return Vue.axios.delete(`/driver/${id}`, {
    headers: config
  });
}
