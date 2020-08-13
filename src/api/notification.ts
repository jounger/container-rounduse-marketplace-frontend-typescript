import Vue from "vue";
import { PaginationRequest } from "./payload";

export function getNotificationsByUser(paging: PaginationRequest) {
  return Vue.axios.get("/notification/user", {
    params: paging
  });
}

export function getBiddingNotificationsByUser(paging: PaginationRequest) {
  return Vue.axios.get("/bidding-notification", {
    params: paging
  });
}

export function getShippingLineNotifications(paging: PaginationRequest) {
  return Vue.axios.get(`/shipping-line-notification/`, {
    params: paging
  });
}

// Get notification by ID
export function getBiddingNotification(id: number) {
  return Vue.axios.get(`/bidding-notification/${id}`);
}

export function getReportNotification(id: number) {
  return Vue.axios.get(`/report-notification/${id}`);
}

export function getDriverNotification(id: number) {
  return Vue.axios.get(`/driver-notification/${id}`);
}

export function getShippingLineNotification(id: number) {
  return Vue.axios.get(`/shipping-line-notification/${id}`);
}

// Edit notification
export function editNotification(id: number, updates: object) {
  return Vue.axios.patch(`/notification/${id}`, updates);
}

export function editBiddingNotifications(id: number, updates: object) {
  return Vue.axios.patch(`/bidding-notification/${id}`, updates);
}

// Remove notification
export function removeBiddingNotifications(id: number) {
  return Vue.axios.delete(`/bidding-notification/${id}`);
}
