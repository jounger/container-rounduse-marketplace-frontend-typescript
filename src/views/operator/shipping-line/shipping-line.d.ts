import { UserEntity } from '../../../store/definitions/user';
export interface ShippingLineEntity extends UserEntity {
  website: string;
  companyName: string;
  companyCode: string;
}
