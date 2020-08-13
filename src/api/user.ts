import Vue from "vue";
import { PaginationRequest, ChangePasswordRequest } from './payload';

export function getProfile() {
  return Vue.axios.get("/auth/user");
}

export function getUsers(paging: PaginationRequest) {
  return Vue.axios.get("/user", {
    params: paging
  });
}

export function changeStatus(id: number, updates: object) {
  return Vue.axios.patch(`/user/${id}`, updates);
}

export function changePassword(changePasswordRequest: ChangePasswordRequest) {
  return Vue.axios.patch(`/change-password`, changePasswordRequest);
}
