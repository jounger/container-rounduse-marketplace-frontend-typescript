import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IConsignment } from "@/entity/consignment";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getConsignments(paging: PaginationRequest) {
  return Vue.axios.get("/consignment", {
    params: paging,
    headers: config
  });
}

export function getConsignmentById(id: number) {
  return Vue.axios.get(`/consignment/${id}`, {
    headers: config
  });
}

export function getConsignmentByMerchant(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/consignment/merchant/${id}`, {
    params: paging,
    headers: config
  });
}

export function createConsignment(consignment: IConsignment) {
  return Vue.axios.post("/consignment", consignment, {
    headers: config
  });
}

export function updateConsignment(consignment: IConsignment) {
  return Vue.axios.put("/consignment", consignment, {
    headers: config
  });
}

export function editConsignment(id: number, updates: Map<string, object>) {
  return Vue.axios.patch(`/consignment/${id}`, updates, {
    headers: config
  });
}

export function removeConsignment(id: number) {
  return Vue.axios.delete(`/consignment/${id}`, {
    headers: config
  });
}
