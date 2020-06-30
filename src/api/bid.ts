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
  return Vue.axios.get(`/bid/forwarder/${id}`, {
    params: paging,
    headers: config
  });
}

export function CreateBiddingDocument(bid: IBid) {
  return Vue.axios.post("/bid", bid, {
    headers: config
  });
}

export function updateBid(bid: IBid) {
  return Vue.axios.put("/bid", bid, {
    headers: config
  });
}

export function editBid(id: number, updates: Map<string, object>) {
  return Vue.axios.patch(`/bid/${id}`, updates, {
    headers: config
  });
}

export function removeBid(id: number) {
  return Vue.axios.delete(`/bid/${id}`, {
    headers: config
  });
}
