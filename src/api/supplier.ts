import Vue from "vue";
import { PaginationRequest } from "./payload";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getSuppliers(paging: PaginationRequest) {
  return Vue.axios.get("/supplier", {
    params: paging,
    headers: config
  });
}

export function getSupplier(username: string) {
  return Vue.axios.get(`/supplier/${username}`, {
    headers: config
  });
}

export function getSuppliersByStatus(paging: PaginationRequest) {
  return Vue.axios.get("/supplier/status", {
    params: paging,
    headers: config
  });
}

// Use "defaults" in destructuring:
// https://stackoverflow.com/a/26578323/10597062
export function reviewSupplier(id: number, updates: object) {
  return Vue.axios.patch(
    `/supplier/register/${id}`,
    // data object
    updates,
    // headers
    {
      headers: config
    }
  );
}
export function editSupplier(id: number, updates: object) {
  return Vue.axios.patch(
    `/supplier/${id}`,
    // data object
    updates,
    // headers
    {
      headers: config
    }
  );
}
