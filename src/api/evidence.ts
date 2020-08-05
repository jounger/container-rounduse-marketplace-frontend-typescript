import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IEvidence } from "@/entity/evidence";

export function getEvidencesByContract(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/evidence/contract/${id}`, {
    params: paging
  });
}

export function getEvidencesByUser(paging: PaginationRequest) {
  return Vue.axios.get("/evidence/user", {
    params: paging
  });
}

export function getEvidencesByEvidenceNumber(evidenceNumber: string) {
  return Vue.axios.get(`/evidence/${evidenceNumber}`);
}
export function removeEvidence(id: number) {
  return Vue.axios.delete(`/evidence/${id}`);
}

export function createEvidence(id: number, evidence: IEvidence) {
  return Vue.axios.post(`/evidence/contract/${id}`, evidence);
}

export function editEvidence(id: number, updates: object) {
  return Vue.axios.patch(`/evidence/${id}`, updates);
}
