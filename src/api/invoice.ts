import Vue from "vue";
import { PaginationRequest } from "@/entity/payload";
import { IInvoice } from "@/entity/invoice";

export function searchInvoices(search: string, paging: PaginationRequest) {
  return Vue.axios.get("/invoice/filter", {
    params: { paging, search }
  });
}

export function getInvoices(paging: PaginationRequest) {
  return Vue.axios.get("/invoice", {
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
