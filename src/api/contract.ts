import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IContract } from "../entity/contract";

const config = {
  Authorization: "Bearer {auth_token}"
};
export function searchContracts(paging: PaginationRequest, search: string) {
  return Vue.axios.get("/contract/filter", {
    params: { ...paging, search },
    headers: config
  });
}

export function getContractsByUser(paging: PaginationRequest) {
  return Vue.axios.get("/contract/user", {
    params: paging,
    headers: config
  });
}
export function createContract(contract: IContract) {
  return Vue.axios.post("/contract", contract, {
    headers: config
  });
}

export function editContract(id: number, updates: object) {
  return Vue.axios.patch(`/contract/${id}`, updates, {
    headers: config
  });
}

export function removeContract(id: number) {
  return Vue.axios.delete(`/contract/${id}`, {
    headers: config
  });
}
