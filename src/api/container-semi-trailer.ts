import Vue from "vue";
import { PaginationRequest } from "./payload";
import { IContainerSemiTrailer } from "@/entity/container-semi-trailer";

export function getContainerSemiTrailers(paging: PaginationRequest) {
  return Vue.axios.get("/container-semi-trailer", {
    params: paging
  });
}

export function getContainerSemiTrailersByForwarder(paging: PaginationRequest) {
  return Vue.axios.get("/container-semi-trailer/forwarder", {
    params: paging
  });
}

export function getContainerSemiTrailer(id: number) {
  return Vue.axios.get(`/container-semi-trailer/${id}`);
}

export function createContainerSemiTrailer(
  containerSemiTrailer: IContainerSemiTrailer
) {
  return Vue.axios.post("/container-semi-trailer", containerSemiTrailer);
}

export function updateContainerSemiTrailer(
  containerSemiTrailer: IContainerSemiTrailer
) {
  return Vue.axios.put("/container-semi-trailer", containerSemiTrailer);
}

export function editContainerSemiTrailer(id: number, updates: object) {
  return Vue.axios.patch(`/container-semi-trailer/${id}`, updates);
}

export function removeContainerSemiTrailer(id: number) {
  return Vue.axios.delete(`/container-semi-trailer/${id}`);
}
