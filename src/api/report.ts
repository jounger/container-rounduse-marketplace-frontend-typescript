import Vue from "vue";
import { PaginationRequest } from "../entity/payload";
import { IReport } from "@/entity/report";

export function getReportsByUser(paging: PaginationRequest) {
  return Vue.axios.get("/report/user", {
    params: paging
  });
}

export function getReports(paging: PaginationRequest) {
  return Vue.axios.get("/report", {
    params: paging
  });
}

export function createReport(report: IReport) {
  return Vue.axios.post("/report", report);
}

export function editReport(id: number, updates: object) {
  return Vue.axios.patch(`/report/${id}`, updates);
}

export function removeReport(id: number) {
  return Vue.axios.delete(`/report/${id}`);
}
export function getReport(id: number) {
  return Vue.axios.get(`/report/${id}`);
}
