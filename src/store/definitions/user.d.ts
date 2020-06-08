export interface UserEntity {
  id?: number;
  username: string;
  email: string;
  fullname: string;
  role: Set<string>;
}

export interface SignUpRequest {
  username: string;
  password: string;
  email: string;
  fullname: string;
  role: Set<string>;
}

export interface SignInRequest {
  username: string;
  password: string;
}
