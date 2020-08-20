import Vue from "vue";
import { PaginationRequest } from "../entity/payload";
import { IPermission } from "@/entity/permission";

export function getPermissions(paging: PaginationRequest) {
  return Vue.axios.get("/permission", {
    params: paging
  });
}

export function createPermission(permission: IPermission) {
  return Vue.axios.post("/permission", permission);
}

export function updatePermission(permission: IPermission) {
  return Vue.axios.put("/permission", permission);
}

export function removePermission(id: number) {
  return Vue.axios.delete(`/permission/${id}`);
}
