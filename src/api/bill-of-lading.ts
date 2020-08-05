import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IBillOfLading } from "@/entity/bill-of-lading";

export function getBillOfLadingsByInbound(
  id: number,
  paging: PaginationRequest
) {
  return Vue.axios.get(`/bill-of-lading/inbound/${id}`, {
    params: paging
  });
}
export function getBillOfLading(id: number) {
  return Vue.axios.get(`/bill-of-lading/${id}`);
}
export function getBillOfLadingByBillOfLadingNumber(number: string) {
  return Vue.axios.get(`/bill-of-lading/${number}`);
}

export function updateBillOfLading(billOfLading: IBillOfLading) {
  return Vue.axios.put("/bill-of-lading", billOfLading);
}

export function editBillOfLading(id: number, updates: object) {
  return Vue.axios.patch(`/bill-of-lading/${id}`, updates);
}
