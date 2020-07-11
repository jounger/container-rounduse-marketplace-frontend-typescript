import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IFeedback } from "../entity/feedback";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getFeedbacksByReport(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/feedback/report/${id}`, {
    params: paging,
    headers: config
  });
}
export function getFeedbacksByUser(paging: PaginationRequest) {
  return Vue.axios.get("/feedback/user", {
    params: paging,
    headers: config
  });
}

export function createFeedback(feedback: IFeedback) {
  return Vue.axios.post("/feedback", feedback, {
    headers: config
  });
}

export function editFeedback(id: number, updates: object) {
  return Vue.axios.patch(`/feedback/${id}`, updates, {
    headers: config
  });
}

export function removeFeedback(id: number) {
  return Vue.axios.delete(`/feedback/${id}`, {
    headers: config
  });
}
