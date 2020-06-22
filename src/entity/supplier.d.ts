import { IUser } from './user';
export interface ISupplier extends IUser {
  website: string;
  contactPerson: string;
  companyName: string;
  shortName: string;
  companyDescription?: string;
  tin: string;
  tax: string;
}
