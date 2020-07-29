import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IPayment } from "../entity/payment";

const config = {
  Authorization: "Bearer {auth_token}"
};
export function searchPayments(paging: PaginationRequest, search: string) {
  return Vue.axios.get("/payment/filter", {
    params: { ...paging, search },
    headers: config
  });
}

export function getPaymentsByUser(paging: PaginationRequest) {
  return Vue.axios.get("/payment/user", {
    params: paging,
    headers: config
  });
}
export function getPaymentsByContract(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/payment/contract/${id}`, {
    params: paging,
    headers: config
  });
}
export function createPayment(id: number, payment: IPayment) {
  return Vue.axios.post(`/payment/contract/${id}`, payment, {
    headers: config
  });
}

export function editPayment(id: number, updates: object) {
  return Vue.axios.patch(`/payment/${id}`, updates, {
    headers: config
  });
}

export function removePayment(id: number) {
  return Vue.axios.delete(`/payment/${id}`, {
    headers: config
  });
}
