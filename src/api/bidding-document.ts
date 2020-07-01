import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IBiddingDocument } from "../entity/bidding-document";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getBiddingDocuments(paging: PaginationRequest) {
  return Vue.axios.get("/bidding-document", {
    params: paging,
    headers: config
  });
}

export function getBiddingDocument(id: number) {
  return Vue.axios.get(`/bidding-document/${id}`, {
    headers: config
  });
}

export function getBiddingDocumentsByMerchant(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/bidding-document/merchant/${id}`, {
    params: paging,
    headers: config
  });
}

export function createBiddingDocument(biddingDocument: IBiddingDocument) {
  return Vue.axios.post("/bidding-document", biddingDocument, {
    headers: config
  });
}

export function updateBiddingDocument(biddingDocument: IBiddingDocument) {
  return Vue.axios.put("/bidding-document", biddingDocument, {
    headers: config
  });
}

export function editBiddingDocument(id: number, updates: object) {
  return Vue.axios.patch(`/bidding-document/${id}`, updates, {
    headers: config
  });
}

export function removeBiddingDocument(id: number) {
  return Vue.axios.delete(`/bidding-document/${id}`, {
    headers: config
  });
}
