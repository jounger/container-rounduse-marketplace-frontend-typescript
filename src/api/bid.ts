import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IBid } from "../entity/bid";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getBids(paging: PaginationRequest) {
  return Vue.axios.get("/bid", {
    params: paging,
    headers: config
  });
}

export function getBid(id: number) {
  return Vue.axios.get(`/bid/${id}`, {
    headers: config
  });
}

export function getBidsByForwarder(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/bid/forwarder/${id}`, {
    params: paging,
    headers: config
  });
}
export function getBidsByBiddingDocument(
  id: number,
  paging: PaginationRequest
) {
  return Vue.axios.get(`/bid/merchant/${id}`, {
    params: paging,
    headers: config
  });
}

export function createBid(id: number, bid: IBid) {
  return Vue.axios.post(`/bid/bidding-document/${id}`, bid, {
    headers: config
  });
}

export function updateBid(bid: IBid) {
  return Vue.axios.put("/bid", bid, {
    headers: config
  });
}

export function editBid(id: number, updates: IBid) {
  return Vue.axios.patch(`/bid/${id}`, updates, {
    headers: config
  });
}

export function removeBid(id: number) {
  return Vue.axios.delete(`/bid/${id}`, {
    headers: config
  });
}