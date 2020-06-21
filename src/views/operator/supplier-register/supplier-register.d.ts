import { UserEntity } from '../../../store/definitions/user';
export interface SupplierRegister extends UserEntity{
  id?: number,
  username: string,
  postalCode: string,
  email: string,
  country: string,
  phone: string,
  city: string,
  address: string
}
