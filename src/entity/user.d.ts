export interface IUser {
  id?: number;
  username: string;
  email: string;
  phone: string;
  roles: Array<string>;
  status: string;
  address: string;
  password: string;
}

export interface ISignUpRequest {
  username: string;
  password: string;
  email: string;
  phone: string;
  roles: Array<string>;
  address?: string;
}

export interface ISignInRequest {
  username: string;
  password: string;
}
