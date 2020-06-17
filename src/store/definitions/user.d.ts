export interface UserEntity {
  id?: number;
  username: string;
  email: string;
  phone: string;
  roles: Set<string>;
  status: string;
  address : {
    address: string,
    city: string,
    country: string,
    postalCode: string,
  }
}

export interface SignUpRequest {
  username: string;
  password: string;
  email: string;
  phone: string;
  role: Set<string>;
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
