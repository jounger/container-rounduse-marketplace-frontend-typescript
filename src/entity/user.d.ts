import { IAddress } from './address';
export interface IUser {
  id?: number;
  username: string;
  password?: string;
  email: string;
  phone: string;
  role: Array<string>;
  status: string;
  address?: IAddress;
}

export interface ISignUpRequest {
  username: string;
  password: string;
  email: string;
  phone: string;
  role:  Array<string>;
  address?: IAddress
  status?: string;
}

export interface ISignInRequest {
  username: string;
  password: string;
}
