import { IUser } from "./user";
export interface ISupplier extends IUser {
  website: string;
  companyName: string;
  companyCode: string;
  companyDescription?: string;
  companyAddress: string;
  brcScanPath?: string;
  tin: string;
  fax: string;
  ratingValue?: number;
  ratingCount?: number;
}
