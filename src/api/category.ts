import Vue from "vue";
import { PaginationRequest } from "./payload";
import { ICategory } from "@/entity/category";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getCategories(paging: PaginationRequest) {
  return Vue.axios.get("/category", {
    params: paging,
    headers: config
  });
}

export function getCategoryById(id: number) {
  return Vue.axios.get(`/category/${id}`, {
    headers: config
  });
}

export function createCategory(category: ICategory) {
  return Vue.axios.post("/category", category, {
    headers: config
  });
}

export function updateCategory(category: ICategory) {
  return Vue.axios.put("/category", category, {
    headers: config
  });
}

export function editCategory(id: number, updates: Map<string, object>) {
  return Vue.axios.patch(`/category/${id}`, updates, {
    headers: config
  });
}

export function removeCategory(id: number) {
  return Vue.axios.delete(`/category/${id}`, {
    headers: config
  });
}
