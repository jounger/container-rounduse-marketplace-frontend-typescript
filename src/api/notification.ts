import Vue from "vue";
import { PaginationRequest } from "./payload";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getNotificationsByUser(paging: PaginationRequest) {
  return Vue.axios.get("/notification/user", {
    params: paging,
    headers: config
  });
}

export function getBiddingNotificationsByUser(paging: PaginationRequest) {
  return Vue.axios.get("/bidding-notification", {
    params: paging,
    headers: config
  });
}

// Get notification by ID
export function getBiddingNotification(id: number) {
  return Vue.axios.get(`/bidding-notification/${id}`, {
    headers: config
  });
}

export function getReportNotification(id: number) {
  return Vue.axios.get(`/report-notification/${id}`, {
    headers: config
  });
}

export function getDriverNotification(id: number) {
  return Vue.axios.get(`/driver-notification/${id}`, {
    headers: config
  });
}

export function getShippingLineNotification(id: number) {
  return Vue.axios.get(`/shipping-line-notification/${id}`, {
    headers: config
  });
}

// Edit notification
export function editBiddingNotifications(id: number, updates: object) {
  return Vue.axios.patch(`/bidding-notification/${id}`, updates, {
    headers: config
  });
}

export function removeBiddingNotifications(id: number) {
  return Vue.axios.delete(`/bidding-notification/${id}`, {
    headers: config
  });
}
