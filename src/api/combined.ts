import Vue from "vue";
import { PaginationRequest } from "../entity/payload";
import { ICombined } from "@/entity/combined";

export function getCombineds(paging: PaginationRequest) {
  return Vue.axios.get("/combined", {
    params: paging
  });
}

export function getCombinedsByBiddingDocument(
  id: number,
  paging: PaginationRequest
) {
  return Vue.axios.get(`/combined/bidding-document/${id}`, {
    params: paging
  });
}

export function createCombined(id: number, combined: ICombined) {
  return Vue.axios.post(`/combined/bid/${id}`, combined);
}

export function getCombined(id: number) {
  return Vue.axios.get(`/combined/${id}`);
}

export function editCombined(id: number, updates: object) {
  return Vue.axios.patch(`/combined/${id}`, updates);
}
