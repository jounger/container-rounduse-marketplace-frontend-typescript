import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IBillOfLading } from "@/entity/bill-of-lading";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getBillOfLadingsByInbound(
  id: number,
  paging: PaginationRequest
) {
  return Vue.axios.get(`/bill-of-lading/inbound/${id}`, {
    params: paging,
    headers: config
  });
}

export function updateBillOfLading(billOfLading: IBillOfLading) {
  return Vue.axios.put("/bill-of-lading", billOfLading, {
    headers: config
  });
}

export function editBillOfLading(id: number, updates: IBillOfLading) {
  return Vue.axios.patch(`/bill-of-lading/${id}`, updates, {
    headers: config
  });
}
