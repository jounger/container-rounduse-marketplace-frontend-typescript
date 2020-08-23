import Vue from "vue";
import { PaginationRequest } from "../entity/payload";
import { IBid } from "@/entity/bid";

export function getBids(paging: PaginationRequest) {
  return Vue.axios.get("/bid", {
    params: paging
  });
}

export function getBid(id: number) {
  return Vue.axios.get(`/bid/${id}`);
}

export function getBidsByBiddingDocument(
  id: number,
  paging: PaginationRequest
) {
  return Vue.axios.get(`/bid/bidding-document/${id}`, {
    params: paging
  });
}

export function createBid(id: number, bid: IBid) {
  return Vue.axios.post(`/bid/bidding-document/${id}`, bid);
}

export function addContainers(id: number, request: object) {
  return Vue.axios.post(`/bid/${id}/container`, request);
}

export function removeContainer(id: number, contId: number) {
  return Vue.axios.delete(`/bid/${id}/container/${contId}`);
}

export function replaceContainer(id: number, updates: object) {
  return Vue.axios.patch(`/bid/${id}/container`, updates);
}

export function editBid(id: number, updates: object) {
  return Vue.axios.patch(`/bid/${id}`, updates);
}

export function removeBid(id: number) {
  return Vue.axios.delete(`/bid/${id}`);
}
