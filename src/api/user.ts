import Vue from "vue";
import { PaginationRequest, PaginationResponse, JwtResponse } from "./payload";
import { UserEntity } from "../entity/user";

const config = {
  Authorization: "Bearer {auth_token}"
};

export function getProfile(){
  return Vue.axios.get("/auth/user", {
    headers: config
  });
}

export function getUsers(paging: PaginationRequest) {
  return Vue.axios.get("/user", {
    params: paging,
    headers: config
  });
}
