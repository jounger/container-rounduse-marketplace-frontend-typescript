import Vue from "vue";
import { PaginationRequest } from "./payload";

export function getBookingsByOutbound(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/booking/outbound/${id}`, {
    params: paging
  });
}

export function getBooking(id: number) {
  return Vue.axios.get(`/booking/${id}`);
}

export function getBookingsByBookingNumber(number: string) {
  return Vue.axios.get(`/booking/${number}`);
}

export function editBooking(id: number, updates: object) {
  return Vue.axios.patch(`/booking/${id}`, updates);
}
