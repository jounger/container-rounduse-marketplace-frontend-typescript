import Vue from "vue";
import { PaginationRequest } from "./payload";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getProfile() {
  return Vue.axios.get("/auth/user", {
    headers: config
  });
}

export function changeStatus(id: number, updates: object) {
  return Vue.axios.patch(`/user/${id}`, updates, {
    headers: config
  });
}

export function getUsers(paging: PaginationRequest) {
  return Vue.axios.get("/user", {
    params: paging,
    headers: config
  });
}
