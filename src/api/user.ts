import Vue from "vue";
import { PaginationRequest, ChangePasswordRequest } from "./payload";

export function getProfile() {
  return Vue.axios.get("/auth/user");
}

export function getUsers(paging: PaginationRequest) {
  return Vue.axios.get("/user", {
    params: paging
  });
}

export function uploadProfileImage(file: FormData) {
  return Vue.axios.post("/user/upload-profile", file);
}

export function editUser(username: string, updates: object) {
  return Vue.axios.patch(`/user/${username}`, updates);
}

export function changePassword(changePasswordRequest: ChangePasswordRequest) {
  return Vue.axios.patch(`/change-password`, changePasswordRequest);
}
