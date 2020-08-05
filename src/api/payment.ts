import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IPayment } from "@/entity/payment";

export function searchPayments(paging: PaginationRequest, search: string) {
  return Vue.axios.get("/payment/filter", {
    params: { paging, search }
  });
}

export function getPaymentsByUser(paging: PaginationRequest) {
  return Vue.axios.get("/payment/user", {
    params: paging
  });
}
export function getPaymentsByContract(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/payment/contract/${id}`, {
    params: paging
  });
}
export function createPayment(id: number, payment: IPayment) {
  return Vue.axios.post(`/payment/contract/${id}`, payment);
}

export function editPayment(id: number, updates: object) {
  return Vue.axios.patch(`/payment/${id}`, updates);
}

export function removePayment(id: number) {
  return Vue.axios.delete(`/payment/${id}`);
}
