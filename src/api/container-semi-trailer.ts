import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IContainerSemiTrailer } from "../entity/container-semi-trailer";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getContainerSemiTrailers(paging: PaginationRequest) {
  return Vue.axios.get("/container-semi-trailer", {
    params: paging,
    headers: config
  });
}

export function getContainerSemiTrailer(id: number) {
  return Vue.axios.get(`/container-semi-trailer/${id}`, {
    headers: config
  });
}

export function createContainerSemiTrailer(
  containerSemiTrailer: IContainerSemiTrailer
) {
  return Vue.axios.post("/container-semi-trailer", containerSemiTrailer, {
    headers: config
  });
}

export function updateContainerSemiTrailer(
  containerSemiTrailer: IContainerSemiTrailer
) {
  return Vue.axios.put("/container-semi-trailer", containerSemiTrailer, {
    headers: config
  });
}

export function editContainerSemiTrailer(id: number, updates: object) {
  return Vue.axios.patch(`/container-semi-trailer/${id}`, updates, {
    headers: config
  });
}

export function removeContainerSemiTrailer(id: number) {
  return Vue.axios.delete(`/container-semi-trailer/${id}`, {
    headers: config
  });
}
