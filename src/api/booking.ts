import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IBooking } from "@/entity/booking";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getBookingByOutbound(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/booking/outbound/${id}`, {
    params: paging,
    headers: config
  });
}

export function updateBooking(booking: IBooking) {
  return Vue.axios.put("/booking", booking, {
    headers: config
  });
}

export function editBooking(id: number, updates: IBooking) {
  return Vue.axios.patch(`/booking/${id}`, updates, {
    headers: config
  });
}

