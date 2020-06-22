import Vue from "vue";
import { PaginationRequest } from './payload';

const config = {
  Authorization: "Bearer {auth_token}"
}

export function getSuppliers(paging: PaginationRequest) {
  return Vue.axios.get("/supplier", {
    params: paging,
    headers: config
  });
}

export function getSuppliersById(id: number) {
  return Vue.axios.get(`/supplier/${id}`, {
    headers: config
  });
}

export function getSuppliersByUsername(username: string) {
  return Vue.axios.get(`/supplier/${username}`, {
    headers: config
  });
}

// Use "defaults" in destructuring:
// https://stackoverflow.com/a/26578323/10597062
export function reviewSupplier(id: number, { status = "PENDING" }) {
  return Vue.axios.patch(`/supplier/register/${id}`,
  // data object
  {
    status: status
  },
  // headers
  {
    headers: config
  });
}

