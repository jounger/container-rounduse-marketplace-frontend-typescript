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

export function createFeedback(id: number, feedback: IFeedback) {
  return Vue.axios.post(`/feedback/report/${id}`, feedback, {
    headers: config
  });
}

export function createFeedbackToModerator(
  id: number,
  name: string,
  feedback: IFeedback
) {
  return Vue.axios.post("/feedback", feedback, {
    params: {
      id: id,
      name: name
    },
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
