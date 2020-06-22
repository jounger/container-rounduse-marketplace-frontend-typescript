import { IUser } from './user';
export interface IShippingLine extends IUser {
  website: string;
  companyName: string;
  companyCode: string;
  icds?: Set<any>
}
