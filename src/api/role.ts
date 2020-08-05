import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IRole } from "@/entity/role";

export function getRoles(paging: PaginationRequest) {
  return Vue.axios.get("/role", {
    params: paging
  });
}

export function createRole(role: IRole) {
  return Vue.axios.post("/role", role);
}

export function updateRole(role: IRole) {
  return Vue.axios.put("/role", role);
}

export function removeRole(id: number) {
  return Vue.axios.delete(`/role/${id}`);
}
