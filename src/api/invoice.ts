import Vue from "vue";
import { PaginationRequest } from "@/entity/payload";
import { IInvoice } from "@/entity/invoice";

export function searchInvoices(paging: PaginationRequest, search: string) {
  return Vue.axios.get("/invoice/filter", {
    params: { paging, search }
  });
}

export function getInvoicesByUser(paging: PaginationRequest) {
  return Vue.axios.get("/invoice/user", {
    params: paging
  });
}
export function getInvoicesByContract(id: number, paging: PaginationRequest) {
  return Vue.axios.get(`/invoice/contract/${id}`, {
    params: paging
  });
}
export function createInvoice(id: number, invoice: IInvoice) {
  return Vue.axios.post(`/invoice/contract/${id}`, invoice);
}

export function editInvoice(id: number, updates: object) {
  return Vue.axios.patch(`/invoice/${id}`, updates);
}

export function removeInvoice(id: number) {
  return Vue.axios.delete(`/invoice/${id}`);
}
