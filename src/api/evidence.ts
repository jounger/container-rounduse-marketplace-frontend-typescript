import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IEvidence } from "@/entity/evidence";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getEvidencesByContract(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/evidence/contract/${id}`, {
    params: paging,
    headers: config
  });
}

export function getEvidencesByUser(paging: PaginationRequest) {
  return Vue.axios.get("/evidence/user", {
    params: paging,
    headers: config
  });
}

export function getEvidencesByEvidenceNumber(evidenceNumber: string) {
  return Vue.axios.get(`/evidence/${evidenceNumber}`, {
    headers: config
  });
}
export function removeEvidence(id: number) {
  return Vue.axios.delete(`/evidence/${id}`, {
    headers: config
  });
}

export function createEvidence(id: number, evidence: IEvidence) {
  return Vue.axios.post(`/evidence/contract/${id}`, evidence, {
    headers: config
  });
}

export function editEvidence(id: number, updates: object) {
  return Vue.axios.patch(`/evidence/${id}`, updates, {
    headers: config
  });
}
