import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IRole } from "@/entity/role";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getRoles(paging: PaginationRequest) {
  return Vue.axios.get("/role", {
    params: paging,
    headers: config
  });
}

export function getRoleById(id: number) {
  return Vue.axios.get(`/role/${id}`, {
    headers: config
  });
}

export function createRole(role: IRole) {
  return Vue.axios.post("/role", role, {
    headers: config
  });
}

export function updateRole(role: IRole) {
  return Vue.axios.put("/role", role, {
    headers: config
  });
}

export function editRole(id: number, updates: Map<string, object>) {
  return Vue.axios.patch(`/role/${id}`, updates, {
    headers: config
  });
}

export function removeRole(id: number) {
  return Vue.axios.delete(`/role/${id}`, {
    headers: config
  });
}
