import { IUser } from './user';
export interface IDriver extends IUser{
  id?: number,
  driverName: string,
  driverLicense: string,
  location?: string
}
