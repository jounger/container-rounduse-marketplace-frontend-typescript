import Vue from "vue";
import { PaginationRequest } from "@/entity/payload";

export function getContractDocumentsByContract(
  id: number,
  paging: PaginationRequest
) {
  return Vue.axios.get(`/contract-document/contract/${id}`, {
    params: paging
  });
}

export function getContractDocumentsByUser(paging: PaginationRequest) {
  return Vue.axios.get("/contract-document/user", {
    params: paging
  });
}

export function getContractDocumentsByContractDocumentNumber(
  contractDocumentNumber: string
) {
  return Vue.axios.get(`/contract-document/${contractDocumentNumber}`);
}
export function removeContractDocument(id: number) {
  return Vue.axios.delete(`/contract-document/${id}`);
}

export function createContractDocument(id: number, contractDocument: FormData) {
  return Vue.axios.post(`/contract-document/contract/${id}`, contractDocument);
}

export function editContractDocument(id: number, updates: object) {
  return Vue.axios.patch(`/contract-document/${id}`, updates);
}
