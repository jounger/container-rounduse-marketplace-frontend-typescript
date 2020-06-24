import { IUser } from "./user";
export interface ISupplier extends IUser {
  website: string;
  contactPerson: string;
  companyName: string;
  companyCode: string;
  companyDescription?: string;
  companyAddress: string;
  tin: string;
  fax: string;
  ratingValue: number;
}
