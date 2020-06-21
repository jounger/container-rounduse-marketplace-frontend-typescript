import { Address } from '../../views/user/address';
export interface UserEntity {
  id?: number;
  username: string;
  password?: string;
  email: string;
  phone: string;
  role: Array<string>;
  status: string;
  address?: Address;
}

export interface SignUpRequest {
  username: string;
  password: string;
  email: string;
  phone: string;
  role:  Array<string>;
  address : {
    address: string,
    city: string,
    country: string,
    postalCode: string,
  };
  status: number;
}

export interface SignInRequest {
  username: string;
  password: string;
}
