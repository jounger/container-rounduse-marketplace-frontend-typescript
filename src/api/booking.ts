import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IBooking } from "@/entity/booking";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getBookingsByOutbound(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/booking/outbound/${id}`, {
    params: paging,
    headers: config
  });
}
export function getBooking(id: number) {
  return Vue.axios.get(`/booking/${id}`, {
    headers: config
  });
}
export function getBookingsByBookingNumber(number: string) {
  return Vue.axios.get(`/booking/${number}`, {
    headers: config
  });
}
export function updateBooking(booking: IBooking) {
  return Vue.axios.put("/booking", booking, {
    headers: config
  });
}

export function editBooking(id: number, updates: object) {
  return Vue.axios.patch(`/booking/${id}`, updates, {
    headers: config
  });
}
