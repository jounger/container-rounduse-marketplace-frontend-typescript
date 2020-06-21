import { UserEntity } from '../../../store/definitions/user';
export interface Driver extends UserEntity{
  id?: number,
  driverName: string,
  driverLicense: string,
  location?: string
}
