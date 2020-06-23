import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IPermission } from "@/entity/permission";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getPermissions(paging: PaginationRequest) {
  return Vue.axios.get("/permission", {
    params: paging,
    headers: config
  });
}

export function getPermissionById(id: number) {
  return Vue.axios.get(`/permission/${id}`, {
    headers: config
  });
}

export function createPermission(permission: IPermission) {
  return Vue.axios.post("/permission", permission, {
    headers: config
  });
}

export function updatePermission(permission: IPermission) {
  return Vue.axios.put("/permission", permission, {
    headers: config
  });
}

export function editPermission(id: number, updates: Map<string, object>) {
  return Vue.axios.patch(`/permission/${id}`, updates, {
    headers: config
  });
}

export function removePermission(id: number) {
  return Vue.axios.delete(`/permission/${id}`, {
    headers: config
  });
}
