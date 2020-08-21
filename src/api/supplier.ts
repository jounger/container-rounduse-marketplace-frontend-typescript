import Vue from "vue";
import { PaginationRequest } from "../entity/payload";

export function getSuppliers(paging: PaginationRequest) {
  return Vue.axios.get("/supplier", {
    params: paging
  });
}

export function getSupplier(username: string) {
  return Vue.axios.get(`/supplier/${username}`);
}

export function getSuppliersByStatus(paging: PaginationRequest) {
  return Vue.axios.get("/supplier/status", {
    params: paging
  });
}

export function getSuppliersByRole(paging: PaginationRequest) {
  return Vue.axios.get("/supplier/role", {
    params: paging
  });
}

// Use "defaults" in destructuring:
// https://stackoverflow.com/a/26578323/10597062
export function reviewSupplier(id: number, updates: object) {
  return Vue.axios.patch(`/supplier/register/${id}`, updates);
}
export function editSupplier(id: number, updates: object) {
  return Vue.axios.patch(`/supplier/${id}`, updates);
}
