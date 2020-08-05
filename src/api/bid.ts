import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IBid } from "@/entity/bid";

export function getBids(paging: PaginationRequest) {
  return Vue.axios.get("/bid", {
    params: paging
  });
}

export function getBid(id: number) {
  return Vue.axios.get(`/bid/${id}`);
}

export function getBidsByForwarder(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/bid/forwarder/${id}`, {
    params: paging
  });
}
export function getBidsByBiddingDocument(
  id: number,
  paging: PaginationRequest
) {
  return Vue.axios.get(`/bid/merchant/${id}`, {
    params: paging
  });
}
export function getBidByBiddingDocumentAndForwarder(id: number) {
  return Vue.axios.get(`/bid/bidding-document/${id}`);
}

export function createBid(id: number, bid: IBid) {
  return Vue.axios.post(`/bid/bidding-document/${id}`, bid);
}
export function addContainer(id: number, contId: number) {
  return Vue.axios.post(`/bid/${id}/container/${contId}`);
}
export function removeContainer(id: number, contId: number) {
  return Vue.axios.delete(`/bid/${id}/container/${contId}`);
}
export function replaceContainer(id: number, updates: object) {
  return Vue.axios.patch(`/bid/${id}/container`, updates);
}

export function updateBid(bid: IBid) {
  return Vue.axios.put("/bid", bid);
}

export function editBid(id: number, updates: object) {
  return Vue.axios.patch(`/bid/${id}`, updates);
}

export function removeBid(id: number) {
  return Vue.axios.delete(`/bid/${id}`);
}
