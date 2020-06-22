import { UserEntity } from '../../../store/definitions/user';
import { Address } from '../../user/address';
export interface SupplierEntity extends UserEntity {
  website: string;
  contactPerson: string;
  companyName: string;
  shortName: string;
  companyDescription: string;
  tin: string;
  tax: string;
}
