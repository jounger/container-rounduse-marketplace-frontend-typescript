import Vue from "vue";
import { PaginationRequest } from "./payload";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getCombineds(paging: PaginationRequest) {
  return Vue.axios.get("/combined", {
    params: paging,
    headers: config
  });
}

export function getCombinedsByUser(paging: PaginationRequest) {
  return Vue.axios.get("/combined/user", {
    params: paging,
    headers: config
  });
}

export function getCombined(id: number) {
  return Vue.axios.get(`/combined/${id}`, {
    headers: config
  });
}

export function editCombined(id: number, updates: object) {
  return Vue.axios.patch(`/combined/${id}`, updates, {
    headers: config
  });
}
