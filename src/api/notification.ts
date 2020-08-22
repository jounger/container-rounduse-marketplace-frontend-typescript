import Vue from "vue";
import { PaginationRequest } from "@/entity/payload";

export function getNotifications(paging: PaginationRequest) {
  return Vue.axios.get("/notification/user", {
    params: paging
  });
}

export function getBiddingNotifications(paging: PaginationRequest) {
  return Vue.axios.get("/bidding-notification", {
    params: paging
  });
}

export function getShippingNotifications(paging: PaginationRequest) {
  return Vue.axios.get(`/shipping-notification/`, {
    params: paging
  });
}

export function getCombinedNotifications(paging: PaginationRequest) {
  return Vue.axios.get(`/combined-notification/`, {
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

export function getCombinedNotification(id: number) {
  return Vue.axios.get(`/combined-notification/${id}`);
}

export function getShippingNotification(id: number) {
  return Vue.axios.get(`/shipping-notification/${id}`);
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
