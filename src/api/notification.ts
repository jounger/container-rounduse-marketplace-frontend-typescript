import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IBiddingNotification } from "../entity/bidding-notification";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getBiddingNotificationsByUser(paging: PaginationRequest) {
  return Vue.axios.get("/bidding-notification", {
    params: paging,
    headers: config
  });
}

export function getBiddingNotification(id: number) {
  return Vue.axios.get(`/bidding-notification/${id}`, {
    headers: config
  });
}

export function editBiddingNotifications(id: number, updates: IBiddingNotification) {
  return Vue.axios.patch(`/bidding-notification/${id}`, updates, {
    headers: config
  });
}

export function removeBiddingNotifications(id: number) {
  return Vue.axios.delete(`/bidding-notification/${id}`, {
    headers: config
  });
}
