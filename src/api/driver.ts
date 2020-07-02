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

export function getDriverById(id: number) {
  return Vue.axios.get(`/driver/${id}`, {
    headers: config
  });
}
export function getDriverByForwarder(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/driver/forwarder/${id}`, {
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

export function editDriver(id: number, updates: Map<string, object>) {
  return Vue.axios.patch(`/driver/${id}`, updates, {
    headers: config
  });
}

export function removeDriver(id: number) {
  return Vue.axios.delete(`/driver/${id}`, {
    headers: config
  });
}
