import Vue from "vue";
import { PaginationRequest } from "../entity/payload";
import { IContract } from "@/entity/contract";

export function searchContracts(paging: PaginationRequest, search: string) {
  return Vue.axios.get("/contract/filter", {
    params: { paging, search }
  });
}

export function getContracts(paging: PaginationRequest) {
  return Vue.axios.get("/contract", {
    params: paging
  });
}
export function createContract(contract: IContract) {
  return Vue.axios.post("/contract", contract);
}

export function editContract(id: number, updates: object) {
  return Vue.axios.patch(`/contract/${id}`, updates);
}

export function removeContract(id: number) {
  return Vue.axios.delete(`/contract/${id}`);
}
