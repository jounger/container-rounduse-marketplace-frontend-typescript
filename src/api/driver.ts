import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IDriver } from "@/entity/driver";

export function getDrivers(paging: PaginationRequest) {
  return Vue.axios.get("/driver", {
    params: paging
  });
}

export function getDriversByForwarder(paging: PaginationRequest) {
  return Vue.axios.get("/driver/forwarder", {
    params: paging
  });
}
export function getDriverById(id: number) {
  return Vue.axios.get(`/driver/${id}`);
}
export function createDriver(driver: IDriver) {
  return Vue.axios.post("/driver/forwarder/", driver);
}

export function updateDriver(driver: IDriver) {
  return Vue.axios.put("/driver", driver);
}

export function editDriver(id: number, updates: object) {
  return Vue.axios.patch(`/driver/${id}`, updates);
}

export function removeDriver(id: number) {
  return Vue.axios.delete(`/driver/${id}`);
}
