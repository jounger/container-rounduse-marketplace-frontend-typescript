import Vue from "vue";
import { PaginationRequest } from "./payload";

export function getProfile() {
  return Vue.axios.get("/auth/user");
}

export function changeStatus(id: number, updates: object) {
  return Vue.axios.patch(`/user/${id}`, updates);
}

export function getUsers(paging: PaginationRequest) {
  return Vue.axios.get("/user", {
    params: paging
  });
}
