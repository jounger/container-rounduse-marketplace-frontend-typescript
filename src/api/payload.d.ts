import { UserEntity } from '../store/definitions/user';
export interface JwtResponse {
  id_token: string;
  userInfo: UserEntity
}

export interface PaginationRequest {
  page: number;
  limit: number;
}

export interface PaginationResponse<T> {
  page: number;
  limit: number;
  total_elements: number;
  total_pages: number;
  data: T[];
}
