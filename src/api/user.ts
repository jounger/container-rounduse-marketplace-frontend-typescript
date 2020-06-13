import Vue from "vue";
import { PaginationRequest, PaginationResponse, JwtResponse } from './payload';
import { UserEntity } from '../store/definitions/user';

const config = {
  Authorization: "Bearer {auth_token}"
}

export async function getProfile(): Promise<UserEntity> {
  const response = await Vue.axios.get("/auth/user", {
    headers: config
  });
  return (response.data as JwtResponse).userInfo;
}

export async function getUsers(paging: PaginationRequest): Promise<PaginationResponse<UserEntity>> {
  const response = await Vue.axios.get("/admin/user", {
    params: paging,
    headers: config
  });
  return (response.data as PaginationResponse<UserEntity>);
}

