import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IReport } from "../entity/report";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getReportsByUser(paging: PaginationRequest) {
  return Vue.axios.get("/report/user", {
    params: paging,
    headers: config
  });
}
export function getReports(paging: PaginationRequest) {
  return Vue.axios.get("/report", {
    params: paging,
    headers: config
  });
}

export function createReport(report: IReport) {
  return Vue.axios.post("/report", report, {
    headers: config
  });
}

export function editReport(id: number, updates: object) {
  return Vue.axios.patch(`/report/${id}`, updates, {
    headers: config
  });
}

export function removeReport(id: number) {
  return Vue.axios.delete(`/report/${id}`, {
    headers: config
  });
}
export function getReport(id: number) {
  return Vue.axios.get(`/report/${id}`, {
    headers: config
  });
}
