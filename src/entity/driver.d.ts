import { IUser } from './user';
export interface IDriver extends IUser{
  id?: number;
  fullname: string;
  driverLicense: string;
  location?: string;
}
