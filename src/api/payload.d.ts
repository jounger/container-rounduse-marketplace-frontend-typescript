import { IUser } from "@/entity/user";
export interface JwtResponse {
  id_token: string;
  userInfo: IUser;
}

export interface PaginationRequest {
  page: number;
  limit: number;
  status?: string;
}

export interface PaginationResponse<T> {
  page: number;
  limit: number;
  total_elements: number;
  total_pages: number;
  data: T[];
}
