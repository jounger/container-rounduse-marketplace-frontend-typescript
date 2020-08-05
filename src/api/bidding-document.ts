import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IBiddingDocument } from "@/entity/bidding-document";

export function getBiddingDocuments(paging: PaginationRequest) {
  return Vue.axios.get("/bidding-document", {
    params: paging
  });
}

export function getBiddingDocument(id: number) {
  return Vue.axios.get(`/bidding-document/${id}`);
}

export function getBiddingDocumentByBid(id: number) {
  return Vue.axios.get(`/bidding-document/bid/${id}`);
}

export function getBiddingDocumentsByExistCombined(paging: PaginationRequest) {
  return Vue.axios.get("/bidding-document/combined", {
    params: paging
  });
}

export function createBiddingDocument(biddingDocument: IBiddingDocument) {
  return Vue.axios.post("/bidding-document", biddingDocument);
}

export function updateBiddingDocument(biddingDocument: IBiddingDocument) {
  return Vue.axios.put("/bidding-document", biddingDocument);
}

export function editBiddingDocument(id: number, updates: object) {
  return Vue.axios.patch(`/bidding-document/${id}`, updates);
}

export function removeBiddingDocument(id: number) {
  return Vue.axios.delete(`/bidding-document/${id}`);
}
